const express = require('express');
const instagramAPI = require('../utils/instagramAPI');
const router = express.Router();

const INSTAGRAM_AUTH_URL = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(process.env.INSTAGRAM_REDIRECT_URI)}&scope=user_profile,user_media&response_type=code`;

// Start OAuth flow
router.get('/login', (req, res) => {
  res.redirect(INSTAGRAM_AUTH_URL);
});

// OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).send('Authorization code missing');
    }

    // Exchange code for token
    const tokenData = await instagramAPI.exchangeCodeForToken(code);
    req.session.accessToken = tokenData.access_token;
    
    // Get user profile
    const userProfile = await instagramAPI.getUserProfile(tokenData.access_token);
    req.session.user = userProfile;

    res.redirect('/dashboard.html');
  } catch (error) {
    console.error('Auth error:', error.message);
    res.status(500).send('Authentication failed. Please try again.');
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

module.exports = router;