const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const { DB_CONNECTION_STRING } = require('./helpers');

const sessionOptions = {
  secret: process.env.SESSION_SECRET,
  store: MongoStore.create({ mongoUrl: DB_CONNECTION_STRING }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 14, secure: process.env.NODE_ENV === 'production' }, // COOKIES EXPIRE IN 14 DAYS
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  domain: process.env.NODE_ENV === 'production' ? 'www.gssgcontactbook.com' : undefined,
};

module.exports = function (app) {
  app.use(cookieParser());
  app.use(session(sessionOptions));
  app.use(passport.initialize({ session: true }));
};
