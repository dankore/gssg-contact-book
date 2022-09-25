const User = require('../models/model'),
  helpers = require('../misc/helpers'),
  ObjectId = require('mongodb').ObjectID;

exports.home = async (req, res) => {
  try {
    let contacts;
    contacts = await User.getRecentProfiles();

    res.render('homePage', { contacts });
  } catch (error) {
    req.flash('errors', error);
    req.session.save(() => res.redirect('/'));
  }
};

exports.about = (_, res) => res.render('about');

exports.contacts = async (req, res) => {
  try {
    let profiles;

    if (req.query.sort) {
      profiles = await User.sortProfiles(req.query.sort);
    } else if (req.query.q) {
      profiles = await User.search(req.query.q);
    } else {
      profiles = await User.allProfiles();
      // SORT BY TOTAL NUMBER OF COMMENTS AND LIKES
      profiles = helpers.sortProfiles(profiles);
    }
    res.render('contacts', {
      profiles: profiles,
    });
  } catch (error) {
    req.flash('errors', error);
    req.session.save(() => res.redirect('/contacts'));
  }
};

exports.registrationPage = async (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('registrationPage', {
      reqErrors: req.flash('reqError'),
      csrfToken: req.csrfToken(),
    });
  }
};

exports.registrationSubmission = async (req, res) => {
  let user = new User(req.body);

  user
    .register()
    .then(successMessage => {
      req.session.user = {
        username: user.data.username,
        email: user.data.email,
        firstName: user.data.firstName,
        lastName: user.data.lastName,
      };

      req.flash('success', successMessage);
      req.session.save(async function () {
        await res.redirect(`contacts/${req.session.user.username}/edit`);
      });
    })
    .catch(regErrors => {
      regErrors.forEach(function (error) {
        req.flash('reqError', error);
      });
      req.session.save(async function () {
        await res.redirect('/register');
      });
    });
};

exports.loginPage = (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('loginPage', { csrfToken: req.csrfToken() });
  }
};

exports.login = async (req, res) => {
  let user = new User(req.body);

  user
    .login()
    .then(userDoc => {
      req.session.user = {
        username: userDoc.username,
        email: userDoc.email,
        firstName: userDoc.firstName,
        lastName: userDoc.lastName,
      };

      req.session.save(() => {
        res.redirect('/');
      });
    })
    .catch(err => {
      req.flash('errors', err);
      req.session.save(() => {
        res.redirect('/login');
      });
    });
};

exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect('/');
  });
};

exports.getProfile = async (req, res) => {
  const contactUsername = helpers.getUsernameFromHeadersReferrer(req.headers.referer); // GET EMAIL FROM URL
  await User.findByUsername(contactUsername)
    .then(userDoc => {
      res.json(userDoc.likes_received_from);
    })
    .catch(() => {
      res.render('404');
    });
};

exports.ifUserExists = (req, res, next) => {
  User.findByUsername(req.params.username)
    .then(userDoc => {
      req.profileUser = userDoc;
      next();
    })
    .catch(() => {
      res.render('404');
    });
};

exports.mustBeLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash('errors', 'Must be login to perform that action.');
    req.session.save(_ => {
      res.redirect('/');
    });
  }
};

exports.isVisitorOwner = (req, res, next) => {
  const visitorIsOwner = User.isVisitorOwner(req.session.user.username, req.params.username);
  if (visitorIsOwner) {
    next();
  } else {
    req.flash('errors', 'You do not have permission to perform that action.');
    req.session.save(_ => res.redirect('/'));
  }
};

exports.profileScreen = (req, res) => {
  if (req.session.user) {
    // FILTER ONLY likes_received_from BELONGING TO THE SESSION USER
    const propExists = req.profileUser.likes_received_from ? req.profileUser.likes_received_from.filter(prop => prop.visitorEmail == req.session.user.username) : [];
    if (propExists.length > 0) {
      req.profileUser.color = propExists[0].color;
    }
    // FILTER ONLY likes_received_from BELONGING TO THE SESSION USER ENDS
    const visitorIsOwner = User.isVisitorOwner(req.session.user.username, req.profileUser.username);
    if (visitorIsOwner) {
      res.render('contactLoggedInUser', { profile: req.profileUser });
    } else {
      res.render('contactGuest', { profile: req.profileUser });
    }
  } else {
    res.render('contactGuest', { profile: req.profileUser });
  }
};

exports.viewEditScreen = async function (req, res) {
  let profile = await User.findByUsername(req.session.user.username);
  res.render('editProfilePage', { profile: profile, csrfToken: req.csrfToken() });
};

exports.edit = async (req, res) => {
  const userInfo = await User.findByUsername(req.session.user.username);
  const imageUrl = userInfo.photo;
  let profile;

  if (req.file) {
    profile = new User(req.body, req.file.location, req.session.user.username, req.params.username);
  } else {
    profile = new User(req.body, imageUrl, req.session.user.username, req.params.username);
  }

  profile
    .update()
    .then(async ({ status, userDoc }) => {
      if (status == 'success') {
        req.flash('success', 'Profile successfully updated.');
        req.session.user = {
          username: userDoc.username,
        };
        req.session.save(async _ => {
          await res.redirect(`/contacts/${userDoc.username}`);
        });

        // UPDATE USER COMMENTS INFO ACROSS ALL COMMENTS
        User.updateCommentFirtName(userDoc.email, userDoc.firstName);
        // UPDATE USER COMMENTS END
      } else {
        profile.errors.forEach(error => {
          req.flash('errors', error);
        });
        req.session.save(async _ => {
          await res.redirect(`/contacts/${userDoc.username}/edit`);
        });
      }
    })
    .catch(() => {
      req.flash('errors', 'You do not have permission to perform that action.');
      res.redirect('/');
    });
};

