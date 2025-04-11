// References to elements
const referenceTextEl = document.getElementById("referenceText");
const typingArea = document.getElementById("typingArea");
const timerEl = document.getElementById("timer");
const metricsEl = document.getElementById("metrics");
const customTextInput = document.getElementById("customText");
const useCustomBtn = document.getElementById("useCustomBtn");

const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const errorsEl = document.getElementById("errors");
const errorRateEl = document.getElementById("errorRate");
const totalCharsEl = document.getElementById("totalChars");
const charBreakdownEl = document.getElementById("charBreakdown");
const totalTimeEl = document.getElementById("totalTime");

// Variables
let referenceText = "";
let startTime, interval;
let typedCorrect = 0, typedIncorrect = 0;
let isFinished = false;

// Sample texts
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing speed is a skill you can improve with practice.",
  "A journey of a thousand miles begins with a single step.",
];

// Set text to reference
function setReferenceText(text) {
  referenceText = text;
  referenceTextEl.innerHTML = referenceText
    .split("")
    .map((ch) => `<span class="untyped">${ch}</span>`)
    .join("");
}

// Start test
function startTest() {
  const customText = customTextInput.value.trim();
  if (customText) {
    setReferenceText(customText);
  } else {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setReferenceText(randomText);
  }

  typingArea.value = "";
  typingArea.disabled = false;
  metricsEl.style.display = "none";
  timerEl.textContent = "⏱ 0.00s";
  clearInterval(interval);
  startTime = null;
  typedCorrect = 0;
  typedIncorrect = 0;
  isFinished = false;
  typingArea.focus();
}

// Listen to typing input
typingArea.addEventListener("input", () => {
  if (!startTime && !isFinished) {
    startTime = new Date();
    interval = setInterval(updateTimer, 100);
  }

  const typed = typingArea.value;
  const spans = referenceTextEl.querySelectorAll("span");

  typedCorrect = 0;
  typedIncorrect = 0;

  spans.forEach((span, i) => {
    if (i < typed.length) {
      if (typed[i] === referenceText[i]) {
        span.className = "correct";
        typedCorrect++;
      } else {
        span.className = "incorrect";
        typedIncorrect++;
      }
    } else {
      span.className = "untyped";
    }
  });
});

// Finish test when Enter key is pressed
typingArea.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !isFinished) {
    e.preventDefault();
    finishTest();
  }
});

// Button to use custom text
useCustomBtn.addEventListener("click", () => {
  startTest();
});

// Timer function
function updateTimer() {
  if (!startTime) return;
  const now = new Date();
  const elapsed = (now - startTime) / 1000;
  timerEl.textContent = `⏱ ${elapsed.toFixed(2)}s`;
}

// Finish test and calculate metrics
function finishTest() {
  clearInterval(interval);
  isFinished = true;
  typingArea.disabled = true;

  const totalTimeSec = (new Date() - startTime) / 1000;
  const totalTyped = typingArea.value.length;
  const errorCount = typedIncorrect;
  const correct = typedCorrect;

  const wordsTyped = typingArea.value.trim().split(/\s+/).length;
  const wpm = (wordsTyped / (totalTimeSec / 60)).toFixed(2);
  const accuracy = ((correct / totalTyped) * 100).toFixed(2);
  const errorRate = ((errorCount / totalTyped) * 100).toFixed(2);

  wpmEl.textContent = wpm;
  accuracyEl.textContent = isNaN(accuracy) ? "0%" : `${accuracy}%`;
  errorsEl.textContent = errorCount;
  errorRateEl.textContent = isNaN(errorRate) ? "0%" : `${errorRate}%`;
  totalCharsEl.textContent = totalTyped;
  charBreakdownEl.textContent = `✔️ ${correct} / ❌ ${errorCount}`;
  totalTimeEl.textContent = `${totalTimeSec.toFixed(2)}s`;

  metricsEl.style.display = "block";
}

// Initialize test on page load
startTest();
