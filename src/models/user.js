const usersCollection = require('../../database/mongodb.js').db().collection('users'),
  validator = require('validator'),
  bcrypt = require('bcryptjs'),
  crypto = require('crypto'),
  Email = require('../misc/emailNotifications.js'),
  helpers = require('../misc/helpers.js'),
  ObjectId = require('mongodb').ObjectId,
  sanitizeHtml = require('sanitize-html'),
  _ = require('lodash');

let User = class user {
  constructor(data, sessionUsername, requestedUsername) {
    this.errors = [];

    if (Object.keys(data).length === 0 && data.constructor === Object) {
      this.errors.push('Error: Empty data object passed.');
    }

    this.data = data;
    this.sessionUsername = sessionUsername;
    this.requestedUsername = requestedUsername;
  }
};

// CLASS ENDS
User.prototype.validateEmail = async function () {
  try {
    if (!validator.isEmail(this.data.email)) {
      this.errors.push('Email is not valid. Please enter a valid email.');
    } else {
      const emailExist = await usersCollection.findOne({
        email: sanitizeHtml(this.data.email),
      });
      if (emailExist) {
        this.errors.push('That email is already taken.');
      }
    }
  } catch (error) {
    this.errors.push(error.message);
  }
};

User.prototype.validateUsername = function () {
  return new Promise(async (resolve, reject) => {
    if (this.data.username.length == '') {
      this.errors.push('Username cannot be empty.');
    }
    if (this.data.username.length > 30) {
      this.errors.push('Username cannot exceed 30 characters.');
    }
    if (this.data.username.length != '' && !helpers.isAlphaNumericDashHyphenPeriod(this.data.username)) {
      this.errors.push('Username can only contain letters, dashes, undercores, periods, and numbers.');
    }

    // if username is valid, check to see if it is taken
    let usernameExists = await usersCollection.findOne({
      username: sanitizeHtml(this.data.username),
    });

    if (usernameExists) {
      this.errors.push('That username is already taken.');
    }
    resolve();
  });
};

User.prototype.validatePassword = function () {
  // check for empty box
  if (this.data.password.length == '') {
    this.errors.push('Password is required.');
  }
  //check for length
  if (!validator.isLength(this.data.password, { min: 6, max: 50 })) {
    this.errors.push('Password should be at least 6 characters.');
  }
};

User.prototype.editValidation = function () {
  // check for non-allowed inputs
  // IF NOT EMPTY
  if (('' + this.data.phone).length != '') {
    if (!validator.isMobilePhone(this.data.phone)) {
      this.errors.push('Phone number must be valid.');
    }
  }
  if (!validator.isLength(this.data.nickname, { min: 0, max: 50 })) {
    this.errors.push('Nickname must be less than 50 characters.');
  }
  if (!validator.isLength(this.data.residence, { min: 0, max: 50 })) {
    this.errors.push('Place of residence must be less than 50 characters.');
  }
  if (!validator.isLength(this.data.occupation, { min: 0, max: 50 })) {
    this.errors.push('Occupation must be less than 50 characters.');
  }
  // IF NOT EMPTY
  if (this.data.class != '') {
    if (!validator.isAlphanumeric(this.data.class.trim())) {
      this.errors.push('Class can only contain letters and numbers. No spaces as well.');
    }
    if (!validator.isLength(this.data.class, { min: 0, max: 20 })) {
      this.errors.push('Class must be less than 20 characters.');
    }
  }
  if (this.data.link_social_type_1 != '') {
    if (!validator.isURL(this.data.link_social_type_1)) {
      this.errors.push('Social media link #1 must be a valid web address.');
    }
  }
  if (this.data.social_type_1 == '' && this.data.link_social_type_1 != '') {
    this.errors.push('Social Media Type #1 cannot be blank if Link to Social Media Type #1 has a value.');
  }
  if (this.data.social_type_1 != '' && this.data.link_social_type_1 == '') {
    this.errors.push('Link to Social Media Type #1 cannot be blank if Social Media Type #1 has a value.');
  }
  if (this.data.month == '' && this.data.day != '') {
    this.errors.push('Month of Birth cannot be blank if Day of Birth has a value.');
  }
  if (this.data.link_social_type_2 != '') {
    if (!validator.isURL(this.data.link_social_type_2)) {
      this.errors.push('Social media link #2 must be a valid web address.');
    }
  }
  if (this.data.social_type_2 == '' && this.data.link_social_type_2 != '') {
    this.errors.push('Social Media Type #2 cannot be blank if Link to Social Media Type #2 has a value.');
  }
  if (this.data.social_type_2 != '' && this.data.link_social_type_2 == '') {
    this.errors.push('Link to Social Media Type #2 cannot be blank if Social Media Type #2 has a value.');
  }
  if (this.data.teacher != '') {
    if (typeof this.data.teacher != 'string') {
      this.errors.push('Name of favorite teacher can only be letters.');
    }
    if (!validator.isLength(this.data.teacher, { min: 0, max: 50 })) {
      this.errors.push('Name of favorite teacher must be less than 50 characters.');
    }
  }
  if (this.data.day != '') {
    if (!validator.isNumeric(this.data.day)) {
      this.errors.push('Day of Birth can only be numbers.');
    }
  }
  // END
};