// NOT FOUND PAGE
exports.notFound = (req, res) => {
  res.status(404).render('404');
};

exports.account = (req, res) => {
  res.render('account');
};

exports.account.delete = (req, res) => {
  User.delete(req.params.username, req.session.user.username)
    .then(() => {
      req.flash('success', 'Account successfully deleted.');
      req.session.destroy(() => res.redirect('/'));
    })
    .catch(() => {
      req.flash('errors', 'You do not have permission to perform that action.');
      req.session.save(() => res.redirect('/'));
    });
};

exports.privacy = function (req, res) {
  res.render('privacy');
};

exports.changePasswordPage = function (req, res) {
  res.render('changePasswordPage');
};

exports.changePassword = function (req, res) {
  let user = new User(req.body, null, req.session.user.username, req.params.username);

  user
    .updatePassword()
    .then(successMessage => {
      req.flash('success', successMessage);
      req.session.save(() => res.redirect(`/account/${req.params.username}/change-password`));
    })
    .catch(errors => {
      errors.forEach(error => {
        req.flash('errors', error);
      });
      req.session.save(() => res.redirect(`/account/${req.params.username}/change-password`));
    });
};

exports.resetPasswordPage = (req, res) => {
  req.session.user ? res.redirect('/') : res.render('resetPasswordPage', { csrfToken: req.csrfToken() });
};

exports.resetPassword = (req, res) => {
  let user = new User(req.body);

  user
    .resetPassword(req.headers.host)
    .then(successMessage => {
      req.flash('success', successMessage);
      res.redirect('/reset-password');
    })
    .catch(errors => {
      errors.forEach(error => {
        req.flash('errors', error);
      });

      res.redirect('/reset-password');
    });
};

exports.resetPasswordTokenPage = (req, res) => {
  let user = User.resetTokenExpiryTest(req.params.token);

  user
    .then(() => {
      res.render('resetTokenPage', {
        token: req.params.token,
        csrfToken: req.csrfToken(),
      });
    })
    .catch(error => {
      req.flash('errors', error);
      res.redirect('/reset-password');
    });
};

exports.resetPasswordToken = (req, res) => {
  let user = new User(req.body);

  user
    .resetToken(req.params.token)
    .then(message => {
      req.flash('success', message);
      res.redirect('/');
    })
    .catch(error => {
      req.flash('errors', error);
      res.redirect(`/reset-password/${req.params.token}`);
    });
};
// AXIOS
exports.doesEmailExists = async (req, res) => {
  let emailBool = await User.doesEmailExists(req.body.email);
  res.json(emailBool);
};

// GOOGLE LOGIN
exports.googleLogin = async (req, res) => {
  try {
    req.session.user = {
      email: req.user.email,
      username: req.user.username,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
    };

    if (req.user.returningUser) {
      req.session.save(async _ => await res.redirect('/'));
    } else {
      const successMessage = await User.addSocialUser(req.user);
      req.flash('success', successMessage);
      req.session.save(async _ => await res.redirect(`contacts/${req.user.username}/edit`));
    }
  } catch (error) {
    req.flash('errors', error);
    req.session.save(async _ => await res.redirect('/register'));
  }
};

// COMMENTS
exports.addComment = async (req, res) => {
  const contactUsername = helpers.getUsernameFromHeadersReferrer(req.headers.referer); // GET EMAIL FROM URL

  const userDoc = await User.findByUsername(req.session.user.username);

  const commentDate = helpers.getMonthDayYear() + ', ' + helpers.getHMS();
  // GET RID OF BOGUS AND SANITIZE DATA
  const data = {
    commentId: new ObjectId(),
    comment: req.body.comment,
    visitorEmail: req.body.visitorEmail,
    visitorUsername: userDoc.username,
    visitorFirstName: userDoc.firstName,
    profileEmail: req.body.contactEmail,
    photo: userDoc.photo,
    commentDate: commentDate,
  };

  User.saveComment(data)
    .then(response => {
      res.json(response);
    })
    .catch(errorMessage => {
      req.flash('errors', errorMessage);
      req.session.save(async _ => {
        await res.redirect(`contacts/${contactUsername}`);
      });
    });
};

// UPDATE A COMMENT
exports.editComment = (req, res) => {
  const profileUsername = helpers.getUsernameFromHeadersReferrer(req.headers.referer); // GET EMAIL FROM URL
  // GET RID OF BOGUS AND SANITIZE DATA
  const data = {
    commentId: req.body.commentId,
    comment: req.body.comment,
    profileEmail: req.body.contactEmail,
    profileUsername,
  };

  User.updateComment(data)
    .then(response => {
      res.json(response);
    })
    .catch(errorMessage => {
      req.flash('errors', errorMessage);
      req.session.save(async _ => {
        await res.redirect(`contacts/${profileUsername}`);
      });
    });
};

// DELETE A COMMENT
exports.deleteComment = (req, res) => {
  User.deleteComment(req.body.commentId, req.body.contactEmail)
    .then(successMessage => {
      res.json(successMessage);
    })
    .catch(errorMessage => {
      res.json(errorMessage);
    });
};

// LIKES
exports.likes = async (req, res) => {
  // TODO: ADD _ID TO EACH LIKE
  const data = {
    like: req.body.like,
    color: req.body.color,
    visitorEmail: req.body.visitorEmail,
    visitorName: req.body.visitorName,
    profileEmail: req.body.contactEmail,
    contactUsername: helpers.getUsernameFromHeadersReferrer(req.headers.referer), // GET EMAIL FROM URL,
  };

  User.storeLikes(data)
    .then(response => {
      res.json(response);
    })
    .catch(errorMessage => {
      res.json(errorMessage);
    });
};
