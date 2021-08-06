const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };
  //sending jwt in cookie
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);
  //remove password
  user.password = undefined;
  //sending back response
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const {
    name,
    email,
    password,
    confirmPassword,
    passwordChangedAt,
    role,
  } = req.body;
  //user creation
  const newUser = await User.create({
    name,
    email,
    password,
    confirmPassword,
    passwordChangedAt,
    role,
  });
  //token sign
  // createToken(newUser, 201, res);
  //create a token
  const token = newUser.createverificationToken();
  await newUser.save({ validateBeforeSave: false });
  try {
    const url = `${req.protocol}://${req.get('host')}/`;
    await new Email(newUser, url, token).sendConfirmation();
    res.status(200).json({
      status: 'success',
      message:
        'Confirmation mail has been sent to your email id - Valid only for 5 mins',
    });
  } catch (error) {
    return next(
      new AppError(
        'There was an error sending email, Please try again later',
        500,
      ),
    );
  }
});

exports.resendConfirmation = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  const token = user.createverificationToken();
  await user.save({ validateBeforeSave: false });
  // const message = `<h3>Hi ${user.name},</h3>\n<p>Thank you for registering with Natours.</p>\n<p>Your Token : ${token}</p>\n<p>Regards,</p>\n<p>Team Natours</p>`;
  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: `Account Confirmation - ${user.name} for Natours - Valid only for 5 mins`,
    //   message,
    // });
    const url = `${req.protocol}://${req.get('host')}/`;
    await new Email(user, url, token).sendConfirmation();
    res.status(200).json({
      status: 'success',
      message:
        'Confirmation mail has been sent to your email id - Valid only for 5 mins',
    });
  } catch (error) {
    return next(
      new AppError(
        'There was an error sending email, Please try again later',
        500,
      ),
    );
  }
});

exports.confirmUser = catchAsync(async (req, res, next) => {
  //verify token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.body.token)
    .digest('hex');
  const user = await User.findOne({
    verificationToken: hashedToken,
    verificationTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Token is invalid or Expired', 400));
  }
  //make user active
  user.verifiedUser = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });
  const url = `${req.protocol}://${req.get('host')}/`;
  await new Email(user, url).sendWelcome();
  //token sign
  createToken(user, 201, res);
});

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  //check if email and password sent in body
  if (typeof email === 'object' || !email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  //check if user exists in DB and the password matches
  const user = await User.findOne({ email }).select('+password +verifiedUser');
  if (!user || !(await user.isCorrectPassword(password, user.password))) {
    return next(new AppError('Username or Password entered is incorrect'), 401);
  }
  if (!user.verifiedUser) {
    return next(
      new AppError('Please confirm your account email is already sent to you'),
      401,
    );
  }
  //send token back to user
  //token sign
  createToken(user, 200, res);
};

exports.protectedRoute = catchAsync(async (req, res, next) => {
  let token = '';
  //verify if token is passed in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else {
    return next(new AppError('User not logged in, Please login!!', 401));
  }
  //verify token signature
  const decodeToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY,
  );
  //check if user still  exists
  const currentUser = await User.findById(decodeToken.id);
  if (!currentUser) {
    return next(
      new AppError('User Belong to this token does not exist anymore', 401),
    );
  }
  // check if user changed passwordd after token was issued
  if (currentUser.passwordChangedAfter(decodeToken.iat)) {
    return next(new AppError('User recently changed password', 401));
  }

  //Grants access to protected routes
  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(
      new AppError(`You don't have access to perform this action`, 403),
    );
  }
  next();
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  //verify if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('Email Not found', 404));
  }
  //generate token
  const token = user.createPwdResetToken();
  await user.save({ validateBeforeSave: false }); //to save hashed token and expires in DB
  //send email
  // const resetUrl = `${req.protocol}://${req.get(
  //   'host',
  // )}/api/v1/users/forgotPassword/${resetToken}`;

  // const message = `Hi ${user.name}, \nForgot Password? Submit your request with new password to: ${resetUrl}\n
  // If you didn't forget your password please ignore this email  \n Regards, \n Team Natours`;
  try {
    const url = `${req.protocol}://${req.get('host')}/`;
    await new Email(user, url, token).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      message: 'Token send to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending email, Please try again later',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user from token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  //set new password if token is not yet expired
  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  //update new password
  await user.save();
  //log the user by sending jwt
  //token sign
  createToken(user, 201, res);
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  //get user from collection
  const user = await User.findById(req.user.id).select('password');
  //check if password is correct
  if (!(await user.isCorrectPassword(currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong'), 401);
  }
  if (currentPassword === newPassword) {
    return next(new AppError('Old and New Password are same'), 401);
  }
  user.password = newPassword;
  user.confirmPassword = confirmPassword;
  //update password
  await user.save();
  createToken(user, 200, res);
});
