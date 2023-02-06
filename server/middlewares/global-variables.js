const sanitizeHTML = require('sanitize-html');
const { environment, whichPage } = require('../misc/helpers');
const { TextAvatar } = require('../misc/textAvatar');

const globalVariables = app => async (req, res, next) => {
  // Define sanitization function globally
  res.locals.filterUserHTML = content => {
    return sanitizeHTML(content, {
      allowedTags: ['p', 'br', 'ul', 'li', 'strong', 'i', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'code', 'blockquote'],
      allowedAttributes: {
        a: ['href', 'name', 'target'],
      },
      allowedSchemes: ['http', 'https', 'ftp', 'mailto'],
    });
  };

  // Set variables globally
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  res.locals.user = req.session.user;
  res.locals.path = req.originalUrl;
  res.locals.environment = environment;
  res.locals.TextAvatar = TextAvatar;

  // Set domain based on environment
  res.locals.domain = environment === 'development' ? 'localhost:3000' : 'gssgcontactbook.com';

  // Set additional variables for logged in users
  if (res.locals.user) {
    res.locals.whichPage = whichPage(req.originalUrl, res.locals.user.username);
  }

  next();
};

module.exports = globalVariables;
