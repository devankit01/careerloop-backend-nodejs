const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

module.exports = function(app) {
  // Initialize passport
  app.use(passport.initialize());
  
  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
    passReqToCallback: true,
    scope: ['profile', 'email']
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ 
        where: { 
          provider: 'google', 
          provider_id: profile.id 
        } 
      });
      
      // If user doesn't exist, check if email already exists
      if (!user) {
        const userWithEmail = await User.findOne({ 
          where: { 
            email: profile.emails[0].value 
          } 
        });
        
        if (userWithEmail) {
          // Update existing email user with Google credentials
          userWithEmail.provider = 'google';
          userWithEmail.provider_id = profile.id;
          userWithEmail.is_active = true;
          await userWithEmail.save();
          
          return done(null, {
            user: userWithEmail,
            token: generateToken(userWithEmail.id)
          });
        }
        
        // Create new user
        user = await User.create({
          email: profile.emails[0].value,
          first_name: profile.name.givenName || profile.displayName.split(' ')[0],
          last_name: profile.name.familyName || profile.displayName.split(' ').slice(1).join(' '),
          provider: 'google',
          provider_id: profile.id,
          role: 'student', // Default role
          is_active: true
        });
      }
      
      return done(null, {
        user,
        token: generateToken(user.id)
      });
    } catch (error) {
      return done(error, null);
    }
  }));
  
  // LinkedIn OAuth Strategy
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: '/api/auth/linkedin/callback',
    scope: ['openid', 'profile', 'email'],
    passReqToCallback: true,
  }, async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists
      let user = await User.findOne({ 
        where: { 
          provider: 'linkedin', 
          provider_id: profile.id 
        } 
      });
      
      // If user doesn't exist, check if email already exists
      if (!user) {
        // Get email from profile - handle different profile structures
        const email = profile.email || 
                     (profile.emails && profile.emails[0] && profile.emails[0].value) || 
                     (profile._json && profile._json.email) ||
                     `${profile.id}@linkedin.com`; // Fallback email if none provided
        
        const userWithEmail = await User.findOne({ 
          where: { 
            email: email 
          } 
        });
        
        if (userWithEmail) {
          // Update existing email user with LinkedIn credentials
          userWithEmail.provider = 'linkedin';
          userWithEmail.provider_id = profile.id;
          userWithEmail.is_active = true;
          await userWithEmail.save();
          
          return done(null, {
            user: userWithEmail,
            token: generateToken(userWithEmail.id)
          });
        }
        
        // Create new user
        user = await User.create({
          email: email,
          first_name: (profile.name && profile.name.givenName) || 
                     (profile.displayName && profile.displayName.split(' ')[0]) || 
                     'LinkedIn',
          last_name: (profile.name && profile.name.familyName) || 
                    (profile.displayName && profile.displayName.split(' ').slice(1).join(' ')) || 
                    'User',
          provider: 'linkedin',
          provider_id: profile.id,
          role: 'student', // Default role for new users
          is_active: true
        });
      }
      
      return done(null, {
        user,
        token: generateToken(user.id)
      });
    } catch (error) {
      return done(error, null);
    }
  }));
  
  // Serialize user into the session
  passport.serializeUser((data, done) => {
    done(null, data.user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findByPk(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}; 