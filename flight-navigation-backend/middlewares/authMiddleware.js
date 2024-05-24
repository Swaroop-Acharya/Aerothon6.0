const authMiddleware = (req, res, next) => {
    // Dummy authentication middleware
    next();
  };
  
  module.exports = { authMiddleware };
  