User.prototype.login = async function () {
  try {
    this.cleanUp();
    if (!this.data.email) {
      throw new Error('Please provide an email address.');
    }
    if (!this.data.email && !this.data.password) {
      throw new Error('Please provide an email address and a password.');
    }

    let attemptedUser;

    if (validator.isEmail(this.data.email)) {
      attemptedUser = await usersCollection.findOne({ email: sanitizeHtml(this.data.email) });
    } else {
      throw new Error('Invalid email address');
    }

    if (!attemptedUser) {
      throw new Error("That email has not been registered. Click 'Add Your Contact' above to register.");
    }

    if (!attemptedUser.password) {
      throw new Error('Please enter a password.');
    }

    if (!bcrypt.compareSync(this.data.password, attemptedUser.password)) {
      throw new Error('Invalid password!');
    }

    new Email().whoLoggedIn(attemptedUser.firstName);
    return attemptedUser;
  } catch (error) {
    throw new Error(error.message || 'Please try again later.');
  }
};

User.prototype.validateSomeUserRegistrationInputs = function () {
  // check for empty boxes
  if (!this.data.username) {
    this.errors.push('Username cannot be empty.');
  }
  if (!this.data.firstName) {
    this.errors.push('First name cannot be empty.');
  }
  if (!this.data.lastName) {
    this.errors.push('Last name cannot be empty.');
  }

  if (!this.data.year) {
    this.errors.push('Year of graduation is required.');
  }
  if (this.data.year && !validator.isLength(this.data.year, { min: 4, max: 4 })) {
    this.errors.push('Year should be 4 characters in length.');
  }

  // check for non-allowed inputs
  if (this.data.username.length > 30) {
    this.errors.push('Username cannot exceed 20 characters.');
  }
  if (this.data.firstName.length > 30) {
    this.errors.push('First name cannot exceed 30 characters.');
  }
  if (this.data.firstName && !helpers.isAlphaNumericDashHyphenPeriod(this.data.firstName)) {
    this.errors.push('First name can only contain letters, dashes, undercores, periods, and numbers.');
  }
  if (this.data.lastName.length > 30) {
    this.errors.push('Last name cannot exceed 30 characters.');
  }
  if (this.data.lastName && !helpers.isAlphaNumericDashHyphenPeriod(this.data.lastName)) {
    this.errors.push('Last name can only contain letters, dashes, undercores, periods, and numbers.');
  }

  if (this.data.year && !validator.isNumeric(this.data.year)) {
    this.errors.push('Year can only be numbers.');
  }
};

User.prototype.cleanUp = function () {
  this.data.username = typeof this.data.username === 'string' ? this.data.username.trim() : '';
  this.data.firstName = typeof this.data.firstName === 'string' ? this.data.firstName.trim() : '';
  this.data.lastName = typeof this.data.lastName === 'string' ? this.data.lastName.trim() : '';
  this.data.email = typeof this.data.email === 'string' ? this.data.email.trim() : '';
  this.data.username = typeof this.data.username === 'string' ? this.data.username.trim() : '';
};

User.prototype.register = async function () {
  try {
    this.cleanUp();
    this.validateSomeUserRegistrationInputs();
    this.validatePassword();
    await this.validateEmail();
    await this.validateUsername();

    if (this.errors.length) {
      throw this.errors;
    }

    const salt = bcrypt.genSaltSync(10);
    this.data.password = bcrypt.hashSync(this.data.password, salt);
    this.data.photo = '';
    this.data.comments = [];

    const userDoc = await usersCollection.insertOne(this.data);
    new Email().regSuccessEmail(this.data.email, this.data.firstName);
    return userDoc;
  } catch (error) {
    throw error;
  }
};

