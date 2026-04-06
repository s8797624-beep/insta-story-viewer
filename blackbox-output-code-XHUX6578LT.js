require('dotenv').config();
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const storiesRoutes = require('./routes/stories');
const usersRoutes = require('./routes/users');
const rateLimiter = require('./middleware/rateLimiter');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Rate limiting
app.use('/api/', rateLimiter);

// Routes
app.use('/auth', authRoutes);
app.use('/api/stories', authMiddleware.requireAuth, storiesRoutes);
app.use('/api/users', authMiddleware.requireAuth, usersRoutes);

// Serve frontend routes
app.get('/', (req, res) => {
  if (req.session.accessToken) {
    res.redirect('/dashboard.html');
  } else {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  }
});

app.get('/dashboard', authMiddleware.requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

app.get('/story-viewer', authMiddleware.requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/story-viewer.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});