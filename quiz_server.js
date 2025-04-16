const { body, validationResult } = require('express-validator');
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Add CORS support
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/quizDB")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Quiz schema (for fetching quiz questions)
const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
  category: String,
});
const Quiz = mongoose.model("Quiz", quizSchema);

// Score schema (for leaderboard)
const scoreSchema = new mongoose.Schema({
  username: String,
  score: Number,
  total: Number,
  percentage: Number,
  category: String,
  date: { type: Date, default: Date.now },
});
const Score = mongoose.model("Score", scoreSchema);

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be longer than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters long'],
    maxlength: [1000, 'Message cannot be longer than 1000 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
// Contact form schema (for saving contact form submissions)
const Contact = mongoose.model('Contact', contactSchema);


// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.static("public")); // serves static files from /public
app.use(express.json());

// API Routes

// ✅ GET route to fetch quiz questions by category
app.get('/api/quizzes', async (req, res) => {
  try {
    const { category } = req.query;
    
    if (!category) {
      return res.status(400).json({ error: "Category parameter is required" });
    }

    const questions = await Quiz.find({ category });
    
    if (questions.length === 0) {
      return res.status(404).json({ error: "No questions found for this category" });
    }

    res.json(questions);
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
});

// ✅ POST route to submit score (updated to match frontend)
app.post("/api/scores", async (req, res) => {
  try {
    const { username, score, total, percentage, category } = req.body;

    if (!username || score === undefined || !total || !percentage || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newScore = new Score({ 
      username, 
      score, 
      total,
      percentage,
      category 
    });

    await newScore.save();
    res.status(201).json({ 
      success: true,
      message: "Score submitted successfully",
      data: newScore
    });
  } catch (error) {
    console.error("Error submitting score:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to submit score" 
    });
  }
});

// ✅ GET route to fetch leaderboard (updated)
app.get("/api/leaderboard", async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    
    if (category) {
      query.category = category;
    }

    const results = await Score.find(query)
      .sort({ percentage: -1, date: 1 }) // Sort by percentage then by date
      .limit(10);

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch leaderboard data" 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});


// Then your contact route (make sure this comes after all the middleware setup)
app.post('/api/contact', [
  // Input validation
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 50 }).withMessage('Name cannot be longer than 50 characters'),
  body('email').trim().notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required')
    .isLength({ min: 10 }).withMessage('Message must be at least 10 characters')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    const { name, email, message } = req.body;
    
    const newContact = new Contact({
      name,
      email,
      message
    });

    await newContact.save();
    
    res.status(201).json({
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
      data: {
        id: newContact._id,
        name: newContact.name,
        email: newContact.email,
        createdAt: newContact.createdAt
      }
    });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit your message. Please try again later.'
    });
  }
});