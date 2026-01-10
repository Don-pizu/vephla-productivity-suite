// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { register, verifyOtp, resendOtp, login, getUserById,
		 getAllUsers, forgotPassword, resetPassword, updateUser,
		 getUserProfile, } = require('../controllers/authController.js');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/verifyOtp', verifyOtp);
router.post('/resendOtp', resendOtp);
router.post('/forgotPassword', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/login', login);
router.get('/allusers', protect, admin, getAllUsers);
router.get('/user/:id', protect, admin, getUserById)
router.get('/me',protect, getUserProfile)
router.put('/update', protect, upload.single('image'), updateUser );

module.exports = router;