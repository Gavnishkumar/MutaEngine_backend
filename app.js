const express= require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const dotenv= require('dotenv');
const connectDB = require('./config/db');
const router = require('./Route/userRoutes');
const userRoutes= require('./Route/userRoutes');
const paymentGatewayRoutes= require('./Route/paymentGatewayRoutes');
const cors= require('cors');
const User = require('./models/User');
const transactionsRoutes= require('./Route/transactionsRoutes');


const app= express();
app.use(express.json());
dotenv.config();
connectDB();

app.use(cors({
  origin: process.env.CLIENT_URI, // React frontend
  credentials: true // Allow cookies to be sent across domains
}));


// Use express-session to manage session for users
app.use(
  session({
    secret: 'your_secret_key', // Replace with a random secret key
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save a session that is new, but has not been modified
    cookie: { secure: false } // For development. Set secure to true if using HTTPS in production.
  })
);

// Initialize passport and session
app.use(passport.initialize());
app.use(passport.session());

// Passport serialize user
passport.serializeUser(function (user, done) {
    done(null, user.id); // Save the user ID into session
  });
  
  // Passport deserialize user
  passport.deserializeUser(function (id, done) {
    User.findById(id).then((user) => {
      done(null, user);
    });
  });

// Google OAuth2 strategy setup
passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        // Try to find if the user already exists
        const existingUser = await User.findOne({ googleId: profile.id });
  
        if (existingUser) {
          // User already exists, pass the user to Passport
          return done(null, existingUser);
        }
  
        // If user doesn't exist, create a new user
        const newUser = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value, // Google gives email as an array
          pic: profile.photos[0].value, // Google gives photos as an array
        });
  
        await newUser.save(); // Save the new user to the database
  
        return done(null, newUser);
      }
    )
  );

// Routes
app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );
  
  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: process.env.CLIENT_URI }),
    (req, res) => {
      res.redirect(process.env.CLIENT_URI); // Redirect to frontend
    }
  );
  
  
  app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect(`${process.env.CLIENT_URI}/login/`); // Redirect to home page or login page
    });
  });
  
  
  app.get('/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.status(401).json({ error: 'Not authenticated' });
    }
  });
  
  
app.use('/api/user',userRoutes);
app.use('/payment',paymentGatewayRoutes);
app.use('/api/transactions',transactionsRoutes);
const PORT=process.env.PORT || 5000;
const server=app.listen(PORT,()=>{
    console.log(`server is started at ${PORT}`);
})
