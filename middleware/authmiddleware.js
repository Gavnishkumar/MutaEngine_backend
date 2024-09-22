const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const passport = require('passport');

// Middleware to protect routes using JWT or session-based authentication
const protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if the user is authenticated using the session (Passport)
    if (req.isAuthenticated && req.isAuthenticated()) {
        // User is authenticated via Passport (e.g., Google login)
        req.user = req.user; // User is already attached by passport.deserializeUser()
        return next();
    }

    // Check if the user is authenticated using a JWT token
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Extract token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user by ID (from token) and attach to req.user
            req.user = await User.findById(decoded.id).select("-password");

            return next();
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed.");
        }
    }

    // If neither session nor token is valid, deny access
    res.status(401);
    throw new Error("Not authorized, no valid session or token.");
});

module.exports = protect;