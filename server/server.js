require('dotenv').config;
const express = require('express'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  flash = require('connect-flash'),
  server = express(),
  { marked } = require('marked'),
  sanitizeHTML = require('sanitize-html'),
  bodyParser = require('body-parser'),
  router = require('./router'),
  compression = require('compression'),
  User = require('./models/model'),
  passport = require('passport'),
  GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
  TwitterStrategy = require('passport-twitter').Strategy,
  cookieParser = require('cookie-parser');
// TWITTER
passport.use(
  new TwitterStrategy(
    {
      consumerKey: `${process.env.TWITTER_CONSUMER_KEY}`,
      consumerSecret: `${process.env.TWITTER_CONSUMER_SECRET}`,
      userProfileURL: 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
      callbackURL: `${process.env.TWITTER_CALLABCK_URL}`,
    },
    function (token, tokenSecret, user, cb) {
      User.doesEmailExists(user.emails[0].value)
        .then(userBool => {
          if (userBool) {
            // USER EXISTS. LOG IN
            // CLEAN UP
            user = {
              email: user.emails[0].value,
              returningUser: true,
            };
            return cb(null, user);
          } else {
            // NEW USER. REGISTER
            // CLEAN UP
            const displayNameArray = user.displayName.split(' ');
            user = {
              twitter_id: user.id,
              firstName: displayNameArray[0],
              lastName: displayNameArray[displayNameArray.length - 1],
              email: user.emails[0].value,
              photo: user.photos[0].value,
            };
            return cb(null, user);
          }
        })
        .catch(err => {
          console.log('Server 48: ' + err);
        });
    }
  )
);
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
          console.log('Server 29. New user: ' + userBool);
          if (userBool) {
            // USER EXISTS. LOG IN
            // CLEAN UP
            user = {
              email: user._json.email,
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
              email: user._json.email,
              year: '1988?',
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
  secret: 'Mental Model Programming',
  store: new MongoStore({ client: require('../db') }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 14, httpOnly: true }, // COOKIES EXPIRE IN 14 DAYS
});

server.use(cookieParser());
server.use(sessionOptions);
server.use(passport.initialize());
server.use(passport.session());
//PASSPORT ENDS

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
    return sanitizeHTML(marked.parse(content), {
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
  // GLOBALS FOR WHEN A USER IS LOGGED IN
  if (req.session.user) {
    await User.findByEmail(req.session.user.email)
      .then(userDoc => {
        res.locals.profilesUserLiked = userDoc.likes_given_to;
        res.locals.first_name_welcome = userDoc.firstName;
        res.locals.emailForComment = userDoc.email;
        res.locals.photoUrlForComment = userDoc.photo;
      })
      .catch(err => {
        console.log('Server line 153 ' + err);
      });
  }
  next();
});

// SEO
server.use('/profile/:email', async (req, res, next) => {
  await User.findByEmail(req.params.email)
    .then(userDoc => {
      userDoc.url = 'https://www.gssgcontactbook.com' + req.originalUrl;
      res.locals.namesOfLikesReceivedFrom = userDoc.likes_received_from;
      res.locals.seo = userDoc;
    })
    .catch(err => {
      console.log('Server line 235 ' + err);
    });
  next();
});
// SEO ENDS
server.use('/', router);

// EXPORT CODE
module.exports = server;
