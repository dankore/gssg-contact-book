const express = require('express');
const router = express.Router();
const controller = require('./controllers/controller');
const upload = require('./misc/file-upload');
const singleUpload = upload.single('photo');
const passport = require('passport');
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// HOME, REGISTER, LOGIN
router.get('/', controller.home);
router.get('/contacts', controller.contacts);
router.get('/register', controller.registrationPage);
router.post('/register', controller.registrationSubmission);
router.get('/login', controller.loginPage);
router.post('/login', apiLimiter, controller.login);
router.post('/logout', controller.logout);
router.get('/about', controller.about);

// PROFILE
router.get('/profile/:email', controller.ifUserExists, controller.profileScreen);
router.get('/profile/:email/edit', controller.mustBeLoggedIn, controller.isVisitorOwner, controller.viewEditScreen);
router.post('/profile/:email/edit', singleUpload, controller.edit);

// ACCOUNT
router.get('/account/:email', controller.mustBeLoggedIn, controller.isVisitorOwner, controller.account);
router.post('/account/:email/delete', controller.account.delete);
router.get('/account/:email/change-password', controller.mustBeLoggedIn, controller.changePasswordPage);
router.post('/account/:email/change-password', controller.changePassword);

// RESET PASSWORD
router.get('/reset-password', controller.resetPasswordPage);
router.post('/reset-password', controller.resetPassword);
router.get('/reset-password/:token', controller.resetPasswordTokenPage);
router.post('/reset-password/:token', controller.resetPasswordToken);

// PRIVACY
router.get('/privacy', controller.privacy);

// AXIOS
router.post('/doesEmailExists', controller.doesEmailExists);

// GOOGLE
router.get('/google-login', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'] }));
router.get('/google-login/callback', passport.authenticate('google', { failureRedirect: '/register' }), controller.googleLogin);

// TWITTER
router.get('/twitter-login', passport.authenticate('twitter'));
router.get('/twitter-login/callback', passport.authenticate('twitter', { failureRedirect: '/register' }), controller.twitterLogin);

// COMMENTS
router.post('/get-comments', controller.addComment);
router.post('/delete-comment', controller.deleteComment);
router.post('/edit-comment', controller.editComment);

// LIKES
router.post('/likes', controller.likes);
router.post('/get-visited-profile-doc', controller.getProfile);

router.get('/contacts', controller.contacts);

// NOT FOUND
router.get('*', controller.notFound);

// EXPORT CODE
module.exports = router;
