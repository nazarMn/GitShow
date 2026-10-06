import express, { type NextFunction, type Request, type Response } from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as GitHubStrategy, type Profile as GitHubProfile } from 'passport-github2';
import type { VerifyCallback } from 'passport-oauth2';
import session from 'express-session';
import helmet from 'helmet';
import path from 'node:path';
import axios from 'axios';
import fs from 'node:fs';
import cors, { type CorsOptions } from 'cors';
import crypto from 'node:crypto';
import { createServer } from 'node:http';
import multer from 'multer';
import { Server } from 'socket.io';
import type { Types } from 'mongoose';
import 'dotenv/config';
import User from './models/User';
import CV from './models/CV';
import Message from './models/Message';
import Project from './models/Project';
import Resume from './models/Resume';
import Skills from './models/Skill';
import chatRoutes from './routes/chatRoutes';
import type { BookmarkBody, CVExperienceInput, CvCreateBody, CvUpdateBody, ProjectBody, ResumeBody, RouteParams, SkillBody, UserUpdateBody } from './types/api';

interface GitHubProfileWithJson extends GitHubProfile {
  username?: string;
  photos?: Array<{ value: string }>;
  _json?: { location?: string | null; bio?: string | null; company?: string | null };
}

interface BookmarkProject {
  title: string;
  description?: string;
  imageUrl?: string;
  link?: string;
  websiteUrl?: string;
  userAvatar?: string;
}

interface GitHubRepository {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
}

const app = express();
const server = createServer(app);
const serverRoot = path.resolve(__dirname, '..');
const uploadDir = path.join(serverRoot, 'uploads');
const clientDistDir = path.resolve(serverRoot, '..', 'dist');
fs.mkdirSync(uploadDir, { recursive: true });

const io = new Server(server, {
  cors: { origin: '*' },
});



// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://avatars.githubusercontent.com', 'https://github.com'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        connectSrc: ["'self'", 'ws:', 'wss:', 'http:', 'https:'],
      },
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
  })
);
const allowedOrigins = new Set([
  'http://localhost:3000',
  'http://localhost:4173',
  'http://localhost:5173',
  'https://gitshow.onrender.com',
]);

