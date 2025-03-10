const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const helmet = require('helmet');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User'); 

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
app.use(cors());

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

        // Отримуємо contributions
        const contributions = await fetchGitHubContributions(profile.username, accessToken);

        if (!user) {
          // Створюємо нового користувача
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
            contributions, // Додаємо contributions
          });
          await user.save();
        } else {
          // Оновлюємо contributions кожен раз при логіні
          await User.findByIdAndUpdate(user.id, { contributions });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

async function fetchGitHubContributions(username, token) {
  try {
    const today = new Date();
    const contributions = [];

    for (let i = 14; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const formattedDate = date.toISOString().split('T')[0];

      // Робимо запит до GitHub API на комміти за конкретну дату
      const response = await axios.get(
        `https://api.github.com/search/commits?q=author:${username}+committer-date:${formattedDate}`,
        {
          headers: {
            Authorization: `token ${token}`,
            Accept: 'application/vnd.github.cloak-preview',
          },
        }
      );

      contributions.push({ date: formattedDate, count: response.data.total_count || 0 });
    }

    return contributions;
  } catch (error) {
    console.error('Помилка при отриманні contributions:', error.message);
    return [];
  }
}



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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

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
    res.redirect('/home');
  }
);

app.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect('/');
  });
});

app.get('/api/user', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  res.json({
    username: req.user.username,
    name: req.user.name,
    avatarUrl: req.user.avatarUrl,
    location: req.user.location,
    bio: req.user.bio,
    company: req.user.company,
    contributions: req.user.contributions, // Відправляємо contributions
    YearsOfExperience: req.user.YearsOfExperience
  });
});


app.put('/api/user', ensureAuthenticated, async (req, res) => {
  try {
    const { name, bio, company, location, email, instagram, twitter, facebook, YearsOfExperience } = req.body;

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
        YearsOfExperience,
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
});



app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https://avatars.githubusercontent.com'], 
      },
    },
  })
);



// CV Creation
const CV = require('./models/CV');

app.get('/api/cv/check', ensureAuthenticated, async (req, res) => {
  try {
      const existingCV = await CV.findOne({ userId: req.user.id });
      res.json({ hasCV: !!existingCV });
  } catch (error) {
      console.error('Error checking CV:', error);
      res.status(500).json({ message: 'Failed to check CV' });
  }
});

// Створення CV з ім'ям і фото користувача
app.post('/api/cv', ensureAuthenticated, async (req, res) => {
  try {
      const existingCV = await CV.findOne({ userId: req.user.id });
      if (existingCV) {
          return res.status(400).json({ message: 'You already have a saved CV.' });
      }

      const { templateId, name, avatarUrl, email, location } = req.body;
      if (!name || !avatarUrl) {
          return res.status(400).json({ message: 'Name and avatar are required.' });
      }

      const newCV = new CV({
          userId: req.user.id,
          templateId,
          name,
          avatarUrl,
          email,
          location
      });

      await newCV.save();
      res.status(201).json({ message: 'CV saved successfully!', cv: newCV });
  } catch (error) {
      console.error('Error saving CV:', error);
      res.status(500).json({ message: 'Failed to save CV' });
  }
});

// Отримання CV користувача
app.get('/api/cv', ensureAuthenticated, async (req, res) => {
  try {
    const cv = await CV.findOne({ userId: req.user.id });

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    res.status(200).json(cv);
  } catch (error) {
    console.error('Error fetching CV:', error);
    res.status(500).json({ message: 'Failed to fetch CV' });
  }
});

