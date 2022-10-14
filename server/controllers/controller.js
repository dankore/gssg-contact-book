const { metatags } = require('../misc/metatags');

const User = require('../models/model'),
  helpers = require('../misc/helpers'),
  ObjectId = require('mongodb').ObjectID;

exports.home = async (req, res) => {
  try {
    const contacts = await User.getRecentProfiles();

    res.render('homePage', { contacts, metatags: metatags({ page: '/' }) });
  } catch (error) {
    req.flash('errors', error.message);
    req.session.save(() => res.redirect('/error'));
  }
};

exports.about = async (req, res) => {
  try {
    const count = await User.contactsCount();
    res.render('about', { count, metatags: metatags({ page: 'about' }) });
  } catch (error) {
    req.flash('errors', error.message);
    req.session.save(() => res.redirect('/error'));
  }
};

exports.error = (req, res) => res.render('error', { metatags: metatags({ page: 'generic', data: { page_name: 'error' } }) });

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
      profiles,
      metatags: metatags({ page: 'contacts' }),
    });
  } catch (error) {
    req.flash('errors', error.message);
    req.session.save(() => res.redirect('/contacts'));
  }
};

exports.registrationPage = async (req, res) => {
  if (req.session.user) return res.redirect('/');

  res.render('registrationPage', {
    reqErrors: req.flash('reqError'),
    csrfToken: req.csrfToken(),
    metatags: metatags({ page: 'register' }),
  });
};

exports.registrationSubmission = async (req, res) => {
  let user = new User(req.body);

  user
    .register()
    .then(userDoc => {
      req.session.user = {
        _id: userDoc._id,
        ...(userDoc.google_id && { google_id: userDoc.google_id }),
        username: user.data.username,
        email: user.data.email,
        firstName: user.data.firstName,
        lastName: user.data.lastName,
      };

      req.flash('success', 'Success, Up GSS Gwarinpa! Add your photo, nickname, birthday, and more below.');
      req.session.save(async () => await res.redirect(`/contacts/${req.session.user.username}/edit`));
    })
    .catch(regErrors => {
      regErrors.forEach(error => req.flash('reqError', error));
      req.session.save(async () => await res.redirect('/register'));
    });
};

exports.loginPage = (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('loginPage', { csrfToken: req.csrfToken(), metatags: metatags({ page: 'login' }) });
};

exports.login = async (req, res) => {
  let user = new User(req.body);

  user
    .login()
    .then(userDoc => {
      req.session.user = {
        _id: userDoc._id,
        ...(userDoc.google_id && { google_id: userDoc.google_id }),
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
      res.redirect('/error');
    });
  }
};

exports.isVisitorOwner = (req, res, next) => {
  const visitorIsOwner = User.isVisitorOwner(req.session.user.username, req.params.username);
  if (visitorIsOwner) {
    next();
  } else {
    req.flash('errors', 'You do not have permission to perform that action.');
    req.session.save(_ => res.redirect('/error'));
  }
};

exports.profileScreen = (req, res) => res.render('contact', { profile: req.profileUser, metatags: metatags({ page: 'contact', data: req.profileUser }) });

// rm
exports.viewEditScreen = async function (req, res) {
  let profile = await User.findByUsername(req.session.user.username);
  res.render('editProfilePage', { profile: profile, csrfToken: req.csrfToken() });
};

exports.edit = async (req, res) => {
  const profile = new User(req.body, req.session.user.username, req.params.username);

  profile
    .update()
    .then(async ({ status, userDoc }) => {
      if (status == 'success') {
        req.flash('success', 'Profile successfully updated.');

        // save these values just in case if they have been changed
        req.session.user.username = userDoc.username;
        req.session.user.email = userDoc.email;

        req.session.save(async _ => await res.redirect(`/contacts/${req.session.user.username}`));

        // UPDATE USER COMMENTS INFO ACROSS ALL COMMENTS
        User.updateCommentFirtName(userDoc.email, userDoc.firstName);
        // UPDATE USER COMMENTS END
      } else {
        profile.errors.forEach(error => {
          req.flash('errors', error.message);
        });
        console.log(profile.errors);
        req.session.save(async _ => {
          await res.redirect(`/settings/${req.session.user.username}/edit`);
        });
      }
    })
    .catch(() => {
      req.flash('errors', 'You do not have permission to perform that action.');
      res.redirect('/error');
    });
};