const isPreviewOrigin = (origin: string) => {
  try {
    const hostname = new URL(origin).hostname;
    return hostname.endsWith('.e2b.app') || hostname.endsWith('.arena.ai');
  } catch {
    return false;
  }
};

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin) || isPreviewOrigin(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('CORS policy error: Origin not allowed'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL: '/auth/github/callback',

    },
    async (accessToken: string, _refreshToken: string, profile: GitHubProfileWithJson, done: VerifyCallback) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        // Отримуємо contributions
        const contributions = await fetchGitHubContributions(profile.username ?? profile.id, accessToken);

        if (!user) {
          // Створюємо нового користувача
          user = new User({
            githubId: profile.id,
            username: profile.username ?? profile.id,
            name: profile.displayName || profile.username,
            profileUrl: profile.profileUrl,
            avatarUrl: profile.photos?.[0]?.value,
            apiKey: accessToken,
            location: profile._json?.location || '',
            bio: profile._json?.bio || '',
            company: profile._json?.company || '',
            contributions,
            email: null
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

async function fetchGitHubContributions(username: string, token: string): Promise<Array<{ date: string; count: number }>> {
  try {
    const today = new Date();
    const dates: string[] = [];

    for (let i = 14; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    const requests = dates.map(async (formattedDate) => {
      try {
        const response = await axios.get<{ total_count?: number }>(
          `https://api.github.com/search/commits?q=author:${encodeURIComponent(username)}+committer-date:${formattedDate}`,
          {
            headers: {
              Authorization: `token ${token}`,
              Accept: 'application/vnd.github.cloak-preview',
            },
            timeout: 5000,
          }
        );
        return { date: formattedDate, count: response.data?.total_count || 0 };
      } catch {
        return { date: formattedDate, count: 0 };
      }
    });

    return await Promise.all(requests);
  } catch (error) {
    console.error('Помилка при отриманні contributions:', error instanceof Error ? error.message : error);
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
app.use('/uploads', express.static(uploadDir));


// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// Authentication Middleware
const ensureAuthenticated: express.RequestHandler = (req, res, next) => {
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

app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

app.get('/api/user', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await User.findById(req.user!._id)
      .populate('followers', 'username avatarUrl _id') // витягуємо тільки name, avatarUrl і _id
      .populate('following', 'username avatarUrl _id');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      _id: user._id,
      username: user.username,
      name: user.name,
      avatarUrl: user.avatarUrl,
      location: user.location,
      bio: user.bio,
      company: user.company,
      contributions: user.contributions,
      YearsOfExperience: user.YearsOfExperience,
      instagram: user.instagram,
      facebook: user.facebook,
      twitter: user.twitter,
      profileUrl: user.profileUrl,
      email: user.email,
      followers: user.followers,
      following: user.following
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



app.put<RouteParams, unknown, UserUpdateBody>('/api/user', ensureAuthenticated, async (req, res) => {
  try {
    const { name, bio, company, location, email, instagram, twitter, facebook, YearsOfExperience } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user!.id,
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
    ).select('-apiKey');

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
});



// CV Creation

app.get('/api/cv/check', ensureAuthenticated, async (req, res) => {
  try {
      const existingCV = await CV.findOne({ userId: req.user!.id });
      res.json({ hasCV: !!existingCV });
  } catch (error) {
      console.error('Error checking CV:', error);
      res.status(500).json({ message: 'Failed to check CV' });
  }
});

// Створення CV
app.post<RouteParams, unknown, CvCreateBody>('/api/cv', ensureAuthenticated, async (req, res) => {
  try {
    const existingCV = await CV.findOne({ userId: req.user!.id });
    if (existingCV) {
      return res.status(400).json({ message: 'You already have a saved CV.' });
    }

    const { templateId, name, avatarUrl, email, location } = req.body;
    if (!name || !avatarUrl) {
      return res.status(400).json({ message: 'Name and avatar are required.' });
    }

    // Генеруємо унікальне посилання для CV
    const shareableLink = crypto.randomBytes(16).toString('hex');

    const newCV = new CV({
      userId: req.user!.id,
      templateId,
      name,
      avatarUrl,
      email,
      location,
      shareableLink
    });

    await newCV.save();
    res.status(201).json({
      message: 'CV saved successfully!',
      cv: newCV,
      shareableLink: newCV.shareableLink
    });
  } catch (error) {
    console.error('Error saving CV:', error);
    res.status(500).json({ message: 'Failed to save CV' });
  }
});

// Отримання CV користувача
app.get('/api/cv', ensureAuthenticated, async (req, res) => {
  try {
    const cv = await CV.findOne({ userId: req.user!.id });

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
app.put<RouteParams, unknown, CvUpdateBody>('/api/cv', ensureAuthenticated, async (req, res) => {
  try {
    const existingCV = await CV.findOne({ userId: req.user!.id });

    if (!existingCV) {
      return res.status(404).json({ message: 'CV not found' });
    }

    const experience: CVExperienceInput[] = Array.isArray(req.body.experience) ?
      (req.body.experience as CVExperienceInput[]).map((exp) => {

        if (exp.descriptions && Array.isArray(exp.descriptions)) {

          return {
            ...exp,
            description: exp.descriptions[0] || '',
            descriptions: exp.descriptions
          };
        }

        else if (exp.description && !exp.descriptions) {
          return {
            ...exp,
            descriptions: [exp.description]
          };
        }

        return exp;
      }) :
      existingCV.experience || [];

    const updatedCV = await CV.findOneAndUpdate(
      { userId: req.user!.id },
      {
        name: req.body.name !== undefined ? req.body.name : existingCV.name,
        specialty: req.body.specialty !== undefined ? req.body.specialty : existingCV.specialty,
        summary: req.body.summary !== undefined ? req.body.summary : existingCV.summary,
        phoneNumber: req.body.phoneNumber !== undefined ? req.body.phoneNumber : existingCV.phoneNumber,
        location: req.body.location !== undefined ? req.body.location : existingCV.location,
        email: req.body.email !== undefined ? req.body.email : existingCV.email,
        references: req.body.references !== undefined ? req.body.references : (existingCV.references || []),
        education: req.body.education !== undefined ? req.body.education : (existingCV.education || {}),
        skills: req.body.skills !== undefined ? req.body.skills : (existingCV.skills || []),
        experience: experience
      },
      { new: true }
    );

    res.status(200).json(updatedCV);
  } catch (error) {
    console.error('Error updating CV:', error);
    res.status(500).json({ message: 'Failed to update CV' });
  }
});
// Видалення досвіду з CV
app.delete('/api/cv/experience/:expId', ensureAuthenticated, async (req, res) => {
  try {
    const cv = await CV.findOne({ userId: req.user!.id });

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    // Фільтруємо досвід, щоб видалити той, ID якого передано в запиті
    cv.experience = cv.experience.filter((exp: { _id: Types.ObjectId }) => exp._id.toString() !== req.params.expId);

    await cv.save(); // Зберігаємо оновлене CV
    res.status(200).json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ message: 'Failed to delete experience' });
  }
});



app.delete('/api/cv/delete', ensureAuthenticated, async (req, res) => {
  try {
    const deletedCV = await CV.findOneAndDelete({ userId: req.user!.id });

    if (!deletedCV) {
      return res.status(404).json({ message: 'CV not found' });
    }

    res.status(200).json({ message: 'CV deleted successfully!' });
  } catch (error) {
    console.error('Error deleting CV:', error);
    res.status(500).json({ message: 'Failed to delete CV' });
  }
});


// Отримання CV за публічним посиланням (без автентифікації)
app.get('/api/cv/share/:link', async (req, res) => {
  try {
    // console.log("Received request for shared CV with link:", req.params.link);
    const cv = await CV.findOne({ shareableLink: req.params.link });

    if (!cv) {
      // console.log("No CV found with shareableLink:", req.params.link);
      return res.status(404).json({ message: 'CV not found' });
    }

    // console.log("Found CV:", cv._id);

    const publicCV = {
      name: cv.name,
      avatarUrl: cv.avatarUrl,
      specialty: cv.specialty,
      summary: cv.summary,
      phoneNumber: cv.phoneNumber,
      location: cv.location,
      email: cv.email,
      references: cv.references,
      skills: cv.skills,
      education: cv.education,
      experience: cv.experience,
      templateId: cv.templateId
    };

    res.status(200).json(publicCV);
  } catch (error) {
    console.error('Error fetching shared CV:', error);
    res.status(500).json({ message: 'Failed to fetch CV' });
  }
});

// Додамо також маршрут для отримання посилання для поточного користувача
app.get('/api/cv/sharelink', ensureAuthenticated, async (req, res) => {
  try {
    const cv = await CV.findOne({ userId: req.user!.id });

    if (!cv) {
      return res.status(404).json({ message: 'CV not found' });
    }

    res.status(200).json({ shareableLink: cv.shareableLink });
  } catch (error) {
    console.error('Error fetching CV share link:', error);
    res.status(500).json({ message: 'Failed to fetch share link' });
  }
});



// Resume routes
app.get('/api/resumes', ensureAuthenticated, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user!._id });
    res.json(resumes);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ message: 'Error fetching resumes' });
  }
});


app.post<RouteParams, unknown, ResumeBody>('/api/resumes', ensureAuthenticated, async (req, res) => {
  try {
    const { title, university, description } = req.body;

    const resume = new Resume({
      title,
      university,
      description,
      user: req.user!._id,
    });

    await resume.save();
    res.status(201).json(resume);
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({ message: 'Error saving resume' });
  }
});

app.delete('/api/resumes/:id', ensureAuthenticated, async (req, res) => {
  try {
    const deletedResume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user!._id });
    if (!deletedResume) return res.status(404).json({ message: 'Resume not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ message: 'Error deleting resume' });
  }
});



app.put<RouteParams, unknown, ResumeBody>('/api/resumes/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, university, description } = req.body;

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: id, user: req.user!._id },
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





// Skills routes
// Fetch Skills
app.get('/api/skills', ensureAuthenticated, async (req, res) => {
  try {
    const skills = await Skills.find({ user: req.user!._id });
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Error fetching skills' });
  }
});

// Add New Skill
app.post<RouteParams, unknown, SkillBody>('/api/skills', ensureAuthenticated, async (req, res) => {
  try {
    const { titleSkill, descriptionSkill } = req.body;

    const skill = new Skills({
      titleSkill,
      descriptionSkill,
      user: req.user!._id,
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (error) {
    console.error('Error saving skill:', error);
    res.status(500).json({ message: 'Error saving skill' });
  }
});

// Delete Skill
app.delete('/api/skills/:idSkill', ensureAuthenticated, async (req, res) => {
  try {
    const deletedSkill = await Skills.findOneAndDelete({ _id: req.params.idSkill, user: req.user!._id });
    if (!deletedSkill) return res.status(404).json({ message: 'Skill not found' });
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ message: 'Error deleting skill' });
  }
});

// Оновлення навички
app.put<RouteParams, unknown, SkillBody>('/api/skills/:idSkill', ensureAuthenticated, async (req, res) => {
  try {
    const { idSkill } = req.params;
    const { titleSkill, descriptionSkill } = req.body;

    const updatedSkill = await Skills.findOneAndUpdate(
      { _id: idSkill, user: req.user!._id },
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



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// POST route to save project
app.post<RouteParams, unknown, ProjectBody>('/api/projects', ensureAuthenticated, upload.single('image'), async (req, res) => {
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
      userId: req.user!._id,
      userAvatar: req.user!.avatarUrl,
    });

    await newProject.save();
    res.status(201).json({ message: 'Project saved successfully' });
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ message: 'Error saving project' });
  }
});


app.post('/api/upload-avatar', ensureAuthenticated, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user!.id,
      { avatarUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ avatarUrl: user.avatarUrl });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading avatar' });
  }
});



// GET route to fetch GitHub projects
app.get('/api/github/projects', ensureAuthenticated, async (req, res) => {
  try {
    const githubApiUrl = `https://api.github.com/users/${req.user!.username}/repos`;
    const response = await axios.get<GitHubRepository[]>(githubApiUrl, {
      headers: {
        Authorization: `token ${req.user!.apiKey}`,
      },
    });

    res.json(response.data.map((repo) => ({ id: repo.id, name: repo.name, url: repo.html_url, description: repo.description, userId: req.user!._id, websiteUrl: repo.homepage, userAvatar: req.user!.avatarUrl })));
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching GitHub projects:', message);
    res.status(500).json({ message: 'Failed to fetch GitHub projects', error: message });
  }
});


app.get('/api/bookmarks', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user!.id);
    res.json(user.bookmarkedProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при отриманні закладок' });
  }
});

