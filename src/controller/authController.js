const User = require('../models/authModel')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


// ---------------------------Registration -------------------------

 const registerController = async (req, res) => {
  try {
     const { 
      firstName, 
      lastName, 
      email, 
      password, 
      confirmPassword, 
      userRole,
      phoneNumber  
    } = req.body;
    
     if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields (firstName, lastName, email, password, confirmPassword) are required"
      });
    }

     if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match"
      });
    }

     if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long"
      });
    }

     const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email"
      });
    }

     const hashPassword = await bcrypt.hash(password, 10);

     const fullName = `${firstName} ${lastName}`;

     const user = await new User({
      username: fullName,  
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashPassword,
      userRole: userRole || 'user',  
      phoneNumber: phoneNumber || '',  
    }).save();

     const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.userRole,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );

     res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: token,
      user: {
        id: user._id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.userRole,
        phoneNumber: user.phoneNumber,
      }
    });

  } catch (err) {
     if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already exists"
      });
    }
    
     if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

     res.status(500).json({
      success: false,
      message: err.message || "Internal server error"
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.userRole,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.userRole,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { registerController, loginController }
