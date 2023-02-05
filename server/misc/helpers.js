require('dotenv').config();

const singlePropArrayFilter = (arr, valueToFilter) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].commentId == valueToFilter) {
      return arr[i];
    }
  }
};

// SORT PROFILES
const sortProfiles = array => array.sort((a, b) => b.comments.length - a.comments.length);

// VALIDATION: ALLOWS ONLY LETTERS, NUMBERS, DASHES, AND HYPHENS
const isAlphaNumericDashHyphenPeriod = stringInput => {
  return /^[\w-\.]+$/.test(stringInput);
};

const getUsernameFromHeadersReferrer = urlString => {
  const urlArray = urlString.split('/');
  const username = urlArray[urlArray.length - 1];

  return username;
};

// HOURS MINUTES
function addZero(i) {
  if (i < 10) {
    i = '0' + i;
  }
  return i;
}

const getHMS = _ => {
  var d = new Date();
  var h = addZero(d.getUTCHours() - d.getTimezoneOffset() / 60);
  var m = addZero(d.getUTCMinutes());
  return h + ':' + m;
};

function formatMonth(num) {
  switch (num) {
    case 0:
      return 'Jan';
    case 1:
      return 'Feb';
    case 2:
      return 'Mar';
    case 3:
      return 'Apr';
    case 4:
      return 'May';
    case 5:
      return 'Jun';
    case 6:
      return 'Jul';
    case 7:
      return 'Aug';
    case 8:
      return 'Sep';
    case 9:
      return 'Oct';
    case 10:
      return 'Nov';
    case 11:
      return 'Dec';
  }
}

// HOURS MINUTES
// MONTH DAY YEAR
const getMonthDayYear = () => {
  const date = new Date();
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  const yearFormated = ('' + year).slice(2); // GET LAST TWO DIGITS
  const monthFormated = formatMonth(month);
  const dayFormated = addZero(day);
  return `${monthFormated}. ${dayFormated}, '${yearFormated}`;
};

const commentsHelper = comments => {
  if (comments.length) {
    if (comments.length > 1) {
      return comments.length + ' comments';
    } else {
      return comments.length + ' comment';
    }
  } else {
    return 'Be the first to say hello';
  }
};

function whichPage(path, username) {
  switch (path) {
    case `/settings/${username}/edit-profile`:
      return 'edit-profile';
    case `/settings/${username}/change-profile-photo`:
      return 'change-profile-photo';
    case `/settings/${username}/change-password`:
      return 'change-password';
    case `/settings/${username}/delete-account`:
      return 'delete-account';
    default:
      return undefined;
  }
}

const working_url = process.env.NODE_ENV == 'dev' ? 'http://localhost:3000' : 'https://www.gssgcontactbook.com';

const DB_CONNECTION_STRING = process.env.NODE_ENV == 'dev' ? process.env.LOCAL_CONNECTIONSTRING : process.env.CONNECTIONSTRING;

const searcheableFields = ['firstName', 'lastName', 'year', 'email', 'nickname', 'residence', 'class', 'relationship', 'occupation', 'month', 'day', 'teacher'];
const sitemapUrls = ['/', '/about', '/login', '/register', '/google-login', '/privacy', '/contacts'];

module.exports = {
  DB_CONNECTION_STRING,
  getHMS,
  whichPage,
  environment: process.env.NODE_ENV == 'dev' ? 'development' : 'production',
  working_url,
  isAlphaNumericDashHyphenPeriod,
  getUsernameFromHeadersReferrer,
  getMonthDayYear,
  sortProfiles,
  singlePropArrayFilter,
  commentsHelper,
  sitemapUrls,
  searcheableFields,
};
