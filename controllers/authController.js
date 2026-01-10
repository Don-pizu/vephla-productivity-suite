// controllers/authController.js

const User = require('../models/User');
const { createToken } = require('../util/jwt');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { sendOtpEmail, fortgotPassOtpEmail } = require('../util/emailService');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');




//Register a new user
exports.register = async (req, res) => {
	try {

		const { name, email, password, confirmPassword, role } = req.body;

		if ( !name  || !email || !password || !confirmPassword) 
			return res.status(400).json({ message: 'All the fields are required'});

    const cleanPassword = String(password).trim();
    const cleanConfirmPassword =  String(confirmPassword).trim();

		//Check if passwords match
		if (cleanPassword !== cleanConfirmPassword) {
			return res.status(400).json({ message: 'Passwords do not match' });
		}

		//check if email already exists
		const eExists = await User.findOne({ email: email });
		if(eExists)
			return res.status(400).json({message: 'Email already exists'});

		// Generate 4-digit OTP
		const otp = Math.floor(1000 + Math.random() * 9000).toString();
		const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min



		const user = await User.create({
			name,
			email,
			password,
			role: role === 'admin' ? 'admin' : 'standard',
			otp,
     	otpExpires
		});

		await sendOtpEmail(email, otp);

		res.status(201).json({ 
	      message: 'User registered. Verify OTP sent to email',
	      _id: user._id,
	      email: user.email,
        role: user.role
       });

	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};


exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) 
      return res.status(400).json({ message: 'User not found' });

    if (user.otp !== otp)
      return res.status(400).json({ message: 'Invalid OTP' });

    if(user.otpExpires < Date.now()) 
      return res.status(400).json({ message: 'Expired OTP' });


    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.json({ 
      message: 'Account verified successfully',
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: createToken(user)
    });

  } catch (err) {
    next(err)
    res.status(500).json({ message: err.message });
  }
};

// Resend OTP
exports.resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if(!email)
      return res.status(400).json({ message: 'Email is required'});

  	const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) 
      return res.status(400).json({ message: "User not found" });

    if (user.isVerified) 
      return res.status(400).json({ message: "Account already verified" });

    // Generate new OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 min

    //update user detials
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    //Resend otp mail
    await sendOtpEmail(user.email, otp);

    res.json({ 
      message: "New OTP sent to email",
      email: user.email
    });
  } catch (err) {
    next(err)
    res.status(500).json({ message: err.message });
  }
};


//Login user 
exports.login = async (req, res) => {
	try{

		const { email, password } = req.body;

    if(!email || !password)
      return res.status(400).json({ messag: "Email and Password are required" });

		//check for User using email 
		const user = await User.findOne({ email: email });
		if(!user)
			return res.status(401).json({message: 'User is not found, Kindly check the email you entered'});

		if (!user.isVerified) 
		  return res.status(401).json({ message: "Please verify your account first" });

		const userPassword = await user.matchPassword(password);
		if(!userPassword)
			return res.status(401).json({message: 'Incorrect password'});

		if ( user && userPassword ) {
			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role:user.role,
				token: createToken(user)
			});
		} else {
			return res.status(401).json({ message: 'Invalid Credentials'});
		}

	}catch (err) {
		res.status(500).json({ message: err.message });
	}
};


//GET user by id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if(!user)
      return res.status(400).json({ message: 'User not found'});

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
    });
    
  } catch (err) {
     res.status(500).json({ message: err.message });
  }
}

//GET   Get all users

exports.getAllUsers = async (req, res) => {
	try {

		const {page = 1, limit = 10, email} = req.query;
		const query = {};   //for filtering

	if (email) 
		query.email = email;

		const skip = (parseInt(page) - 1) * parseInt(limit);

		const users = await User.find(query)
		 								.skip(skip)
		 								.limit(parseInt(limit))
		 								.sort({createdAt: -1});

		const totalUsers = await User.countDocuments(query);
		const totalPages = Math.ceil(totalUsers / limit);

		res.json({
			users,
			page: parseInt(page),
			totalPages,
			totalUsers
		});

	} catch {
		res.status(500).json({ message: err.message });
	}
};


// forgotPassword
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) 
    	return res.status(400).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;    // 15 min

    await user.save();

    // Build reset URL
    const resetUrl = `https://fake-drug-verification.onrender.com/api/auth/reset-password/${resetToken}`; ///////change to frontend link

    // send via email
    await fortgotPassOtpEmail(user.email, `Reset your password using this link: ${resetUrl}`);

    res.json({ message: "Password reset link sent to email" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the token from URL to compare with DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");


    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() } 
    });

    if (!user) 
    	return res.status(400).json({ message: "Invalid token" });

    if( user.resetPasswordExpire < Date.now() )
      return res.status(400).json({ message: 'Expired Token'})


    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.json({ message: "Password reset successful. You can now login." });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE USER (including image)
exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { name } = req.body;

    const updateFields = { name };

    // If an image is uploaded
    if (req.file) {
      updateFields.profileImage = req.file.path;
      //updateFields.profileImage =  `/uploads/${req.file.filename}`; 
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        profileImage: updatedUser.profileImage,    // Now a Cloudinary URL
        role: updatedUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// GET USER PROFILE
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      _id: user._id,
      name: user.name,
      profileImage: user.profileImage,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

