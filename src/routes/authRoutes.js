const express = require('express');
const passport = require('passport');
const router = express.Router();

// Google OAuth routes - add role selection via state parameter
router.get('/google', (req, res, next) => {
  const role = req.query.role || 'student';
  const state = Buffer.from(JSON.stringify({ role })).toString('base64');
  
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    state
  })(req, res, next);
});

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const { user, token } = req.user;
    
    // Create redirect URL with token and user info
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?` +
      `token=${token}` + 
      `&id=${user.id}` +
      `&email=${encodeURIComponent(user.email)}` +
      `&firstName=${encodeURIComponent(user.first_name)}` +
      `&lastName=${encodeURIComponent(user.last_name)}` +
      `&role=${user.role}` +
      `&provider=google`;
      
    res.redirect(redirectUrl);
  }
);

// LinkedIn OAuth routes - add role selection via state parameter
router.get('/linkedin', (req, res, next) => {
  const role = req.query.role || 'student';
  const state = Buffer.from(JSON.stringify({ role })).toString('base64');
  
  passport.authenticate('linkedin', { 
    scope: ['openid', 'profile', 'email'],
    state
  })(req, res, next);
});

router.get('/linkedin/callback',
  passport.authenticate('linkedin', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const { user, token } = req.user;
    
    // Create redirect URL with token and user info
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?` +
      `token=${token}` + 
      `&id=${user.id}` +
      `&email=${encodeURIComponent(user.email)}` +
      `&firstName=${encodeURIComponent(user.first_name)}` +
      `&lastName=${encodeURIComponent(user.last_name)}` +
      `&role=${user.role}` +
      `&provider=linkedin`;
      
    res.redirect(redirectUrl);
  }
);

module.exports = router; 