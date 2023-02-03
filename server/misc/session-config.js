const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const cookieParser = require('cookie-parser');

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({ client: require('../../database/mongodb.js') }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true }, // COOKIES EXPIRE IN 14 DAYS
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  domain: process.env.NODE_ENV === 'production' ? 'gssgcontactbook.com' : undefined,
};

module.exports = function (app) {
  app.use(cookieParser());
  app.use(session(sessionOptions));
  app.use(passport.initialize({ session: true }));
};
