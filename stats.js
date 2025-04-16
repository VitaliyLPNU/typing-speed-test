function saveResult(wpm, accuracy, time, difficulty) {
    let results = JSON.parse(localStorage.getItem("typingResults")) || [];
    
    const newResult = {
      username: username,
      wpm: wpm,
      accuracy: accuracy,
      time: time,
      difficulty: difficulty,
      date: new Date().toISOString()
    };
    
    results.push(newResult);
    localStorage.setItem("typingResults", JSON.stringify(results));
  }
  
  function updateLeaderboard() {
    const results = JSON.parse(localStorage.getItem("typingResults")) || [];
    const sortedResults = [...results].sort((a, b) => b.wpm - a.wpm);
    const top10 = sortedResults.slice(0, 10);
    
    const leaderboardBody = document.getElementById("leaderboard-body");
    leaderboardBody.innerHTML = "";
    
    top10.forEach((result, index) => {
      const row = document.createElement("tr");
      
      const rankCell = document.createElement("td");
      rankCell.textContent = index + 1;
      
      const usernameCell = document.createElement("td");
      usernameCell.textContent = result.username || "Anonymous";
      
      const wpmCell = document.createElement("td");
      wpmCell.textContent = result.wpm;
      
      const accuracyCell = document.createElement("td");
      accuracyCell.textContent = `${result.accuracy}%`;
      
      const difficultyCell = document.createElement("td");
      difficultyCell.textContent = result.difficulty 
        ? (result.difficulty.charAt(0).toUpperCase() + result.difficulty.slice(1))
        : "Hard";
      
      row.appendChild(rankCell);
      row.appendChild(usernameCell);
      row.appendChild(wpmCell);
      row.appendChild(accuracyCell);
      row.appendChild(difficultyCell);
      
      if (result.username === username) {
        row.classList.add("current-user");
      }
      
      leaderboardBody.appendChild(row);
    });
  }
  
  function updateUserAverageStats() {
    const results = JSON.parse(localStorage.getItem("typingResults")) || [];
    const userResults = results.filter(result => result.username === username);
    
    if (userResults.length > 0) {
      const totalWpm = userResults.reduce((sum, result) => sum + result.wpm, 0);
      const totalAccuracy = userResults.reduce((sum, result) => sum + result.accuracy, 0);
      
      const avgWpm = Math.round(totalWpm / userResults.length);
      const avgAccuracy = Math.round(totalAccuracy / userResults.length);
      
      document.getElementById("avg-wpm").textContent = avgWpm;
      document.getElementById("avg-accuracy").textContent = `${avgAccuracy}%`;
      document.getElementById("total-tests").textContent = userResults.length;
      
      document.getElementById("user-stats").classList.remove("hidden");
    } else {
      document.getElementById("user-stats").classList.add("hidden");
    }
  }
  
  function loadUserStreak() {
    currentStreak = parseInt(localStorage.getItem(`${username}_streak`) || "0");
    updateStreakDisplay();
  }
  
  function saveUserStreak(streak) {
    localStorage.setItem(`${username}_streak`, streak.toString());
    updateStreakDisplay();
  }
  
  function updateStreakDisplay() {
    document.getElementById("streak-count").textContent = currentStreak;
  }