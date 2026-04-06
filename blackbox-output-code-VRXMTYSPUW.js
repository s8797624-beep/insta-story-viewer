const axios = require('axios');

class InstagramAPI {
  constructor() {
    this.baseURL = 'https://graph.instagram.com';
  }

  async exchangeCodeForToken(code) {
    const response = await axios.get(`${this.baseURL}/access_token`, {
      params: {
        client_id: process.env.INSTAGRAM_APP_ID,
        client_secret: process.env.INSTAGRAM_APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.INSTAGRAM_REDIRECT_URI,
        code
      }
    });
    return response.data;
  }

  async getUserProfile(accessToken) {
    const response = await axios.get(`${this.baseURL}/me`, {
      params: {
        fields: 'id,username,account_type,media_count',
        access_token: accessToken
      }
    });
    return response.data;
  }

  async getUserStories(userId, accessToken) {
    try {
      const response = await axios.get(`${this.baseURL}/${userId}/stories`, {
        params: {
          fields: 'id,media_type,media_url,permalink,thumbnail_url,timestamp,username,caption',
          access_token: accessToken
        }
      });
      return response.data.data || [];
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error('No stories available or private account');
      }
      throw error;
    }
  }

  async getUserByUsername(username, accessToken) {
    // Note: Direct username lookup requires Business API or approved app
    // This is a simplified version - in production you'd need proper lookup
    try {
      const profile = await this.getUserProfile(accessToken);
      return { id: profile.id, username: profile.username };
    } catch (error) {
      throw new Error('User lookup failed');
    }
  }
}

module.exports = new InstagramAPI();