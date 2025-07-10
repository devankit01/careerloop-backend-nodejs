const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
const passport = require('passport');

// Load environment variables with dotenv-safe
try {
  require('dotenv-safe').config({
    allowEmptyValues: true,
    example: './.env.example'
  });
} catch (error) {
  // In production, we may not have .env file, but env vars should be set in the environment
  console.log('Environment variables are loaded from the environment');
}

// Import database initialization
const initDatabase = require('./config/dbInit');

// Import routes
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const jobRoutes = require('./routes/jobRoutes');
const authRoutes = require('./routes/authRoutes');
const collegeRoutes = require('./routes/collegeRoutes');
const resumeCollectionRoutes = require('./routes/resumeCollectionRoutes');
const importedJobRoutes = require('./routes/importedJobRoutes');
const documentRoutes = require('./routes/documentRoutes');
const preferenceRoutes = require('./routes/preferenceRoutes');
const locationRoutes = require('./routes/locationRoutes');
const jobProfileRoutes = require('./routes/jobProfileRoutes');
const jobDataRoutes = require('./routes/jobDataRoutes');
const noteRoutes = require('./routes/notesRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(helmet()); // Security headers
// Use a function for CORS origin to properly validate the origin
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://careerflow-frontend.vercel.app',
      'https://dev-apis-node.careerloop.in',
      'https://careerloop.in',
      'https://www.careerloop.in',
      'https://dev.careerloop.in',
      'http://localhost:3000',
      'http://localhost:5173',
      'https://careerloop-dev.netlify.app'
    ];
    
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, origin);
    } else {
      console.log('CORS blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
require('./config/passport')(app);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/recruiters', recruiterRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/colleges', collegeRoutes);
app.use('/api/resume-collections', resumeCollectionRoutes);
app.use('/api/imported-jobs', importedJobRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/job-profiles', jobProfileRoutes);
app.use('/api/job-data', jobDataRoutes);
const linkedDocumentsRouter = require('../src/routes/inkedDocuments');
app.use('/linked-documents', linkedDocumentsRouter);

app.use('/api/notes', noteRoutes);
app.use('/api/task', taskRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to CareerFlow API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Set port
const PORT = process.env.PORT || 5000;

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    await initDatabase();
    
    // Run migrations
    const runMigrations = require('./migrations/runner');
    await runMigrations();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app; 