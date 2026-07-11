const User = require('../models/authModel')
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');


// ---------------------------Registration -------------------------

const registerController = async (req, res) => {
  try {
 
    const { username, email, password, userRole } = req.body
    
    if (!username || !email || !password) {
      return res.status(400).send('All fields required')
    }

    const existUser = await User.findOne({ email })
    if (existUser) return res.status(409).send('User already exists')

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await new User({
      username,
      email,
      password: hashPassword,
      userRole: userRole || 'user'
    }).save()

    res.status(201).send({
      message: 'User registered successfully',
      userId: user._id
    })

  } catch (err) {
    res.status(500).send(err.message)
  }
}

// ---------------------------- login ----------------------
// const loginController = async (req, res) => {
//   const { email, password } = req.body

//   const user = await User.findOne({ email })
//   if (!user) return res.status(404).send('User not found')

//   const match = await bcrypt.compare(password, user.password)
//   if (!match) return res.status(401).send('Wrong password')

//   const token = jwt.sign(
//     { email: user.email, role: user.userRole },
//     process.env.jwt_secret,
//     { expiresIn: '2d' }
//   )
//   console.log(token)
//   res.send({ token })
// }

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
