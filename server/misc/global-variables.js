// Move this block of code to a new file named global-variables.js
module.exports = function (app) {
  app.use(async (req, res, next) => {
    res.locals.filterUserHTML = content => {
      return sanitizeHTML(content, {
        allowedTags: ['p', 'br', 'ul', 'li', 'strong', 'i', 'em', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'code', 'blockquote'],
        allowedAttributes: {
          a: ['href', 'name', 'target'],
        },
        allowedSchemes: ['http', 'https', 'ftp', 'mailto'],
      });
    };
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    res.locals.path = req.originalUrl;
    res.locals.environment = environment;
    environment == 'development' ? (res.locals.images_folder = '/images-dev/') : (res.locals.images_folder = '/images/');
    environment == 'development' ? (res.locals.domain = 'localhost:3000') : (res.locals.domain = 'gssgcontactbook.com');
    if (req.session.user) {
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
};
