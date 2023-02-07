const { metatags } = require('../misc/metatags');
const { transformImage } = require('../misc/file-upload-cloudinary');
const User = require('../models/user');
const helpers = require('../misc/helpers');
const ObjectId = require('mongodb').ObjectId;
const { SitemapStream, streamToPromise } = require('sitemap');
const { createGzip } = require('zlib');
const { working_url } = require('../misc/helpers');
const APIError = require('../misc/api-error');

exports.home = async (req, res) => {
  try {
    const contacts = await User.getRecentProfiles();

    res.render('homePage', { contacts, metatags: metatags({ page: '/' }) });
  } catch (error) {
    return res.render('error', { errorMsg: error.message, status: 404, metatags: metatags({ page: 'generic', data: { page_name: 'Error' } }) });
  }
};

exports.about = async (req, res) => {
  try {
    const count = await User.contactsCount();
    res.render('about', { count, metatags: metatags({ page: 'about' }) });
  } catch (error) {
    return res.render('error', { errorMsg: error.message, status: 404, metatags: metatags({ page: 'generic', data: { page_name: 'Error' } }) });
  }
};

exports.contacts = async (req, res) => {
  try {
    const { q, sort } = req.query;
    let profiles;

    if (q || sort) {
      profiles = await User.search(q, sort);
    } else {
      profiles = await User.allProfiles();
      profiles = helpers.sortProfiles(profiles);
    }

    res.render('contacts', {
      profiles,
      metatags: metatags({ page: 'contacts' }),
    });
  } catch (error) {
    req.flash('errors', error.message);
    res.redirect('/contacts');
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
  try {
    const user = new User(req.body);

    if (user.errors.length > 0) {
      req.flash('reqError', user.errors);
      res.redirect('/register');
      return;
    }

    const userDoc = await user.register();

    req.session.user = {
      _id: userDoc._id,
      ...(userDoc.google_id && { google_id: userDoc.google_id }),
      username: user.data.username,
      email: user.data.email,
      firstName: user.data.firstName,
      lastName: user.data.lastName,
      photo: userDoc.photo,
    };

    req.flash('success', 'Success, Up GSS Gwarinpa! Add your nickname, birthday, and more below.');
    res.redirect(`/settings/${req.session.user.username}/edit-profile`);
  } catch (error) {
    req.flash('reqError', error);
    res.redirect('/register');
  }
};

exports.loginPage = (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('loginPage', { csrfToken: req.csrfToken(), metatags: metatags({ page: 'login' }) });
};

exports.login = async (req, res) => {
  try {
    const user = new User(req.body);
    const userDoc = await user.login();

    req.session.user = {
      _id: userDoc._id,
      ...(userDoc.google_id && { google_id: userDoc.google_id }),
      username: userDoc.username,
      email: userDoc.email,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      photo: userDoc.photo,
    };

    res.redirect('/');
  } catch (error) {
    req.flash('errors', error.message);
    res.redirect('/login');
  }
};

exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect('/');
  });
};

exports.ifUserExists = async (req, res, next) => {
  try {
    const user = await User.findByUsername(req.params.username);

    if (!user) {
      return res.render('error', { errorMsg: 'User not found', status: 404, metatags: metatags({ page: 'generic', data: { page_name: 'Error' } }) });
    }

    req.profileUser = user;
    next();
  } catch (error) {
    return res.render('error', { errorMsg: 'An error occurred while retrieving this profile', status: 500, metatags: metatags({ page: 'generic', data: { page_name: 'Error' } }) });
  }
};

exports.mustBeLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.render('error', { errorMsg: 'You must be logged in to perform that action.', status: 401, metatags: metatags({ page: 'generic', data: { page_name: 'Error' } }) });
  }

  next();
};

exports.isVisitorOwner = (req, res, next) => {
  const visitorIsOwner = User.isVisitorOwner(req.session.user.username, req.params.username);
  if (!visitorIsOwner) {
    return res.render('error', { errorMsg: 'You do not have permission to perform that action.', status: 403, metatags: metatags({ page: 'generic', data: { page_name: 'Error' } }) });
  }

  next();
};

exports.profileScreen = (req, res) => {
  try {
    const { profileUser } = req;

    const data = {
      profile: {
        ...profileUser,
        commentsCount: helpers.commentsHelper(profileUser.comments),
      },
      metatags: metatags({ page: 'contact', data: profileUser }),
    };

    res.render('contact', data);
  } catch (error) {
    // log the error
    console.error(error);
    // send a 500 error response to the client
    res.status(500).send('An error occurred while rendering the profile screen');
  }
};