User.findByEmail = async function (email) {
  try {
    if (typeof email !== 'string') return false;

    const userDoc = await usersCollection.findOne({ email });

    if (!userDoc) return false;

    return User.extractAllowedUserProps(userDoc);
  } catch (error) {
    return false;
  }
};

User.findByUsername = async function (username) {
  try {
    if (typeof username !== 'string') return false;

    const userDoc = await usersCollection.findOne({ username });

    if (!userDoc) return false;

    return User.extractAllowedUserProps(userDoc);
  } catch (error) {
    return false;
  }
};

User.extractAllowedUserProps = user => {
  return {
    _id: user._id,
    ...(user.google_id && { google_id: user.google_id, google_photo: user.photo }),
    firstName: user.firstName,
    lastName: user.lastName,
    year: user.year,
    email: user.email,
    nickname: user.nickname,
    username: user.username,
    photo: user.photo,
    residence: user.residence,
    class: user.class,
    occupation: user.occupation,
    teacher: user.teacher,
    month: user.month,
    day: user.day,
    phone: user.phone,
    social_type_1: user.social_type_1,
    link_social_type_1: user.link_social_type_1,
    social_type_2: user.social_type_2,
    link_social_type_2: user.link_social_type_2,
    relationship: user.relationship,
    comments: user.comments,
  };
};

User.prototype.update = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let status = await this.actuallyUpdate();

      resolve(status);
    } catch {
      reject();
    }
  });
};


User.prototype.actuallyUpdate = async function (sessionData) {
  try {
    this.cleanUp();
    this.validateSomeUserRegistrationInputs();
    this.editValidation();
     await this.compareEmailDuringProfileUpdate(sessionData.email);
     await this.compareUsernameDuringProfileUpdate(sessionData.username);

    if (!this.errors.length) {
      const updateData = {
        firstName: this.data.firstName,
        lastName: this.data.lastName,
        email: this.data.email,
        year: this.data.year,
        nickname: this.data.nickname,
        username: this.data.username,
        residence: this.data.residence,
        class: this.data.class,
        occupation: this.data.occupation,
        teacher: this.data.teacher,
        month: this.data.month,
        day: this.data.day,
        phone: this.data.phone,
        social_type_1: this.data.social_type_1,
        link_social_type_1: this.data.link_social_type_1,
        social_type_2: this.data.social_type_2,
        link_social_type_2: this.data.link_social_type_2,
        relationship: this.data.relationship,
      };
      const result = await usersCollection.findOneAndUpdate({ username: this.requestedUsername }, { $set: updateData }, { returnDocument: 'after' });
      return { status: 'success', userDoc: User.extractAllowedUserProps(result.value) };
    }
    return { status: 'failure' };
  } catch (error) {
    console.error(error);
    return { status: 'failure', error: error };
  }
};

User.prototype.compareEmailDuringProfileUpdate = async function (sessionEmail) {
  if (sessionEmail !== this.data.email) {
    await this.validateEmail();
  }
};

User.prototype.compareUsernameDuringProfileUpdate = async function (sessionUsername) {
  if (sessionUsername !== this.data.username) {
    await this.validateUsername();
  }
};


User.storeImage = async (imageUrl, username) => {
  await usersCollection.findOneAndUpdate(
    { username },
    {
      $set: {
        photo: imageUrl,
      },
    }
  );
};

User.isVisitorOwner = function (sessionUsername, requestedUsername) {
  return sessionUsername == requestedUsername;
};

User.delete = async function (username) {
  try {
    // DELETE ACCOUNT
    await usersCollection.deleteOne({ username });
    // NOW DELETE COMMENTS OF THE USER ACROSS ALL DOCS
    await usersCollection.updateMany({}, { $pull: { comments: { visitorUsername: username } } }, { multi: true });

    return 'Success';
  } catch (error) {
    console.error(error);
    throw error;
  }
};

User.allProfiles = async function () {
  let allProfiles = await usersCollection.find({}).toArray();
  allProfiles = allProfiles.map(User.extractAllowedUserProps);
  return allProfiles;
};

