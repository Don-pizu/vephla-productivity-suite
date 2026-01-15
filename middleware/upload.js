// middleware/upload.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Cloudinary Storage setup

//== Profile Image Upload
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'Vephla-Productivity-suite/profile', // folder name in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png'],
      resource_type: 'image', // handles images
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // unique ID
    };
  },
});


//== Note Attachement Upload
const noteStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'Vephla-Productivity-suite/notes', // folder name in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'pdf', 'txt'],
      resource_type: 'auto', // handles both images and videos
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // unique ID
    };
  },
});



//== Task Attachement Upload
// Cloudinary Storage setup
const taskStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'Vephla-Productivity-suite/notes', // folder name in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'pdf', 'txt'],
      resource_type: 'auto', // handles both images and videos
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // unique ID
    };
  },
});


//== Chat Attachement Upload
// Cloudinary Storage setup
const chatStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'Vephla-Productivity-suite/chats', // folder name in Cloudinary
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'pdf', 'txt'],
      resource_type: 'auto', // handles both images and videos
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`, // unique ID
    };
  },
});


module.exports = {
  upload: multer({ storage: profileStorage }),
  noteUpload: multer({ storage: noteStorage }),
  taskUpload: multer({ storage: taskStorage }),
  chatUpload: multer({ storage: chatStorage })
};