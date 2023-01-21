//user-data.js
const User = require('../models/user');
const { commentsHelper } = require('../misc/helpers');

module.exports = function (app) {
  return async (req, res, next) => {
    await User.findByUsername(req.params.username)
      .then(userDoc => {
        res.locals.namesOfLikesReceivedFrom = userDoc.likes_received_from;
        res.locals.commentsCount = commentsHelper(userDoc.comments);
      })
      .catch(err => {
        console.log('Server line 235 ' + err);
      });
    next();
  };
};