User.getRecentProfiles = async () => {
  const recentContacts = await usersCollection.find({}).limit(8).sort({ $natural: -1 }).toArray();

  return recentContacts.map(({ _id, firstName, lastName, year, email, google_id, nickname, username, photo, phone }) => ({
    _id,
    firstName,
    lastName,
    year,
    email,
    ...(google_id && { google_id }),
    nickname,
    username,
    photo,
    phone,
  }));
};

User.search = async function (searchedItem, sort = 1) {
  return new Promise(async (resolve, reject) => {
    try {
      const safeSearchedItem = _.escapeRegExp(searchedItem);
      let searchFields = helpers.searcheableFields.map(field => {
        return { [field]: { $regex: new RegExp(safeSearchedItem, 'i') } };
      });

      let sortOrder = sort === '-1' ? -1 : 1;

      let searchedResult = await usersCollection
        .find({
          $or: searchFields,
        })
        .sort({ _id: sortOrder })
        .toArray();

      resolve(searchedResult.map(eachDoc => User.extractAllowedUserProps(eachDoc)));
    } catch (error) {
      reject(error);
    }
  });
};

User.prototype.passwordChangeValidatation = function () {
  return new Promise(async (resolve, reject) => {
    if (this.data.old_password == '') {
      this.errors.push('Please enter your old password.');
    }
    if (this.data.new_password == '') {
      this.errors.push('Please enter your new password.');
    }
    if (this.data.confirm_new_password == '') {
      this.errors.push('Please confirm your new password.');
    }
    if (!validator.isLength(this.data.new_password, { min: 6, max: 50 })) {
      this.errors.push('New password must be at least 6 characters.');
    }
    if (this.data.new_password !== this.data.confirm_new_password) {
      this.errors.push('New passwords do not match.');
    }

    if (this.data.old_password) {
      // FIND OLD PASSWORD AND COMPARE WITH INPUTED OLD PASSWORD
      let userDoc = await usersCollection.findOne({
        username: this.sessionUsername,
      });

      if (!userDoc.password) {
        this.errors.push('You registered using Google. Changing password not available.');
      } else {
        if (!bcrypt.compareSync(this.data.old_password, userDoc.password)) {
          this.errors.push('Old passwords do not match.');
        }
      }
    }
    resolve();
  });
};

User.prototype.updatePassword = function () {
  return new Promise(async (resolve, reject) => {
    await this.passwordChangeValidatation();

    if (!this.errors.length) {
      // Hash user password
      let salt = bcrypt.genSaltSync(10);
      this.data.confirm_new_password = bcrypt.hashSync(this.data.confirm_new_password, salt);
      await usersCollection.findOneAndUpdate(
        { username: this.sessionUsername },
        {
          $set: {
            password: this.data.confirm_new_password,
          },
        }
      );
      resolve('Password successfully updated.');
    } else {
      reject(this.errors);
    }
  });
};

User.prototype.resetPassword = async function (url) {
  try {
    // CHECK IF EMAIL IS VALID
    if (!validator.isEmail(this.data.reset_password_email)) {
      return ['This is not a valid email.'];
    }
    // IF VALID EMAIL CHECK DB
    let userDoc = await usersCollection.findOne({
      email: this.data.reset_password_email.trim(),
    });
    // IF DB RETURNS NOTHING, ALERT USER
    if (!userDoc) {
      this.errors.push('No account with that email address exists.');
    }

    // IF NO ERRORS
    if (!this.errors.length) {
      const token = await User.cryptoRandomData();
      const resetPasswordExpires = Date.now() + 3600000; // 1 HOUR EXPIRY
      // ADD TOKEN AND EXPIRY TO DB
      await usersCollection.findOneAndUpdate(
        { email: userDoc.email },
        {
          $set: {
            resetPasswordToken: token,
            resetPasswordExpires: resetPasswordExpires,
          },
        }
      );

      // SEND TOKEN TO USER'S EMAIL
      new Email().sendResetPasswordToken(userDoc.email, userDoc.firstName, url, token);
      // SEND TOKEN TO USER'S EMAIL ENDs
      return `Sucesss! Check your email inbox at ${userDoc.email} for further instruction. Check your SPAM folder too.`;
    } else {
      return this.errors;
    }
  } catch (error) {
    throw new Error(error);
  }
};


