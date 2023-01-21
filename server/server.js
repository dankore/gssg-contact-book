require('dotenv').config();
const express = require('express');

const router = require('./router');
const User = require('./models/model');
const { commentsHelper, environment, whichPage } = require('./misc/helpers');
const server = express();


require('./misc/passport-config');
require('./misc/server-config');

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
