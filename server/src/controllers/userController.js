const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const filtered = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) filtered[el] = obj[el];
  });
  return filtered;
};

exports.updateCurrentUser = catchAsync(async (req, res, next) => {
  //check if password is passed
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('Password cannot be updated', 400));
  }
  //update document
  const filterBody = filterObj(req.body, 'name', 'email', 'photo');
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser,
    },
  });
});

exports.deleteCurrentUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.getCurrentUser = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