exports.edit = async (req, res) => {
  try {
    const profile = new User(req.body, req.session.user.username, req.params.username);
    const { status, userDoc } = await profile.update();

    if (status === 'success') {
      req.flash('success', 'Profile successfully updated.');
      req.session.user = { ...req.session.user, ...userDoc };
      await req.session.save(() => res.redirect(`/contacts/${userDoc.username}`));

      User.updateCommentFirtName(userDoc.email, userDoc.firstName);
    } else {
      profile.errors.forEach(error => req.flash('errors', error.message));
      await req.session.save(() => res.redirect(`/settings/${req.session.user.username}/edit-profile`));
    }
  } catch (err) {
    return res.render('error', { errorMsg: 'You do not have permission to perform that action.', status: 403, metatags: metatags({ page: 'generic', data: { page_name: 'Error' } }) });
  }
};

exports.notFound = (req, res) => res.status(404).render('404', { metatags: metatags({ page: 'generic', data: { page_name: '404' } }) });

exports.settingsPage = (req, res) => res.status(404).render('settings', { metatags: metatags({ page: 'generic', data: { page_name: 'Settings', path: `settings/${req.session.user.username}` } }) });

exports.editProfile = async (req, res) => {
  try {
    const profile = await User.findByUsername(req.session.user.username);
    res.render('settings/edit-profile', { profile, csrfToken: req.csrfToken(), metatags: metatags({ page: 'generic', data: { page_name: 'Edit Profile', path: `settings/${req.session.user.username}/edit-profile` } }) });
  } catch (error) {
    req.flash('errors', error.message);
    res.redirect(`/settings/${req.session.user.username}/change-profile-photo`);
  }
};

exports.changeProfilePhotoPage = async (req, res) => {
  try {
    const profile = await User.findByUsername(req.session.user.username);
    res.render('settings/change-profile-photo', { profile, csrfToken: req.csrfToken(), metatags: metatags({ page: 'generic', data: { page_name: 'Change Profile Photo', path: `settings/${req.session.user.username}/change-profile-photo` } }) });
  } catch (error) {
    req.flash('errors', error.message);
    res.redirect(`/settings/${req.session.user.username}/change-profile-photo`);
  }
};

exports.changeProfilePhoto = async (req, res) => {
  try {
    const imageUrl = await transformImage(req.file.path, req.session.user._id);
    await User.storeImage(imageUrl, req.session.user.username);

    // update all comments by user
    await User.updateCommentPhoto(req.session.user.email, imageUrl);

    // update session user object with the new photo
    req.session.user.photo = imageUrl;

    req.session.save(() => res.redirect(`/contacts/${req.session.user.username}`));
  } catch (error) {
    req.flash('errors', error.message);
    req.session.save(() => res.redirect(`/settings/${req.session.user.username}/change-profile-photo`));
  }
};

exports.deleteAccountPage = async (req, res) => {
  try {
    res.render('settings/delete-account', {
      csrfToken: req.csrfToken(),
      metatags: metatags({
        page: 'generic',
        data: {
          page_name: 'Delete Account',
          path: `settings/${req.session.user.username}/delete-account`,
        },
      }),
    });
  } catch (error) {
    return res.render('error', { errorMsg: 'An unexpected error occurred, please try again later.', status: 500, metatags: metatags({ page: 'generic', data: { page_name: 'Error' } }) });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    await User.delete(req.params.username, req.session.user.username);

    req.flash('success', 'Account successfully deleted.');
    req.session.destroy(() => res.redirect('/'));
  } catch (error) {
    return res.render('error', { errorMsg: 'You do not have permission to perform that action.', status: 403, metatags: metatags({ page: 'generic', data: { page_name: 'Error' } }) });
  }
};

exports.privacy = (req, res) => {
  res.render('privacy', {
    metatags: metatags({ page: 'privacy' }),
  });
};

exports.changePasswordPage = (req, res) => {
  res.render('settings/change-password', {
    username: req.session.user.username,
    csrfToken: req.csrfToken(),
    metatags: metatags({
      page: 'generic',
      data: {
        page_name: 'Change Your Password',
      },
    }),
  });
};

exports.changePassword = async function (req, res) {
  try {
    let user = new User(req.body, req.session.user.username, req.params.username);
    const successMessage = await user.updatePassword();
    req.flash('success', successMessage);
    await req.session.save(() => res.redirect(`/settings/${req.params.username}/change-password`));
  } catch (errors) {
    errors.forEach(error => {
      req.flash('errors', error.message);
    });
    await req.session.save(() => res.redirect(`/settings/${req.params.username}/change-password`));
  }
};

