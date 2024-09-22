const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const passport = require('passport');

// Middleware to protect routes using JWT or session-based authentication
const protect = asyncHandler(async (req, res, next) => {
    // 1. Check if the user is authenticated using the session (Passport)
    if (req.isAuthenticated && req.isAuthenticated()) {
        // Passport session-based authentication
        console.log('User authenticated via session:', req.user);
        return next();  // Proceed if authenticated
    }

    // 2. Check if the user is authenticated using a JWT token
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Attach user to the request object
            req.user = await User.findById(decoded.id).select("-password");

            return next();  // Proceed if JWT is valid
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed.");
        }
    }

    // 3. If neither session nor token is valid, deny access
    res.status(401);
    throw new Error("Not authorized, no valid session or token.");
});


module.exports = protect;
