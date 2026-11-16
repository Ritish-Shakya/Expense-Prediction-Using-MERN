const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check if header exists and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and attach to request
    req.user = await User.findById(decoded.id).select('-password');

    // ⭐ ADD THIS CHECK - This was missing!
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();

  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};