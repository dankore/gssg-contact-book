const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const cookieParser = require('cookie-parser');

// Move this block of code to a new file named session-config.js
const sessionOptions = session({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({ client: require('../../db.js') }),
  resave: false,
  secure: true,
  httpOnly: true,
  domain: 'gssgcontactbook.com',
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true }, // COOKIES EXPIRE IN 14 DAYS
});

module.exports = function (app) {
  app.use(cookieParser());
  app.use(sessionOptions);
  app.use(passport.initialize({ session: true }));
};
