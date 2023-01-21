require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const sanitizeHTML = require('sanitize-html');
const bodyParser = require('body-parser');
const compression = require('compression');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const router = require('./router');
const User = require('./models/model');
const { commentsHelper, environment, whichPage } = require('./misc/helpers');
const app = express();

require('./misc/passport-config');

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

app.use(cookieParser());
app.use(sessionOptions);
app.use(passport.initialize({ session: true }));

app.set('views', 'view');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(flash());
app.use(compression());
app.use('/favicon.ico', express.static('public/favicon.ico'));
app.use(async (req, res, next) => {
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

app.use('/contacts/:username', async (req, res, next) => {
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

app.use('/', router);

app.use(function (err, req, res, next) {
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
module.exports = app;