User.cryptoRandomData = function () {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(20, (err, buf) => {
      if (buf) {
        var token = buf.toString('hex');
        resolve(token);
      } else {
        reject(err);
      }
    });
  });
};

User.resetTokenExpiryTest = function (token) {
  return new Promise(async (resolve, reject) => {
    let user = await usersCollection.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      reject('Password reset token is invalid or has expired. Please generate another token below.');
    }
    if (user) {
      resolve();
    }
  });
};

User.prototype.passwordResetValidatation = function () {
  if (this.data.new_password == '') {
    this.errors.push('Please enter a new password.');
  }
  if (!validator.isLength(this.data.new_password, { min: 6, max: 50 })) {
    this.errors.push('New password must be at least 6 characters.');
  }
  if (this.data.new_password != this.data.confirm_new_password) {
    this.errors.push('Passwords do not match.');
  }
};

User.prototype.resetToken = function (token) {
  return new Promise(async (resolve, reject) => {
    // CHECK FOR ERRORS
    this.passwordResetValidatation();
    // IS TOKEN IN DB AND NOT EXPIRED?
    let user = await usersCollection.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      reject('Password reset token is invalid or has expired. Please generate another token below.');
    }
    // HASH USER PASSWORD
    let salt = bcrypt.genSaltSync(10);
    this.data.confirm_new_password = bcrypt.hashSync(this.data.confirm_new_password, salt);
    // IF VALIDATION ERRORS
    if (!this.errors.length) {
      await usersCollection.findOneAndUpdate(
        { email: user.email },
        {
          $set: {
            password: this.data.confirm_new_password,
          },
        }
      );

      resolve('Password successfully reset. You may now login to your account.');
      // SEND CONFIRMATION EMAIL
      new Email().sendResetPasswordConfirmationMessage(user.email, user.firstName);
      // SEND CONFIRMATION EMAIL ENDS

      // SET RESET TOKEN AND EXPIRY TO UNDEFINED
      usersCollection.findOneAndUpdate(
        { resetPasswordToken: token },
        {
          $set: {
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined,
          },
        }
      );
    } else {
      reject(this.errors);
    }
  });
};

