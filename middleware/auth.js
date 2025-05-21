const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => { // Middleware to authenticate user
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Extract token from Authorization header
  if (!token) {  // If no token is provided
    return res.status(401).json({
      status: 401,
      success: false,
      message: 'No token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using secret key
    req.user = decoded;                                        // Attach decoded user data to request object
    next();                                                    // Call next middleware
  } catch (error) {
    res.status(401).json({
      status: 401,
      success: false,
      message: 'Invalid token',
    });
  }
};

module.exports = authMiddleware;