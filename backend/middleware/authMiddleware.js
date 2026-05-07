// ========================================
// AUTHENTICATION MIDDLEWARE
// ========================================
// This file checks if user has a valid token before allowing access to protected routes
// Middleware = code that runs BEFORE route handlers

// Import JWT library for verifying tokens
const jwt = require('jsonwebtoken');

// ========== AUTH MIDDLEWARE FUNCTION ==========
// This function runs on every protected route request
// It checks if the request has a valid token
const authMiddleware = (req, res, next) => {
  // ===== STEP 1: Get token from request headers =====
  // Token comes in header like: "Authorization: Bearer eyJhbGc..."
  // The ?. means "optional chaining" - use split only if authorization exists
  // split(' ')[1] gets the part AFTER "Bearer "
  const token = req.headers.authorization?.split(' ')[1];

  // ===== STEP 2: Check if token exists =====
  if (!token) {
    // No token? Send error (401 = Unauthorized)
    return res.status(401).json({ error: 'No token provided' });
  }

  // ===== STEP 3: Verify token =====
  try {
    // jwt.verify() checks if token is real and hasn't been modified
    // JWT_SECRET is the secret key used to create the token
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'your_jwt_secret_key_here_change_in_production'
    );
    
    // ===== STEP 4: Save user info to request =====
    // Decoded token contains user info (id, email)
    // Store it so route handlers can use req.user
    req.user = decoded;
    
    // ===== STEP 5: Continue to route handler =====
    // next() tells Express to continue to the actual route handler
    next();
    
  } catch (error) {
    // Token is invalid or expired
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// ========== EXPORT ==========
// Other route files import this to protect their endpoints
module.exports = authMiddleware;