User.doesEmailExist = email => {
  return new Promise(async (resolve, reject) => {
    if (typeof email != 'string') {
      resolve(false);
      return;
    }

    let user = await usersCollection.findOne({ email });
    if (user) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

User.contactsCount = async () => await usersCollection.countDocuments();

User.addSocialUser = data => {
  return new Promise(async (resolve, reject) => {
    try {
      // INITIALIZE THE BELOW PROPERTIES FOR EACH REGISTERED USER
      data.comments = [];
      data.likes_received_from = [];
      data.likes_given_to = [];

      const userDoc = await usersCollection.insertOne(data);

      resolve(userDoc);
      // EMAIL USER FOR A SUCCESSFUL REGISTRATION
      new Email().regSuccessEmail(data.email, data.firstName);
      // EMAIL USER FOR A SUCCESSFUL REGISTRATION ENDS
    } catch {
      reject('There was an issue registering your account. Please try again.');
    }
  });
};

User.saveComment = async data => {
  // Check for empty comment
  if (!data.comment) throw new Error('Comment cannot be empty');
  // Find owner of profile and add comment
  const { value } = await usersCollection.findOneAndUpdate({ email: data.profileEmail }, { $push: { comments: data } }, { projection: { firstName: 1, lastName: 1, username: 1, comments: 1 }, returnDocument: 'after' }).catch(err => {
    throw new Error(`Error adding comment: ${err.message}`);
  });

  // Email users for a successful comment
  new Email().sendCommentSuccessMessage(value.comments, data.visitorFirstName, data.visitorEmail, data.photo, data.commentDate, data.comment, data.profileEmail, value.firstName, value.lastName, value.username);
  return data;
};

// UPDATE FIRST NAME IN COMMENTS FOR A USER WHO UPDATES THEIR PROFILE
User.updateCommentFirtName = (email, firstName) => {
  return new Promise(async (resolve, reject) => {
    try {
      await usersCollection.updateMany(
        { 'comments.visitorEmail': email },
        {
          $set: {
            'comments.$[elem].visitorFirstName': firstName,
          },
        },
        {
          arrayFilters: [{ 'elem.visitorEmail': email }],
          multi: true,
        }
      );
      resolve();
    } catch {
      reject(err => console.log("Error updating user's comments firstname." + err));
    }
  });
};

// UPDATE PHOTO IN COMMENTS FOR A USER WHO UPDATES THEIR PROFILE
User.updateCommentPhoto = (email, photo) => {
  return new Promise(async (resolve, reject) => {
    try {
      await usersCollection.updateMany(
        { 'comments.visitorEmail': email },
        {
          $set: {
            'comments.$[elem].photo': photo,
          },
        },
        {
          arrayFilters: [{ 'elem.visitorEmail': email }],
          multi: true,
        }
      );
      resolve();
    } catch {
      reject(err => console.log("Error updating user's comments firstname." + err));
    }
  });
};

User.updateComment = async data => {
  try {
    if (!data) throw new Error('No data provided');
    const result = await usersCollection.findOneAndUpdate(
      { email: data.profileEmail },
      {
        $set: {
          'comments.$[elem].comment': data.comment,
          'comments.$[elem].commentDate': `Updated ${helpers.getMonthDayYear()}, ${helpers.getHMS()}`,
        },
      },
      {
        projection: { comments: 1 },
        returnDocument: 'after',
        arrayFilters: [{ 'elem.commentId': { $eq: new ObjectId(data.commentId) } }],
        returnDocument: 'after',
      }
    );

    // FILTER ONLY THE COMMENT THAT WAS UPDATED
    const updatedCommentObject = helpers.singlePropArrayFilter(result.value.comments, data.commentId);

    return updatedCommentObject;
  } catch (error) {
    console.error(error.message);
    throw new Error('Comment was not updated.');
  }
};

// DELETE A COMMENT
User.deleteComment = async (commentId, profileEmail) => {
  try {
    await usersCollection.updateOne({ email: profileEmail }, { $pull: { comments: { commentId: new ObjectId(commentId) } } });
    return 'Comment deleted.';
  } catch (error) {
    console.log(error);
    throw new Error('Sorry, comment was not deleted. Please try again.');
  }
};

// LIKES
User.storeLikes = data => {
  return new Promise(async (resolve, reject) => {
    /**
     * IF A USER LIKES PROFILE A, THE EMAIL OF THE USER AND COLOR VALUE
     * ARE STORED IN PROFILE A'S DOCUMENT
     * @EMAIL { @STRING }
     * @COLOR { @VALUES YES/NO }
     */
    // DELETE OLD PROPERTIES
    await usersCollection.updateOne({ email: data.profileEmail }, { $pull: { likes_received_from: { visitorEmail: data.visitorEmail } } });

    // ADD THE NEW PROPERTY TO  PROFILE OWNER
    usersCollection
      .findOneAndUpdate(
        { email: data.profileEmail },
        {
          $push: {
            likes_received_from: data,
          },
          $inc: { totalLikes: data.like },
        },
        { returnDocument: 'after' }
      )
      .then(info => {
        // FILTER ONLY VISITORS INFO
        const visitorInfo = info.value.likes_received_from.filter(i => i.visitorEmail == data.visitorEmail);
        // ADD TOTALLIKES TO FILTERED OBJECT FROM DB
        visitorInfo[0].totalLikes = info.value.totalLikes;
        /**
         * RESOLVE WITH VISITOR_OBJECT
         * @VISITOR_OBJECT [ {COLOR: VALUE, VISITOREMAIL: VALUE,
         * VISITORNAME: VALUE, TOTALLIKES: VALUE} ]
         */
        resolve(visitorInfo);
      })
      .catch(_ => {
        reject();
      });
    /**
     * IF A USER LIKES PROFILE A, THE EMAIL OF PROFILE A AND COLOR VALUE
     * ARE STORED IN THE USER'S DOCUMENT
     * @EMAIL { @STRING }
     * @COLOR { @VALUES YES/NO }
     */
    // DELETE OLD PROPERTIES
    await usersCollection.updateOne({ email: data.visitorEmail }, { $pull: { likes_given_to: { profileEmail: data.profileEmail } } });
    // ADD THE NEW PROPERTY TO VISITOR'S PROFILE
    usersCollection.findOneAndUpdate(
      { email: data.visitorEmail },
      {
        $push: {
          likes_given_to: {
            color: data.color,
            profileEmail: data.profileEmail,
            visitorName: data.visitorName,
          },
        },
      }
    );
  });
};

// EXPORT CODE
module.exports = User;
