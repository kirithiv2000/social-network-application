const jwt = require('jsonwebtoken');

const auth = async(req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');
  const cleanToken=token?.split(' ')[1];


  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Verify token
  try {
    const decoded =  jwt.verify(cleanToken, 'secretkey'); // Replace 'your_jwt_secret' with your actual JWT secret
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = auth;
