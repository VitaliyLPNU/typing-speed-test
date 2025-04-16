function showMainScreen() {
    document.getElementById("login-screen").classList.add("hidden");
    document.getElementById("main-screen").classList.remove("hidden");
    
    if (username) {
      const welcomeElement = document.getElementById("user-welcome");
      if (welcomeElement) {
        welcomeElement.textContent = username;
      }
    }
  }
  
  function updateUserWelcome() {
    const welcomeElement = document.getElementById("user-welcome");
    if (welcomeElement && username) {
      welcomeElement.textContent = username;
    }
  }
  
  function showRegisterForm(e) {
    e.preventDefault();
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("register-form").classList.remove("hidden");
  }
  
  function showLoginForm(e) {
    e.preventDefault();
    document.getElementById("register-form").classList.add("hidden");
    document.getElementById("login-form").classList.remove("hidden");
  }
  
  function initializeParticles() {
    const particlesContainer = document.querySelector('.particles');
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
      particle.style.animationDelay = `${Math.random() * 2}s`;
      particlesContainer.appendChild(particle);
    }
  }
  
  function createResetButton() {
    const userStats = document.getElementById("user-stats");
    
    if (!document.getElementById("reset-user-stats")) {
      const resetButton = document.createElement("button");
      resetButton.id = "reset-user-stats";
      resetButton.className = "reset-stats-btn";
      resetButton.textContent = "Reset My Results";
      
      resetButton.addEventListener("click", resetUserStats);
      userStats.appendChild(resetButton);
    }
  }
  
  let modalResolve;
  
  function resetUserStats() {
    showModal(
      "Reset Results", 
      "Are you sure you want to reset all your typing test results? This cannot be undone.",
      true
    ).then(confirmed => {
      if (confirmed) {
        let results = JSON.parse(localStorage.getItem("typingResults")) || [];
        results = results.filter(result => result.username !== username);
        localStorage.setItem("typingResults", JSON.stringify(results));
        currentStreak = 0;
        saveUserStreak(0);
        updateLeaderboard();
        updateUserAverageStats();
        
        showModal(
          "Success!", 
          "Your results have been reset successfully!",
          false
        );
      }
    });
  }
  
  function showModal(title, message, showCancel = true) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal-cancel').style.display = showCancel ? 'block' : 'none';
    document.getElementById('custom-modal').classList.remove('hidden');
    
    return new Promise(resolve => {
      modalResolve = resolve;
    });
  }