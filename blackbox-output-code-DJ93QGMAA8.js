const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: {
    error: 'Too many requests. Try again in 1 minute.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;