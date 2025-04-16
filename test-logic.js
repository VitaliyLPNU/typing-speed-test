function startTest() {
    resetTest();
    
    document.getElementById("start-test").classList.add("hidden");
    document.getElementById("test-area").classList.remove("hidden");
    document.getElementById("results").classList.add("hidden");
    
    const availableTexts = texts[currentDifficulty];
    currentTextIndex = Math.floor(Math.random() * availableTexts.length);
    const textToType = availableTexts[currentTextIndex];
    
    const textDisplay = document.getElementById("text-display");
    textDisplay.innerHTML = "";
    
    createLiveStats();
    
    textToType.split("").forEach(char => {
      const charSpan = document.createElement("span");
      charSpan.textContent = char;
      textDisplay.appendChild(charSpan);
    });
    
    textDisplay.children[0].classList.add("current-char");
    
    textDisplay.addEventListener('click', () => {
      if (isTestActive) {
        textInput.focus();
      }
    });
  
    const textInput = document.getElementById("text-input");
    textInput.value = "";
    textInput.disabled = false;
    textInput.focus();
    
    charIndex = 0;
    errors = 0;
    liveMistakes = 0;
    mistakeTracker.clear();
    isTestActive = true;
    
    textInput.addEventListener("input", handleInput);
    startTime = null;
  }
  
  function handleInput(e) {
    const textInput = e.target;
    const typedChar = textInput.value;
    const textDisplay = document.getElementById("text-display");
    const chars = textDisplay.children;
    
    if (!startTime && typedChar.length === 1) {
      startTime = new Date();
      startTimer();
      intervalId = setInterval(updateLiveStats, 1000);
    }
    
    const currentChar = chars[charIndex];
    
    if (currentChar) {
      const expectedChar = currentChar.textContent;
      
      if (typedChar !== expectedChar) {
        textInput.value = '';
        
        if (!mistakeTracker.has(charIndex)) {
          mistakeTracker.add(charIndex);
          liveMistakes++;
          document.getElementById("live-errors").textContent = liveMistakes;
        }
        
        currentChar.classList.add("incorrect-char");
        updateLiveAccuracy();
        return;
      }
      
      currentChar.classList.remove("current-char");
      currentChar.classList.remove("incorrect-char");
      currentChar.classList.add("correct-char");
      charIndex++;
      textInput.value = '';
      
      if (charIndex < chars.length) {
        chars[charIndex].classList.add("current-char");
        updateLiveStats();
      } else {
        finishTest();
      }
    }
  }
  
  function finishTest() {
    isTestActive = false;
    endTime = new Date();
    clearInterval(timer);
    clearInterval(intervalId);
    
    const textInput = document.getElementById("text-input");
    textInput.disabled = true;
    textInput.removeEventListener("input", handleInput);
    
    const textDisplay = document.getElementById("text-display");
    const text = Array.from(textDisplay.children).map(span => span.textContent).join("");
    const timeInMinutes = (endTime - startTime) / 60000;
    const wordsTyped = text.trim().split(/\s+/).length;
    const wpm = Math.round(wordsTyped / timeInMinutes);
    const accuracy = charIndex > 0 ? Math.round(((charIndex - liveMistakes) / charIndex) * 100) : 100;
    const timeInSeconds = Math.round((endTime - startTime) / 1000);
    
    document.getElementById("wpm-result").textContent = wpm;
    document.getElementById("accuracy-result").textContent = `${accuracy}%`;
    document.getElementById("errors-result").textContent = liveMistakes;
    document.getElementById("time-result").textContent = `${timeInSeconds}s`;
    document.getElementById("difficulty-result").textContent = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
    
    document.getElementById("test-area").classList.add("hidden");
    document.getElementById("results").classList.remove("hidden");
    
    if (wpm >= 30) {
      currentStreak++;
      saveUserStreak(currentStreak);
    } else {
      currentStreak = 0;
      saveUserStreak(0);
    }
    updateStreakDisplay();
    
    saveResult(wpm, accuracy, timeInSeconds, currentDifficulty);
    updateLeaderboard();
    updateUserAverageStats();
  }
  
  function resetTest() {
    if (timer) clearInterval(timer);
    if (intervalId) clearInterval(intervalId);
    
    startTime = 0;
    endTime = 0;
    errors = 0;
    liveMistakes = 0;
    charIndex = 0;
    isTestActive = false;
    mistakeTracker.clear();
    
    document.getElementById("timer").textContent = "Time: 0s";
    document.getElementById("start-test").classList.remove("hidden");
    document.getElementById("test-area").classList.add("hidden");
    document.getElementById("results").classList.add("hidden");
    
    const liveStats = document.getElementById("live-stats");
    if (liveStats) liveStats.remove();
    
    const textInput = document.getElementById("text-input");
    if (textInput) textInput.removeEventListener("input", handleInput);
  }
  
  function startTimer() {
    let seconds = 0;
    timer = setInterval(() => {
      seconds++;
      document.getElementById("timer").textContent = `Time: ${seconds}s`;
    }, 1000);
  }
  
  function createLiveStats() {
    let liveStats = document.getElementById("live-stats");
    if (!liveStats) {
      liveStats = document.createElement("div");
      liveStats.id = "live-stats";
      liveStats.className = "live-stats";
      
      const wpmStat = document.createElement("div");
      wpmStat.className = "live-stat-item";
      wpmStat.innerHTML = `
        <span id="live-wpm" class="live-stat-value">0</span>
        <span class="live-stat-label">WPM</span>
      `;
      
      const errorsStat = document.createElement("div");
      errorsStat.className = "live-stat-item";
      errorsStat.innerHTML = `
        <span id="live-errors" class="live-stat-value">0</span>
        <span class="live-stat-label">Mistakes</span>
      `;
      
      const accuracyStat = document.createElement("div");
      accuracyStat.className = "live-stat-item";
      accuracyStat.innerHTML = `
        <span id="live-accuracy" class="live-stat-value">100%</span>
        <span class="live-stat-label">Accuracy</span>
      `;
      
      liveStats.appendChild(wpmStat);
      liveStats.appendChild(errorsStat);
      liveStats.appendChild(accuracyStat);
      
      const timerElement = document.getElementById("timer");
      timerElement.parentNode.insertBefore(liveStats, timerElement.nextSibling);
    }
  }
  
  function updateLiveStats() {
    if (startTime && isTestActive) {
      const currentTime = new Date();
      const timeElapsed = (currentTime - startTime) / 60000;
      const wordsTyped = charIndex / 5;
      liveWpm = Math.round(wordsTyped / timeElapsed);
      document.getElementById("live-wpm").textContent = liveWpm;
      updateLiveAccuracy();
    }
  }
  
  function updateLiveAccuracy() {
    const accuracy = charIndex > 0 ? Math.round(((charIndex - liveMistakes) / charIndex) * 100) : 100;
    document.getElementById("live-accuracy").textContent = `${accuracy}%`;
  }
  
  function processTextForDifficulty(text, difficulty) {
    if (difficulty === "easy") {
      return text.replace(/[^\w\s]|[\d]/g, "").replace(/\s+/g, " ").trim();
    } else if (difficulty === "medium") {
      return text.replace(/[^\w\s.,]|[\d]/g, "").trim();
    }
    return text;
  }