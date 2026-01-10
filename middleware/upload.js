// middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Cloudinary Storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'Vephla-Productivity-suite', // folder name in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov'],
      resource_type: 'auto', // handles both images and videos
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // unique ID
      transformation: [{ quality: 'auto', fetch_format: 'auto' }], // auto optimize
    };
  },
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage });

module.exports = upload;