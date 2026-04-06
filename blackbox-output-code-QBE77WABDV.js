const express = require('express');
const instagramAPI = require('../utils/instagramAPI');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.get('/:username', [
  body('username').trim().escape().isLength({ min: 1, max: 30 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Invalid username' });
  }

  try {
    const { username } = req.params;
    const stories = await instagramAPI.getUserStories(req.user.id, req.session.accessToken);
    
    res.json({
      success: true,
      stories,
      username
    });
  } catch (error) {
    console.error('Stories fetch error:', error.message);
    
    if (error.message.includes('private')) {
      res.status(403).json({ error: 'This account is private - cannot view stories' });
    } else if (error.message.includes('No stories')) {
      res.status(404).json({ error: 'No active stories for this account' });
    } else {
      res.status(500).json({ error: 'Failed to fetch stories' });
    }
  }
});

module.exports = router;