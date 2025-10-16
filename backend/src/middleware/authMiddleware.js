const {verifyToken} = require('../jwt');

const authMiddleware = async(req, res, next) => {
  try {
    const {authorization} = req.headers;
    
    if (!authorization) {
      return res.status(401).json({error: "No authorization header provided"});
    }
    
    if (!authorization.startsWith('Bearer ')) {
      return res.status(401).json({error: "Invalid authorization format. Use 'Bearer <token>'"});
    }
    
    const token = authorization.substring(7);
    
    if (!token) {
      return res.status(401).json({error: "No token provided"});
    }
    
    const payload = verifyToken(token);
    
    if (!payload || !payload.userId) {
      return res.status(401).json({error: "Invalid token payload"});
    }
    
    req.user = payload;
    next();
  } catch (error) {
    console.error('Auth middleware error:', {
      error: error.message,
      path: req.path,
      method: req.method
    });
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({error: "Token expired"});
    }
    
    return res.status(401).json({error: "Invalid token"});
  }
};

module.exports = authMiddleware;