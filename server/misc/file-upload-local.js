const multer = require('multer');
const { environment } = require('../misc/helpers');

let destination_folder = '';
if (environment == 'development') destination_folder = 'public/images-dev';
else destination_folder = 'public/images';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, destination_folder);
  },
  filename: function (req, file, cb) {
    cb(null, req.session.user._id);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid Mime Type, only JPEG and PNG'), false);
  }
};

const upload = multer({
  fileFilter,
  storage,
});

module.exports = upload;
