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

// STATS : GET YEAR AND NUMBER OF PROFILES PER YEAR.
const statsByYear = allProfiles => {
  let yearsArray = allProfiles.map(item => item.year);
  let obj = {};

  for (var i = 0; i < yearsArray.length; i++) {
    !obj.hasOwnProperty(yearsArray[i]) ? (obj[yearsArray[i]] = 1) : (obj[yearsArray[i]] += 1);
  }

  return [Object.keys(obj), Object.values(obj)];
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

function formatMonth(num) {
  switch (num) {
    case 0:
      return 'Jan';
      break;
    case 1:
      return 'Feb';
      break;
    case 2:
      return 'Mar';
      break;
    case 3:
      return 'Apr';
      break;
    case 4:
      return 'May';
      break;
    case 5:
      return 'Jun';
      break;
    case 6:
      return 'Jul';
      break;
    case 7:
      return 'Aug';
      break;
    case 8:
      return 'Sep';
      break;
    case 9:
      return 'Oct';
      break;
    case 10:
      return 'Nov';
      break;
    case 11:
      return 'Dec';
  }
}

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
    case `/settings/${username}/delete`:
      return 'delete';
    default:
      return undefined;
  }
}

module.exports = {
  whichPage,
  environment: process.env.NODE_ENV == 'dev' ? 'development' : 'production',
  isAlphaNumericDashHyphenPeriod,
  statsByYear,
  getUsernameFromHeadersReferrer,
  getHMS,
  getMonthDayYear,
  sortProfiles,
  singlePropArrayFilter,
  commentsHelper,
};