app.post<RouteParams, unknown, BookmarkBody>('/api/bookmark', ensureAuthenticated, async (req, res) => {
  try {
    const { title, description, imageUrl, link, websiteUrl, userAvatar } = req.body;

    const user = await User.findById(req.user!.id);

    // Перевіряємо, чи вже є цей проєкт у закладках
    if (user.bookmarkedProjects.some((proj: BookmarkProject) => proj.title === title)) {
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
app.delete<RouteParams, unknown, Pick<BookmarkBody, 'title'>>('/api/bookmark', ensureAuthenticated, async (req, res) => {
  try {
    const { title } = req.body;

    const user = await User.findById(req.user!.id);

    user.bookmarkedProjects = user.bookmarkedProjects.filter((proj: BookmarkProject) => proj.title !== title);
    await user.save();

    res.json({ message: 'Проєкт видалено з закладок', bookmarkedProjects: user.bookmarkedProjects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Помилка при видаленні проєкту' });
  }
});





// Для сторінки Project — всі проекти, крім проектів поточного користувача
app.get('/api/projects', ensureAuthenticated, async (req, res) => {
  try {

    const projects = await Project.find({ userId: { $ne: req.user!._id } });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Для проектів конкретного користувача (сторінка Home)
app.get('/api/projects/home', ensureAuthenticated, async (req, res) => {
  try {

    const projects = await Project.find({ userId: req.user!._id });
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
    const deletedProject = await Project.findOneAndDelete({ _id: projectId, userId: req.user!._id });

    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found or unauthorized' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
});


app.put<RouteParams, unknown, ProjectBody>('/api/projects/:id', ensureAuthenticated, upload.single('image'), async (req, res) => {
  try {
    const projectId = req.params.id;
    const { name, description, link, websiteUrl } = req.body;

    const updateData: ProjectBody & { imageUrl?: string } = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (link !== undefined) updateData.link = link;
    if (websiteUrl !== undefined) updateData.websiteUrl = websiteUrl;

    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedProject = await Project.findOneAndUpdate(
      { _id: projectId, userId: req.user!._id },
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





// search users
app.get('/api/users', ensureAuthenticated, async (req, res) => {
  const usernameQuery = req.query.username;
  const username = typeof usernameQuery === 'string' ? usernameQuery : '';
  const currentUserId = req.user!.id;

  try {
    const users = await User.find({
      username: { $regex: username, $options: 'i' },
      _id: { $ne: currentUserId }, // Виключаємо поточного користувача
    }).select('_id username avatarUrl');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

app.get('/api/current-user', ensureAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user!.id).select('_id'); // Отримуємо поточного користувача
    res.json({ id: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching current user' });
  }
});


app.get('/api/user/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('followers', 'username avatarUrl _id')
      .populate('following', 'username avatarUrl _id');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});


app.get('/api/user/:userId/projects', async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.userId });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user projects' });
  }
});

app.get('/api/user/:userId/skills', async (req, res) => {
  try {
    const skills = await Skills.find({ user: req.params.userId });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user skills' });
  }
});

app.get('/api/user/:userId/resume', async (req, res) => {
  try {
    const resume = await Resume.find({ user: req.params.userId });
    res.json(resume);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user resume' });
  }
});


app.post('/api/follow/:userId', ensureAuthenticated, async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user!._id;

  try {
    const userToFollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Перевірка, чи вже підписано
    if (currentUser.following.includes(userId)) {
      return res.status(400).json({ message: 'Already following' });
    }

    // Додавання підписки та підписника
    currentUser.following.push(userId);
    userToFollow.followers.push(currentUserId);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({
      message: 'Successfully followed',
      follower: {
        username: currentUser.username,
        avatarUrl: currentUser.avatarUrl,
        userId: currentUser._id
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error following user' });
  }
});

app.post('/api/unfollow/:userId', ensureAuthenticated, async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req.user!._id;

  try {
    const userToUnfollow = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Перетворюємо на строки для точного порівняння
    currentUser.following = currentUser.following.filter(
      (id: Types.ObjectId | string) => id.toString() !== userId
    );

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id: Types.ObjectId | string) => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({ message: 'Successfully unfollowed' });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ message: 'Error unfollowing user' });
  }
});

// app.js

app.use('/api/messages', chatRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (chatId) => {
    socket.join(chatId);
  });

  socket.on("leaveRoom", (chatId) => {
    socket.leave(chatId);
  });

  socket.on("sendMessage", async (payload) => {
    try {
      if (!payload || typeof payload !== 'object') return;
      const { chatId, text, senderId } = payload as { chatId?: unknown; text?: unknown; senderId?: unknown };
      if (typeof chatId !== 'string' || !chatId.trim()) return;
      if (typeof text !== 'string' || !text.trim()) return;
      if (!senderId) return;

      const newMessage = new Message({
        chatId: chatId.trim(),
        sender: senderId,
        text: text.trim(),
        createdAt: Date.now(),
      });

      await newMessage.save();

      const populatedMessage = await Message.findById(newMessage._id)
        .populate("sender", "username avatarUrl");

      io.to(chatId.trim()).emit("receiveMessage", populatedMessage);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});







// Error handling middleware
app.use((_err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(_err);
  res.status(500).send('Something went wrong!');
});

app.use(express.static(clientDistDir, {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.get('*', (req, res) => {
  res.sendFile(path.join(clientDistDir, 'index.html'));
});

const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, io, server };
