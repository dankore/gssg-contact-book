const express = require('express');
const router = express.Router();
const userController = require('./controllers/user');
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
router.get('/', userController.home);
router.get('/contacts', userController.contacts);
router.get('/register', csrfProtection, userController.registrationPage);
router.post('/register', csrfProtection, userController.registrationSubmission);
router.get('/login', csrfProtection, userController.loginPage);
router.post('/login', csrfProtection, apiLimiter, userController.login);
router.post('/logout', userController.logout);
router.get('/about', userController.about);

// PROFILE
router.get('/contacts/:username', userController.ifUserExists, userController.profileScreen);

// SETTINGS
router.get('/settings/:username', userController.mustBeLoggedIn, userController.isVisitorOwner, userController.settingsPage);
router.get('/settings/:username/edit-profile', csrfProtection, userController.mustBeLoggedIn, userController.isVisitorOwner, userController.editProfile);
router.post('/settings/:username/edit-profile', csrfProtection, userController.mustBeLoggedIn, userController.isVisitorOwner, userController.edit);
router.get('/settings/:username/change-profile-photo', csrfProtection, userController.mustBeLoggedIn, userController.isVisitorOwner, userController.changeProfilePhotoPage);
router.post('/settings/:username/change-profile-photo', userController.mustBeLoggedIn, singleUpload, csrfProtection, userController.isVisitorOwner, userController.changeProfilePhoto);
router.get('/settings/:username/delete-account', csrfProtection, userController.mustBeLoggedIn, userController.isVisitorOwner, userController.deleteAccountPage);
router.post('/settings/:username/delete-account', csrfProtection, userController.mustBeLoggedIn, userController.isVisitorOwner, userController.deleteAccount);
router.get('/settings/:username/change-password', csrfProtection, userController.mustBeLoggedIn, userController.isVisitorOwner, userController.changePasswordPage);
router.post('/settings/:username/change-password', csrfProtection, userController.mustBeLoggedIn, userController.isVisitorOwner, userController.changePassword);

// RESET PASSWORD
router.get('/reset-password', csrfProtection, userController.resetPasswordPage);
router.post('/reset-password', csrfProtection, userController.resetPassword);
router.get('/reset-password/:token', csrfProtection, userController.resetPasswordTokenPage);
router.post('/reset-password/:token', csrfProtection, userController.resetPasswordToken);

// PRIVACY
router.get('/privacy', userController.privacy);

router.post('/doesEmailExist', userController.doesEmailExist);

// GOOGLE
router.get('/google-login', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));
router.get('/google-login/callback', passport.authenticate('google', { failureRedirect: '/register' }), userController.googleLogin);

// COMMENTS
router.post('/add-comment', userController.addComment);
router.post('/delete-comment', userController.deleteComment);
router.post('/edit-comment', userController.editComment);

router.get('/contacts', userController.contacts);

// SITE MAP
router.get('/sitemap.xml', userController.sitemap);

// ERROR
router.get('/success', userController.successPage);
router.get('/error', userController.errorPage);

// NOT FOUND
router.get('*', userController.notFound);

// EXPORT CODE
module.exports = router;
