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

        if (!user) {
          // Створення нового користувача, якщо його немає в базі
          user = new User({
            githubId: profile.id,
            username: profile.username,
            name: profile.displayName || profile.username,
            profileUrl: profile.profileUrl,
            avatarUrl: profile.photos[0]?.value,
            apiKey: accessToken,
            location: profile._json.location || '',
            bio: profile._json.bio || '',
            company: profile._json.company || '',
          });
          await user.save();
        } else {
          // Не перезаписувати дані, якщо вони були оновлені користувачем
          const updatedFields = {};
          if (!user.name) updatedFields.name = profile.displayName || user.name;
          if (!user.avatarUrl) updatedFields.avatarUrl = profile.photos[0]?.value;
          if (!user.location) updatedFields.location = profile._json.location;
          if (!user.bio) updatedFields.bio = profile._json.bio;
          if (!user.company) updatedFields.company = profile._json.company;

          updatedFields.apiKey = accessToken; // Оновлюємо токен доступу

          if (Object.keys(updatedFields).length > 0) {
            await User.findByIdAndUpdate(user.id, updatedFields);
          }
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
    name: req.user.name,
    profileUrl: req.user.profileUrl,
    avatarUrl: req.user.avatarUrl,
    location: req.user.location,
    bio: req.user.bio,
    company: req.user.company,
    email: req.user.email, // Додано email
    instagram: req.user.instagram || '',
    twitter: req.user.twitter || '',
    facebook: req.user.facebook || '',
  });
});


app.put('/api/user', ensureAuthenticated, async (req, res) => {
  try {
    const { name, bio, company, location, email, instagram, twitter, facebook } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        bio,
        company,
        location,
        email,
        instagram,
        twitter,
        facebook,
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
});



const helmet = require('helmet');

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"], // Дозволяємо завантаження ресурсів лише з того ж домену
      imgSrc: ["'self'", 'https://gitshow.onrender.com', 'data:'], // Дозволяємо зображення з вашого домену і gitshow.onrender.com
    },
  })
);






app.get('/api/github/projects', ensureAuthenticated, async (req, res) => {
  try {
    const githubApiUrl = `https://api.github.com/users/${req.user.username}/repos`;
    const response = await fetch(githubApiUrl, {
      headers: {
        Authorization: `token ${req.user.apiKey}`,
      },
    });
    const repos = await response.json();
    res.json(repos.map((repo) => ({ id: repo.id, name: repo.name, url: repo.html_url })));
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    res.status(500).json({ message: 'Failed to fetch GitHub projects' });
  }
});


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
