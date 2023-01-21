const sanitizeHTML = require('sanitize-html');
const User = require('../models/model');
const { environment, whichPage } = require('../misc/helpers');

module.exports = function(app) {
  return async (req, res, next) => {
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
          res.locals.photoUrlForComment = userDoc.username;
        })
        .catch(err => {
          console.log('Server line 153 ' + err);
        });
    }
    next();
  };
}