exports.resetPasswordPage = (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  } else {
    return res.render('resetPasswordPage', {
      csrfToken: req.csrfToken(),
      metatags: metatags({ page: 'generic', data: { page_name: 'Reset Your Password', path: 'reset-password' } }),
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = new User(req.body);
    const successMessage = await user.resetPassword(req.headers.host);
    req.flash('success', successMessage);
    res.redirect('/reset-password');
  } catch (errors) {
    errors.forEach(error => {
      req.flash('errors', error.message);
    });
    res.redirect('/reset-password');
  }
};

exports.resetPasswordTokenPage = async (req, res) => {
  try {
    await User.resetTokenExpiryTest(req.params.token);
    res.render('resetTokenPage', {
      token: req.params.token,
      csrfToken: req.csrfToken(),
      metatags: metatags({
        page: 'generic',
        data: {
          page_name: 'Change Your Password',
          path: `reset-password/${req.params.token}`,
        },
      }),
    });
  } catch (error) {
    req.flash('errors', error.message);
    res.redirect('/reset-password');
  }
};

exports.resetPasswordToken = async (req, res) => {
  try {
    let user = new User(req.body);
    let message = await user.resetToken(req.params.token);
    req.flash('success', message);
    res.redirect('/login');
  } catch (error) {
    req.flash('errors', error.message);
    res.redirect(`/reset-password/${req.params.token}`);
  }
};

exports.doesEmailExist = async (req, res) => {
  try {
    const emailExists = await User.doesEmailExist(req.body.email);
    res.json(emailExists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// GOOGLE LOGIN
exports.googleLogin = async (req, res) => {
  try {
    req.session.user = {
      email: req.user.email,
      username: req.user.username,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      photo: req.user.photo,
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
      req.session.save(async _ => await res.redirect(`/settings/${req.user.username}/edit-profile`));
    }
  } catch (error) {
    req.flash('errors', error.message);
    req.session.save(async _ => await res.redirect('/register'));
  }
};

exports.addComment = async (req, res) => {
  try {
    const userDoc = await User.findByUsername(req.session.user.username);
    const commentDate = helpers.getMonthDayYear() + ', ' + helpers.getHMS();

    // SANITIZE AND ADD ONLY NECESSARY DATA
    const data = {
      userId: req.session.user._id,
      commentId: new ObjectId(),
      comment: req.body.comment.trim(),
      visitorEmail: req.body.visitorEmail.trim(),
      visitorUsername: userDoc.username,
      visitorFirstName: userDoc.firstName,
      profileEmail: req.body.contactEmail.trim(),
      photo: userDoc.photo,
      commentDate,
    };

    // CONDITIONALLY ADD GOOGLE_ID AND GOOGLE_PHOTO
    if (userDoc.google_id) {
      data.google_id = userDoc.google_id;
      data.google_photo = userDoc.photo;
    }

    const response = await User.saveComment(data);
    res.json(response);
  } catch (error) {
    if (!(error instanceof APIError)) {
      error = new APIError(error.message, 500);
    }

    console.error(error);
    res.status(error.status).json({
      error: {
        message: error.message,
      },
    });
  }
};

// UPDATE A COMMENT
exports.editComment = async (req, res) => {
  try {
    const profileUsername = helpers.getUsernameFromHeadersReferrer(req.headers.referer);
    const data = {
      commentId: req.body.commentId,
      comment: req.body.comment.trim(),
      profileEmail: req.body.profileEmail.trim(),
      profileUsername,
    };

    console.log(data);

    const response = await User.updateComment(data);
    res.json(response);
  } catch (error) {
    if (!(error instanceof APIError)) {
      error = new APIError(error, 500);
    }

    res.status(error.status).json({
      error: {
        message: error.message,
      },
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const successMessage = await User.deleteComment(req.body.commentId, req.body.profileEmail.trim());
    res.json(successMessage);
  } catch (error) {
    if (!(error instanceof APIError)) {
      error = new APIError(error, 500);
    }

    res.status(error.status).json({
      error: {
        message: error.message,
      },
    });
  }
};

exports.error = (req, res) => res.render('error', { metatags: metatags({ page: 'generic', data: { page_name: 'error' } }) });

let sitemap;

exports.sitemap = (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');

  // if we have a cached entry send it
  if (sitemap) {
    res.send(sitemap);
    return;
  }

  try {
    const smStream = new SitemapStream({ hostname: working_url });
    const pipeline = smStream.pipe(createGzip());
    helpers.sitemapUrls.forEach(url => {
      smStream.write({ url });
    });

    // cache the response
    streamToPromise(pipeline).then(sm => (sitemap = sm));
    // make sure to attach a write stream such as streamToPromise before ending
    smStream.end();
    // stream write the response
    pipeline.pipe(res).on('error', e => {
      throw e;
    });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};
