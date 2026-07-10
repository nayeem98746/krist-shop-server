const checkRole = (req, res, next) => {
  if (req.user.role === 'admin' || req.user.role === 'staff') {
    next()
  } else {
    res.status(403).send('Access denied')
  }
}
module.exports = checkRole

