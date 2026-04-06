const express = require('express');
const instagramAPI = require('../utils/instagramAPI');
const router = express.Router();

router.get('/profile', async (req, res) => {
  try {
    const profile = await instagramAPI.getUserProfile(req.session.accessToken);
    res.json({ success: true, profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

module.exports = router;