const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const dotenv = require('dotenv');
dotenv.config();
const usersCollection = require('../../db.js').db().collection('users');

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

const transformImage = async (imageUrl, userId) => {
  return await new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imageUrl,
      {
        public_id: userId,
        folder: 'gssgcontactbook.com',
        transformation: [{ aspect_ratio: '1.0', gravity: 'face', width: '0.6', zoom: '0.7', crop: 'thumb' }, { radius: 'max' }, { color: 'green', effect: 'outline' }],
      },
      function (err, image) {
        if (err) reject(err);

        resolve(image.secure_url);
      }
    );
  });
};

const fileDownloadCloudinary = () => {
  cloudinary.api
    .resources({ tags: true, max_results: 500, type: 'upload', prefix: 'gssgcontactbook.com/' }, function (error, result) {
      if (error) throw error;
      result.resources.map(async (resource, index) => {
        if (resource.tags.length) {
          const email = resource.tags[0];
          const url = resource.secure_url;
          //const my_image = await transformImage(url, resource.public_id);
        }
      });
    })
    .catch();
};

module.exports = {
  upload_to_cloudinary,
  fileDownloadCloudinary,
  transformImage,
  cloudinary,
};
