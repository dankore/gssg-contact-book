const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const sanitizeHTML = require('sanitize-html');
const bodyParser = require('body-parser');
const compression = require('compression');
const passport = require('passport');
const cookieParser = require('cookie-parser');

const server = express();

// EXPRESS SESSIONS
let sessionOptions = session({
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({ client: require('../../db.js') }),
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
