// costume middleware

const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // Get the token from the header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    // 401 not authorized
    return res.status(401).json({ msg: 'No token, autorization denied' });
  }

  // Verify token
  try {
    // Decoed the token
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    // Take req object nad assign a value to user
    req.user = decoded.user; // has user with id in the payload
    next();
  } catch (err) {
    // Run if token not valid
    res.status(401).json({ msg: 'Token is not valid' });
  }
};
