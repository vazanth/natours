const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your Name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your Email'],
    validate: [validator.isEmail, 'Email Provided is not valid'],
    unique: true,
    lowercase: true,
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    validate: [
      validator.isStrongPassword,
      'Password should have 8 characters with one uppercase, one lowercase, a number and a symbol',
    ],
    select: false, // will not come in response
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //only works on SAVE or CREATE!!! wont work on update
      validator: function (val) {
        return val === this.password;
      },
      message: 'Password does not match',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  verifiedUser: {
    type: Boolean,
    default: false,
    select: false,
  },
  verificationToken: String,
  verificationTokenExpires: Date,
});

userSchema.pre('save', async function (next) {
  //Will only run if password field is modified
  if (!this.isModified('password')) return next();

  //hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  //delete confirmPassword field
  this.confirmPassword = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  //Will only run if password field is modified
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//available on all user documents not model (User)
userSchema.methods.isCorrectPassword = async function (
  enteredPassword,
  userPassword,
) {
  return await bcrypt.compare(enteredPassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const passwordChangedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );
    return JWTTimeStamp < passwordChangedTimeStamp;
  }
  return false;
};

userSchema.methods.createPwdResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.passwordResetExpires = Date.now() + 5 * 60 * 1000;
  return resetToken;
};

userSchema.methods.createverificationToken = function () {
  const verifyToken = crypto.randomBytes(32).toString('hex');

  this.verificationToken = crypto
    .createHash('sha256')
    .update(verifyToken)
    .digest('hex');
  this.verificationTokenExpires = Date.now() + 5 * 60 * 1000;
  return verifyToken;
};

module.exports = mongoose.model('User', userSchema);
