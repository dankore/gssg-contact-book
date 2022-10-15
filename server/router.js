const express = require('express');
const router = express.Router();
const controller = require('./controllers/controller');
const { upload_to_cloudinary } = require('./misc/file-upload-cloudinary');
const singleUpload = upload_to_cloudinary.single('photo');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// HOME, REGISTER, LOGIN
router.get('/', controller.home);
router.get('/contacts', controller.contacts);
router.get('/register', csrfProtection, controller.registrationPage);
router.post('/register', csrfProtection, controller.registrationSubmission);
router.get('/login', csrfProtection, controller.loginPage);
router.post('/login', csrfProtection, apiLimiter, controller.login);
router.post('/logout', controller.logout);
router.get('/about', controller.about);

// PROFILE
router.get('/contacts/:username', controller.ifUserExists, controller.profileScreen);

// SETTINGS
router.get('/settings/:username', controller.mustBeLoggedIn, controller.isVisitorOwner, controller.settingsPage);
router.get('/settings/:username/edit-profile', csrfProtection, controller.mustBeLoggedIn, controller.isVisitorOwner, controller.editProfile);
router.post('/settings/:username/edit-profile', csrfProtection, controller.mustBeLoggedIn, controller.isVisitorOwner, controller.edit);
router.get('/settings/:username/change-profile-photo', csrfProtection, controller.mustBeLoggedIn, controller.isVisitorOwner, controller.changeProfilePhotoPage);
router.post('/settings/:username/change-profile-photo', controller.mustBeLoggedIn, singleUpload, csrfProtection, controller.isVisitorOwner, controller.changeProfilePhoto);
router.get('/settings/:username/delete-account', csrfProtection, controller.mustBeLoggedIn, controller.isVisitorOwner, controller.deleteAccountPage);
router.post('/settings/:username/delete-account', csrfProtection, controller.mustBeLoggedIn, controller.isVisitorOwner, controller.deleteAccount);
router.get('/settings/:username/change-password', csrfProtection, controller.mustBeLoggedIn, controller.isVisitorOwner, controller.changePasswordPage);
router.post('/settings/:username/change-password', csrfProtection, controller.mustBeLoggedIn, controller.isVisitorOwner, controller.changePassword);

// RESET PASSWORD
router.get('/reset-password', csrfProtection, controller.resetPasswordPage);
router.post('/reset-password', csrfProtection, controller.resetPassword);
router.get('/reset-password/:token', csrfProtection, controller.resetPasswordTokenPage);
router.post('/reset-password/:token', csrfProtection, controller.resetPasswordToken);

// PRIVACY
router.get('/privacy', controller.privacy);

// AXIOS
router.post('/doesEmailExists', controller.doesEmailExists);

// GOOGLE
router.get('/google-login', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));
router.get('/google-login/callback', passport.authenticate('google', { failureRedirect: '/register' }), controller.googleLogin);

// COMMENTS
router.post('/add-comment', controller.addComment);
router.post('/delete-comment', controller.deleteComment);
router.post('/edit-comment', controller.editComment);

router.get('/contacts', controller.contacts);

// ERROR
router.get('/error', controller.error);

// NOT FOUND
router.get('*', controller.notFound);

// EXPORT CODE
module.exports = router;
