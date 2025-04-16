// Global variables
let username = "";
let timer = null;
let startTime = 0;
let endTime = 0;
let currentTextIndex = 0;
let errors = 0;
let isTestActive = false;
let texts = {
  easy: [],
  medium: [],
  hard: []
};
let charIndex = 0;
let currentStreak = 0;
let liveWpm = 0;
let liveMistakes = 0;
let intervalId = null;
let currentDifficulty = "medium"; // Default difficulty
let mistakeTracker = new Set(); // Track which characters had errors
let users = JSON.parse(localStorage.getItem("typingUsers")) || [];