const instagramAPI = require('../utils/instagramAPI');

async function requireAuth(req, res, next) {
  if (!req.session.accessToken) {
    return res.status(401).json({ error: 'You must be logged in' });
  }

  try {
    // Verify token is still valid
    const userProfile = await instagramAPI.getUserProfile(req.session.accessToken);
    req.user = userProfile;
    next();
  } catch (error) {
    req.session.destroy();
    return res.status(401).json({ error: 'Session expired. Please login again.' });
  }
}

module.exports = { requireAuth };