require('dotenv').config;
const express = require('express'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  flash = require('connect-flash'),
  server = express(),
  sanitizeHTML = require('sanitize-html'),
  bodyParser = require('body-parser'),
  router = require('./router'),
  compression = require('compression'),
  User = require('./models/model'),
  passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  cookieParser = require('cookie-parser'),
  { commentsHelper, environment, whichPage } = require('./misc/helpers');

// GOOGLE
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

// EXPRESS SESSIONS
let sessionOptions = session({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({ client: require('../db.js') }),
  resave: false,
  secure: true,
  httpOnly: true,
  domain: 'gssgcontactbook.com',
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true }, // COOKIES EXPIRE IN 14 DAYS
});

server.use(cookieParser());
server.use(sessionOptions);
server.use(passport.initialize({ session: true }));

server.set('views', 'view');
server.set('view engine', 'ejs');

server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static('public'));
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

server.use(flash());
server.use(compression());
server.use('/favicon.ico', express.static('public/favicon.ico'));
server.use(async (req, res, next) => {
  // MAKE MARKDOWN AVAILABLE GLOBALLY
  res.locals.filterUserHTML = content => {
    return sanitizeHTML(content, {
      allowedTags: ['p', 'br', 'ul', 'li', 'strong', 'i', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'code', 'blockquote'],
      allowedAttributes: {
        a: ['href', 'name', 'target'],
      },
      allowedSchemes: ['http', 'https', 'ftp', 'mailto'],
    });
  };
  // Make all available from all templates
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user;
  // IF PATH IS HOMEPAGE SHOW SCROLL-TO-TOP
  res.locals.path = req.originalUrl;
  res.locals.environment = environment;

  // set image folder
  environment == 'development' ? (res.locals.images_folder = '/images-dev/') : (res.locals.images_folder = '/images/');
  // set url
  environment == 'development' ? (res.locals.domain = 'localhost:3000') : (res.locals.domain = 'gssgcontactbook.com');
  // GLOBALS FOR WHEN A USER IS LOGGED IN
  if (req.session.user) {
    // for use in settings page
    res.locals.whichPage = whichPage(req.originalUrl, req.session.user.username);

    await User.findByUsername(req.session.user.username)
      .then(userDoc => {
        res.locals.profilesUserLiked = userDoc.likes_given_to;
        res.locals.emailForComment = userDoc.email;
        res.locals.photoUrlForComment = userDoc.photo;
        res.locals.username = userDoc.username;
      })
      .catch(err => {
        console.log('Server line 153 ' + err);
      });
  }
  next();
});

server.use('/contacts/:username', async (req, res, next) => {
  await User.findByUsername(req.params.username)
    .then(userDoc => {
      res.locals.namesOfLikesReceivedFrom = userDoc.likes_received_from;
      res.locals.commentsCount = commentsHelper(userDoc.comments);
    })
    .catch(err => {
      console.log('Server line 235 ' + err);
    });
  next();
});

server.use('/', router);

server.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  // handle CSRF token errors here
  res.status(403);
  res.send(`
    <p>Error: Bad CSRF token</p>
    <p>
      We are so sorry but we suspected this form submission has been tampered with.
    </p>
    <p>
      If you believe this should not happen please contact us at adamu.dankore@gmail.com.
    </p>
    <a style="color:green" href="/">Go to homepage</a>
  `);
});

// EXPORT CODE
module.exports = server;