exports.notFound = (req, res) => res.status(404).render('404', { metatags: metatags({ page: 'generic', data: { page_name: '404' } }) });

exports.editProfile = async (req, res) => {
  const profile = await User.findByUsername(req.session.user.username);
  res.render('settings/edit-profile', { profile, csrfToken: req.csrfToken(), metatags: metatags({ page: 'generic', data: { page_name: 'Edit Profile', path: `settings/${req.session.user.username}/edit-profile` } }) });
};

exports.changeProfilePhoto = async (req, res) => {
  const profile = await User.findByUsername(req.session.user.username);
  res.render('settings/change-profile-photo', { profile, csrfToken: req.csrfToken(), metatags: metatags({ page: 'generic', data: { page_name: 'Change Profile Photo', path: `settings/${req.session.user.username}/change-profile-photo` } }) });
};

exports.deleteAccount = (req, res) => {
  User.delete(req.params.username, req.session.user.username)
    .then(() => {
      req.flash('success', 'Account successfully deleted.');
      req.session.destroy(() => res.redirect('/'));
    })
    .catch(() => {
      req.flash('errors', 'You do not have permission to perform that action.');
      req.session.save(() => res.redirect('/error'));
    });
};

exports.privacy = (req, res) => res.render('privacy', { metatags: metatags({ page: 'privacy' }) });

exports.changePasswordPage = (req, res) => res.render('settings/change-password', { username: req.session.user.username, csrfToken: req.csrfToken(), metatags: metatags({ page: 'generic', data: { page_name: 'Change Your Password' } }) });

exports.changePassword = function (req, res) {
  let user = new User(req.body, req.session.user.username, req.params.username);

  user
    .updatePassword()
    .then(successMessage => {
      req.flash('success', successMessage);
      req.session.save(() => res.redirect(`/settings/${req.params.username}/change-password`));
    })
    .catch(errors => {
      errors.forEach(error => {
        req.flash('errors', error.message);
      });
      req.session.save(() => res.redirect(`/settings/${req.params.username}/change-password`));
    });
};

exports.resetPasswordPage = (req, res) => {
  req.session.user ? res.redirect('/') : res.render('resetPasswordPage', { csrfToken: req.csrfToken(), metatags: metatags({ page: 'generic', data: { page_name: 'Reset Your Password', path: 'reset-password' } }) });
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
        req.flash('errors', error.message);
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
        metatags: metatags({ page: 'generic', data: { page_name: 'Change Your Password', path: `reset-password/${req.params.token}` } }),
      });
    })
    .catch(error => {
      req.flash('errors', error.message);
      res.redirect('/reset-password');
    });
};

exports.resetPasswordToken = (req, res) => {
  let user = new User(req.body);

  user
    .resetToken(req.params.token)
    .then(message => {
      req.flash('success', message);
      res.redirect('/login');
    })
    .catch(error => {
      req.flash('errors', error.message);
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
      req.session.user._id = req.user._id;
      req.session.user.google_id = req.user.google._id;
      req.session.save(async _ => await res.redirect('/'));
    } else {
      const userDoc = await User.addSocialUser(req.user);
      req.session.user._id = userDoc._id;
      req.session.user.google_id = userDoc.google_id;
      req.flash('success', "Success, Up GSS Gwarinpa! Click 'Edit Profile' to add your nickname, birthday, and more.");
      req.session.save(async _ => await res.redirect(`/contacts/${req.user.username}/edit`));
    }
  } catch (error) {
    req.flash('errors', error.message);
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
    userId: req.session.user._id,
    ...(userDoc.google_id && { google_id: userDoc.google_id, google_photo: userDoc.photo }),
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
    .catch(error => {
      res.json(error.message);
    });
};

// UPDATE A COMMENT
exports.editComment = (req, res) => {
  const profileUsername = helpers.getUsernameFromHeadersReferrer(req.headers.referer); // GET EMAIL FROM URL
  // GET RID OF BOGUS AND SANITIZE DATA
  const data = {
    commentId: req.body.commentId,
    comment: req.body.comment,
    profileEmail: req.body.profileEmail,
    profileUsername,
  };

  User.updateComment(data)
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      res.json(error.message);
    });
};

// DELETE A COMMENT
exports.deleteComment = (req, res) => {
  User.deleteComment(req.body.commentId, req.body.profileEmail)
    .then(successMessage => {
      res.json(successMessage);
    })
    .catch(error => {
      res.json(error.message);
    });
};
