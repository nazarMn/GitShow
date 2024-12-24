const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config();

const User = require('./models/User'); // User model

const app = express();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
  })
);

// Passport Configuration
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        // Якщо користувач не існує, створюємо нового
        if (!user) {
          user = new User({
            githubId: profile.id,
            username: profile.username,
            name: profile.displayName || profile.username, // Зберігаємо повне ім'я
            profileUrl: profile.profileUrl,
            avatarUrl: profile.photos[0]?.value,
            apiKey: accessToken,
            location: profile._json.location || null, 
            bio: profile._json.bio || null,
          });
          await user.save();
        } else {
          // Якщо користувач існує, оновлюємо дані
          user.apiKey = accessToken;
          user.name = profile.displayName || user.name; // Оновлюємо ім'я, якщо воно доступне
          user.location = profile._json.location;
          user.bio = profile._json.bio;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log(err));

// Authentication Middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/home'); // Redirect to React app home
  }
);

app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

app.get('/api/user', ensureAuthenticated, (req, res) => {
  res.json({
    username: req.user.username,
    name: req.user.name,  // Відправляємо повне ім'я
    profileUrl: req.user.profileUrl,
    avatarUrl: req.user.avatarUrl,
    apiKey: req.user.apiKey, // Відправляємо GitHub токен
    location: req.user.location,
    bio: req.user.bio
  });
});





app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://avatars.githubusercontent.com'], // Додано джерело аватарок
      },
    },
  })
);


// Serve React App
app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
