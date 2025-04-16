const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/quizDB");

// Define schema
const quizSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: String,
  category: String,
});

const Quiz = mongoose.model("Quiz", quizSchema);

// All quiz questions: HTML, CSS, JavaScript
const questions = [
  // CSS Questions
  {
    question: "What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Colorful Style Sheets",
      "Computer Style Sheets",
      "Creative Style Sheets",
    ],
    answer: "Cascading Style Sheets",
    category: "CSS",
  },
  {
    question: "Which HTML tag is used to define an internal style sheet?",
    options: ["<style>", "<css>", "<script>", "<link>"],
    answer: "<style>",
    category: "CSS",
  },
  {
    question: "Which property is used to change the background color?",
    options: ["color", "bgcolor", "background-color", "background"],
    answer: "background-color",
    category: "CSS",
  },
  {
    question: "How do you make text bold in CSS?",
    options: [
      "font-style: bold;",
      "font-weight: bold;",
      "text-decoration: bold;",
      "style: bold;",
    ],
    answer: "font-weight: bold;",
    category: "CSS",
  },
  {
    question: "Which CSS property controls the text size?",
    options: ["font-style", "text-size", "font-size", "text-style"],
    answer: "font-size",
    category: "CSS",
  },

  // HTML Questions
  {
    question: "What does HTML stand for?",
    options: [
      "Hyper Text Markup Language",
      "Hyperlinks and Text Markup Language",
      "Home Tool Markup Language",
      "Hyper Tool Markup Language",
    ],
    answer: "Hyper Text Markup Language",
    category: "HTML",
  },
  {
    question: "Which tag is used to insert an image in HTML?",
    options: ["<image>", "<img>", "<pic>", "<src>"],
    answer: "<img>",
    category: "HTML",
  },
  {
    question: "What is the correct HTML element for inserting a line break?",
    options: ["<lb>", "<br>", "<break>", "<line>"],
    answer: "<br>",
    category: "HTML",
  },

  // JavaScript Questions
  {
    question: "Inside which HTML element do we put the JavaScript?",
    options: ["<javascript>", "<script>", "<js>", "<code>"],
    answer: "<script>",
    category: "JavaScript",
  },
  {
    question: "How do you create a function in JavaScript?",
    options: [
      "function = myFunction()",
      "function:myFunction()",
      "function myFunction()",
      "create.myFunction()",
    ],
    answer: "function myFunction()",
    category: "JavaScript",
  },
  {
    question: "Which operator is used to assign a value to a variable?",
    options: ["-", "=", "*", "+"],
    answer: "=",
    category: "JavaScript",
  },
];

// Seed the database
async function seedDB() {
  try {
    await Quiz.deleteMany({});
    await Quiz.insertMany(questions);
    console.log("✅ All quiz questions inserted successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error inserting questions:", err);
  }
}

seedDB();
// Close the connection when done
// mongoose.connection.close();