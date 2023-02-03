const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

const googleStrategy = new GoogleStrategy(
  {
    clientID: `${process.env.GOOGLE_CLIENT_ID}`,
    clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
    callbackURL: `${process.env.GOOGLE_CALLABCK_URL}`,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const userExists = await User.findByEmail(profile._json.email);
      let user;

      if (userExists) {
        // User exists, log in
        user = {
          _id: userExists._id,
          google_id: userExists.google_id,
          email: userExists.email,
          firstName: userExists.firstName,
          lastName: userExists.lastName,
          username: userExists.username,
          photo: userExists.photo,
          returningUser: true,
        };
      } else {
        // New user, register
        user = {
          google_id: profile._json.sub,
          firstName: profile._json.given_name,
          lastName: profile._json.family_name,
          username: profile._json.email.split('@')[0],
          email: profile._json.email,
          year: '2006?',
          photo: profile._json.picture,
        };
      }
      return done(null, user);
    } catch (err) {
      console.error(err);
      return done(err);
    }
  }
);

passport.use(googleStrategy);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});