// Оновлення CV
app.put('/api/cv', ensureAuthenticated, async (req, res) => {
  try {
    const updatedCV = await CV.findOneAndUpdate(
      { userId: req.user.id },
      {
        name: req.body.name,
        specialty: req.body.specialty,
        summary: req.body.summary,
        phoneNumber: req.body.phoneNumber,
        location: req.body.location,
        email: req.body.email,
        references: req.body.references || [], 
        education: req.body.education || {},
        skills: req.body.skills || [],
        experience: Array.isArray(req.body.experience) ? req.body.experience : existingCV.experience || [],
      },
      { new: true } // повертає оновлений документ
    );

    if (!updatedCV) {
      return res.status(404).json({ message: 'CV not found' });
    }

    res.status(200).json(updatedCV);
  } catch (error) {
    console.error('Error updating CV:', error);
    res.status(500).json({ message: 'Failed to update CV' });
  }
});

// Видалення досвіду з CV
app.delete('/api/cv/experience/:expId', ensureAuthenticated, async (req, res) => {
  try {
    const cv = await CV.findOne({ userId: req.user.id });

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    // Фільтруємо досвід, щоб видалити той, ID якого передано в запиті
    cv.experience = cv.experience.filter(exp => exp._id.toString() !== req.params.expId);

    await cv.save(); // Зберігаємо оновлене CV
    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ message: 'Failed to delete experience' });
  }
});



app.delete('/api/cv/delete', ensureAuthenticated, async (req, res) => {
  try {
    const deletedCV = await CV.findOneAndDelete({ userId: req.user.id });

    if (!deletedCV) {
      return res.status(404).json({ message: 'CV not found' });
    }

    res.status(200).json({ message: 'CV deleted successfully!' });
  } catch (error) {
    console.error('Error deleting CV:', error);
    res.status(500).json({ message: 'Failed to delete CV' });
  }
});





// Resume Schema and Routes
const resumeSchema = new mongoose.Schema({
  title: String,
  university: String,
  description: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Resume = mongoose.model('Resume', resumeSchema);

app.get('/api/resumes', ensureAuthenticated, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id });
    res.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ message: 'Error fetching resumes' });
  }
});


app.post('/api/resumes', ensureAuthenticated, async (req, res) => {
  try {
    const { title, university, description } = req.body;

    const resume = new Resume({
      title,
      university,
      description,
      user: req.user._id, 
    });

    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({ message: 'Error saving resume' });
  }
});

app.delete('/api/resumes/:id', async (req, res) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ message: 'Error deleting resume' });
  }
});



app.put('/api/resumes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, university, description } = req.body;

    const updatedResume = await Resume.findByIdAndUpdate(
      id,
      { title, university, description },
      { new: true }
    );

    if (!updatedResume) {
      return res.status(404).send('Resume not found');
    }

    res.json(updatedResume);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating resume');
  }
});



app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "img-src 'self' https://avatars.githubusercontent.com blob: data:");
  next();
});





// Skills Schema and Routes
const skillsSchema = new mongoose.Schema({
  titleSkill: String,
  descriptionSkill: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Skills = mongoose.model('Skills', skillsSchema);

// Fetch Skills
app.get('/api/skills', ensureAuthenticated, async (req, res) => {
  try {
    const skills = await Skills.find({ user: req.user._id }); 
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Error fetching skills' });
  }
});

// Add New Skill
app.post('/api/skills', ensureAuthenticated, async (req, res) => {
  try {
    const { titleSkill, descriptionSkill } = req.body;

    const skill = new Skills({
      titleSkill,
      descriptionSkill,
      user: req.user._id, 
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    console.error('Error saving skill:', error);
    res.status(500).json({ message: 'Error saving skill' });
  }
});

// Delete Skill
app.delete('/api/skills/:idSkill', async (req, res) => {
  try {
    await Skills.findByIdAndDelete(req.params.idSkill); 
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ message: 'Error deleting skill' });
  }
});

// Оновлення навички
app.put('/api/skills/:idSkill', async (req, res) => {
  try {
    const { idSkill } = req.params; 
    const { titleSkill, descriptionSkill } = req.body;

    const updatedSkill = await Skills.findByIdAndUpdate(
      idSkill,
      { titleSkill, descriptionSkill },
      { new: true }
    );

    if (!updatedSkill) {
      return res.status(404).send('Skill not found');
    }

    res.json(updatedSkill);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating skill');
  }
});


const multer = require('multer');
const Project = require('./models/Project');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// POST route to save project
app.post('/api/projects', upload.single('image'), async (req, res) => {
  try {
    const { name, link, description, websiteUrl } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Project name is required' });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const newProject = new Project({
      name,
      link: link || '', 
      description: description || '', 
      imageUrl: image,
      websiteUrl: websiteUrl || '', 
      userId: req.user._id,
      userAvatar: req.user.avatarUrl,
    });

    await newProject.save();
    res.status(201).json({ message: 'Project saved successfully' });
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ message: 'Error saving project' });
  }
});

