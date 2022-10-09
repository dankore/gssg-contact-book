const express = require('express');
const router = express.Router();
const controller = require('./controllers/controller');
const upload = require('./misc/file-upload');
const singleUpload = upload.single('photo');
const passport = require('passport');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const download = require('./misc/download-file');

const csrfProtection = csrf({ cookie: true });

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

router.get('/download', async (req, res) => {
  //await download();
  res.end('Success');
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
router.get('/contacts/:username/edit', csrfProtection, controller.mustBeLoggedIn, controller.isVisitorOwner, controller.viewEditScreen);
router.post('/contacts/:username/edit', singleUpload, csrfProtection, controller.edit);

// ACCOUNT
router.get('/account/:username', controller.mustBeLoggedIn, controller.isVisitorOwner, controller.account);
router.post('/account/:username/delete', controller.account.delete);
router.get('/account/:username/change-password', controller.mustBeLoggedIn, controller.changePasswordPage);
router.post('/account/:username/change-password', controller.changePassword);

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

// LIKES
router.post('/likes', controller.likes);
router.post('/get-visited-profile-doc', controller.getProfile);

router.get('/contacts', controller.contacts);

// ERROR
router.get('/error', controller.error);

// NOT FOUND
router.get('*', controller.notFound);

// EXPORT CODE
module.exports = router;
