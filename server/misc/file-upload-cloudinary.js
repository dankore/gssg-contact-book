const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');
dotenv.config();

const { hostname: cloud_name, username: api_key, password: api_secret } = new URL(process.env.CLOUDINARY_URL);

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'gssg-contact-book',
    allowedFormats: ['jpeg', 'png', 'jpg'],
    public_id: (req, res) => req.session.user._id,
  },
});

const upload_to_cloudinary = multer({ storage: storage });

const transformImage = (imageUrl, userId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(imageUrl, {
      public_id: userId,
      folder: 'gssg-contact-book',
      transformation: [{ aspect_ratio: '1.0', gravity: 'face', width: '0.6', zoom: '0.7', crop: 'thumb' }, { radius: 'max' }, { color: 'green', effect: 'outline' }]
    }, function (err, image) {
      if (err) reject(err);

      resolve(image.url);
    });
  });
};

// //  [
//   {aspect_ratio: "1.0", width: 150, crop: "fill"},
//   {radius: "max"}
//   ]

module.exports = {
  upload_to_cloudinary,
  transformImage,
  cloudinary,
};
