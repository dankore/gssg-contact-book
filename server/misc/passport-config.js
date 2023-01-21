const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: `${process.env.GOOGLE_CALLABCK_URL}`,
    },
    function (accessToken, refreshToken, user, cb) {
      User.doesEmailExists(user._json.email)
        .then(userBool => {
          if (userBool) {
            // USER EXISTS. LOG IN
            // CLEAN UP
            user = {
              _id: userBool._id,
              google_id: userBool.google_id,
              email: user._json.email,
              firstName: user._json.given_name,
              lastName: user._json.family_name,
              username: user._json.email.split('@')[0],
              photo: userBool.photo,
              returningUser: true,
            };
            return cb(null, user);
          } else {
            // NEW USER. REGISTER
            // CLEAN UP
            user = {
              google_id: user._json.sub,
              firstName: user._json.given_name,
              lastName: user._json.family_name,
              username: user._json.email.split('@')[0],
              email: user._json.email,
              year: '2006?',
              photo: user._json.picture, // END
            };
            return cb(null, user);
          }
        })
        .catch(err => {
          console.log('Server 58: ' + err);
        });
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
