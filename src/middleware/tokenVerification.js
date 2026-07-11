// const jwt = require('jsonwebtoken')

// const jwtTokenVerification = (req, res, next) => {
//   const authHeader = req.headers.authorization
//   if (!authHeader) return res.status(401).send('Token missing')

//   const token = authHeader.split(' ')[1]

//   jwt.verify(token, process.env.jwt_secret, (err, decoded) => {
//     if (err) return res.status(401).send('Invalid token')
//     req.user = decoded
//     next()
//   })
// }

// module.exports =jwtTokenVerification



const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};

module.exports = verifyToken;