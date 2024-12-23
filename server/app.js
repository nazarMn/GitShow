const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const helmet = require('helmet');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Безпека Helmet
app.use(helmet({
  contentSecurityPolicy: false,
}));

// MongoDB модель користувача
const UserSchema = new mongoose.Schema({
  githubId: String,
  username: String,
  profileUrl: String,
  apiKey: String,
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  avatar: String,
  isActive: { type: Boolean, default: true },
  isAdmin: { type: Boolean, default: false },
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  language: { type: String, default: 'en' },
  twitter: String,
  facebook: String,
  linkedin: String,
  password: String,
  twoFactorEnabled: { type: Boolean, default: false },
  lastLogin: { type: Date },
  ipAddress: String,
  notificationsEnabled: { type: Boolean, default: true },
  privacySettings: { type: Object, default: {} },
  githubProjects: [
    {
      repoName: String, // Назва репозиторію
      repoUrl: String, // Посилання на репозиторій
      stars: { type: Number, default: 0 }, // Кількість зірок
      forks: { type: Number, default: 0 }, // Кількість форків
      description: String, // Опис репозиторію
      language: String, // Мова програмування
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Like' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dislike' }],
  views: [{ type: mongoose.Schema.Types.ObjectId, ref: 'View' }],
  downloads: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Download' }],
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bookmark' }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Notification' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
});

const User = mongoose.model('User', UserSchema);










async function getGitHubProjects(githubUsername) {
  try {
    const response = await axios.get(`https://api.github.com/users/${githubUsername}/repos`);
    return response.data.map(repo => ({
      repoName: repo.name,
      repoUrl: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      description: repo.description,
      language: repo.language,
    }));
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    return [];
  }
}








// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Налаштування Passport
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/github/callback',
},
async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ githubId: profile.id });
    if (!user) {
      user = await User.create({
        githubId: profile.id,
        username: profile.username,
        profileUrl: profile.profileUrl,
        apiKey: accessToken,
      });
    }
    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Сесії
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Підключення статичних файлів із папки dist, яка знаходиться за директорією server
app.use(express.static(path.join(__dirname, '..', 'dist')));

// API маршрути
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

app.get('/auth/github', passport.authenticate('github', { scope: ['user', 'repo'] }));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/profile');
  }
);

app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.json(req.user);
});

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

// Усі інші маршрути відправляють index.html з папки dist
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

// Старт сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
