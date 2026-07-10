const jwt = require('jsonwebtoken')

const jwtTokenVerification = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).send('Token missing')

  const token = authHeader.split(' ')[1]

  jwt.verify(token, process.env.jwt_secret, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token')
    req.user = decoded
    next()
  })
}

module.exports =jwtTokenVerification



