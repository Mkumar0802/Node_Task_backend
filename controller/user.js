const express = require("express");
const router = express.Router();
const User = require("../model/user");
const nodemailer = require('nodemailer');

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




const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
      // Check if the user with the provided email exists
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Generate a unique token for password reset (You can use packages like 'crypto' to generate a secure token)
      const resetToken = generateResetToken();

      // Save the reset token in the user document
      user.resetToken = resetToken;
      await user.save();

      // Send password reset link to the user's email
      const transporter = nodemailer.createTransport({
          host: "mail.athulyahomecare.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
              user: "noreply@athulyaseniorcare.com", // Change to your email address
              pass: "Athulya@123", // Change to your password
          },
      });

      const mailOptions = {
          from: 'noreply@athulyaseniorcare.com',
          to: email,
          subject: 'Password Reset Request',
          text: `Click the following link to reset your password: http://localhost:3000/resetpassword/${resetToken}`,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
      console.error('Error sending password reset link:', error);
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
  token
};
