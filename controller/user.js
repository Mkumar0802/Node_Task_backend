const express = require("express");
const router = express.Router();
const User = require("../model/user");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Make sure email is provided
    console.log(req.body);

    // Check if the user already exists
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ username, email, password }); // Include email in the user creation
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const signin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log(req.body);

    // Find the user in the database based on username or email and password
    const user = await User.findOne({
      $or: [{ username }, { email }],
      password,
    });

    if (user) {
      res.status(200).json({ message: "Sign in successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Define a function to generate a random token
function generateResetToken() {
  // Generate a random token using any desired method or library
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  return token;
}





// Function to send OTP to the user's email
const sendOTP = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 587,
  secure: false,
      auth: {
        user: "mkumar0802@gmail.com",
        pass: "snip nsim olgu vzgo",
      },
    });

      const mailOptions = {
          from: 'muthukumar0802@gmail.com',
          to: email,
          subject: 'Password Reset OTP',
          text: `Your OTP for password reset is: ${otp}`,
      };

      await transporter.sendMail(mailOptions);
      return true;
  } catch (error) {
      console.error('Error sending OTP:', error);
      return false;
  }
};


// Function to generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};


// Function to encrypt the OTP
const encryptOTP = async (otp) => {
  const salt = await bcrypt.genSalt(10);
  const hashedOTP = await bcrypt.hash(otp, salt);
  return hashedOTP;
};




const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const plainOTP = generateOTP();
      const otpSent = await sendOTP(email, plainOTP);

      if (!otpSent) {
          return res.status(500).json({ message: 'Failed to send OTP. Please try again later.' });
      }

      const hashedOTP = await encryptOTP(plainOTP);
      user.resetOTP = hashedOTP;

      // Set token expiration time to 30 minutes from now
      const tokenExpiration = new Date();
      tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 1);
      user.resetTokenExpiration = tokenExpiration;

      await user.save();

      res.status(200).json({ message: 'OTP sent to your email for password reset.' });
  } catch (error) {
      console.error('Error sending password reset OTP:', error);
      res.status(500).json({ message: 'Internal server error or OTP Expries' });
  }
};


// Function to compare OTPs
const compareOTP = async (otp, hashedOTP) => {
  return await bcrypt.compare(otp, hashedOTP);
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const isOTPValid = await compareOTP(otp, user.resetOTP);

      if (!isOTPValid) {
          return res.status(400).json({ message: 'Invalid OTP' });
      }

      // const salt = await bcrypt.genSalt(10);
      // const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password =  newPassword;
      user.resetOTP = null;
      user.resetTokenExpiration = null;
      await user.save();

      res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
      console.error('Error resetting password:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
};









const token = async (req,res) =>  {
  const resetToken = req.params.token;
  const newPassword = req.body.newPassword;

  try {
      // Find user by reset token
      const user = await User.findOne({ resetToken });

      if (!user) {
          return res.status(404).json({ message: 'Invalid reset token' });
      }

      // Update user's password
      user.password = newPassword;
      user.resetToken = undefined; // Clear reset token after password update
      await user.save();

      res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
}






module.exports = {
  signin,
  signup,
  forgetPassword,
  token,
  resetPassword

};