// GET route to fetch GitHub projects
app.get('/api/github/projects', ensureAuthenticated, async (req, res) => {
  try {
    const githubApiUrl = `https://api.github.com/users/${req.user.username}/repos`;
    const response = await axios.get(githubApiUrl, {
      headers: {
        Authorization: `token ${req.user.apiKey}`,
      },
    });

    res.json(response.data.map((repo) => ({ id: repo.id, name: repo.name, url: repo.html_url, description: repo.description, userId: req.user._id, websiteUrl: repo.homepage, userAvatar: req.user.avatarUrl })));
  } catch (error) {
    console.error('Error fetching GitHub projects:', error);
    res.status(500).json({ message: 'Failed to fetch GitHub projects', error: error.message });
  }
});


app.get('/api/bookmarks', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user.bookmarkedProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при отриманні закладок' });
  }
});

app.post('/api/bookmark', ensureAuthenticated, async (req, res) => {
  try {
    const { title, description, imageUrl, link, websiteUrl, userAvatar } = req.body;
    
    const user = await User.findById(req.user.id);
    
    // Перевіряємо, чи вже є цей проєкт у закладках
    if (user.bookmarkedProjects.some(proj => proj.title === title)) {
      return res.status(400).json({ message: 'Проєкт вже в закладках' });
    }

    user.bookmarkedProjects.push({ title, description, imageUrl, link, websiteUrl, userAvatar });
    await user.save();

    res.json({ message: 'Проєкт додано до закладок', bookmarkedProjects: user.bookmarkedProjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при збереженні проєкту' });
  }
});
app.delete('/api/bookmark', ensureAuthenticated, async (req, res) => {
  try {
    const { title } = req.body;
    
    const user = await User.findById(req.user.id);
    
    user.bookmarkedProjects = user.bookmarkedProjects.filter(proj => proj.title !== title);
    await user.save();

    res.json({ message: 'Проєкт видалено з закладок', bookmarkedProjects: user.bookmarkedProjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при видаленні проєкту' });
  }
});





// Для сторінки Project — всі проекти, крім проектів поточного користувача
app.get('/api/projects', async (req, res) => {
  try {
   
    const projects = await Project.find({ userId: { $ne: req.user._id } }); 
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Для проектів конкретного користувача (сторінка Home)
app.get('/api/projects/home', async (req, res) => {
  try {

    const projects = await Project.find({ userId: req.user._id }); 
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});








// DELETE route to delete a project
app.delete('/api/projects/:id', ensureAuthenticated, async (req, res) => {
  try {
    const projectId = req.params.id;
    const deletedProject = await Project.findOneAndDelete({ _id: projectId, userId: req.user._id });

    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
});


app.put('/api/projects/:id', ensureAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, description, link, websiteUrl } = req.body;

    const updateData = {
      name,
      description,
      link,
      websiteUrl,
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, userId: req.user._id },
      updateData,
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
});




const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}



// search users
app.get('/api/users', async (req, res) => {
  const { username } = req.query;
  try {
    const users = await User.find({
      username: { $regex: username, $options: 'i' } 
    }).select('githubId username avatarUrl'); 

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong!');
});

app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
