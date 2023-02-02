const sanitizeHTML = require('sanitize-html');
const User = require('../models/user');
const { environment, whichPage } = require('../misc/helpers');

module.exports = function (app) {
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

    // SET DOMAIN
    environment == 'development' ? (res.locals.domain = 'localhost:3000') : (res.locals.domain = 'gssgcontactbook.com');

    // GLOBALS FOR WHEN A USER IS LOGGED IN
    if (res.locals.user) {
      // for use in settings page
      res.locals.whichPage = whichPage(req.originalUrl, res.locals.user.username);
    }

    next();
  };
};
