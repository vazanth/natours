const express = require('express');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getCurrentUser,
  updateCurrentUser,
  deleteCurrentUser,
} = require('../controllers/userController');
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  protectedRoute,
  confirmUser,
  resendConfirmation,
  restrictTo,
} = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/confirmuser', confirmUser);
router.post('/resendconfirmation', resendConfirmation);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', resetPassword);

router.use(protectedRoute); //middleware to apply protection to below routes in common

router.patch('/changepassword', changePassword);
router.get('/getcurrentuser', getCurrentUser, getUser);
router.patch('/updatecurrentuser', updateCurrentUser);
router.delete('/deletecurrentuser', deleteCurrentUser);

router.use(restrictTo('admin')); //middleware to apply protection to below routes in common

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
