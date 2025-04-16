function checkLoginStatus() {
    const authToken = localStorage.getItem("typingAuthToken");
    if (!authToken) return;
    
    try {
      const [encodedUsername, encodedPassword] = authToken.split(":");
      const storedUsername = decodeURIComponent(encodedUsername);
      const password = decodeURIComponent(encodedPassword);
      
      const user = users.find(u => u.username === storedUsername && u.password === password);
      
      if (user) {
        username = storedUsername;
        showMainScreen();
        updateUserWelcome();
        updateLeaderboard();
        updateUserAverageStats();
        loadUserStreak();
        
        setTimeout(() => {
          updateUserWelcome();
        }, 0);
      }
    } catch (e) {
      console.error("Auth error:", e);
      localStorage.removeItem("typingAuthToken");
    }
  }
  
  function handleRegister() {
    const usernameInput = document.getElementById("register-username").value.trim();
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById("register-confirm").value;
    const errorElement = document.getElementById("register-error");
    
    if (password !== confirmPassword) {
      errorElement.textContent = "Passwords don't match";
      errorElement.classList.remove("hidden");
      return;
    }
    
    if (usernameInput.length < 3 || usernameInput.length > 15) {
      errorElement.textContent = "Username must be 3-15 characters";
      errorElement.classList.remove("hidden");
      return;
    }
    
    if (password.length < 6) {
      errorElement.textContent = "Password must be at least 6 characters";
      errorElement.classList.remove("hidden");
      return;
    }
    
    if (users.some(user => user.username === usernameInput)) {
      errorElement.textContent = "Username already taken";
      errorElement.classList.remove("hidden");
      return;
    }
    
    const newUser = {
      username: usernameInput,
      password,
      streak: 0,
      joined: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem("typingUsers", JSON.stringify(users));
    username = usernameInput;
    localStorage.setItem("typingUsername", username);
    localStorage.setItem("typingAuthToken", encodeURIComponent(username) + ":" + encodeURIComponent(password));
    updateUIAfterLogin();
  }
  
  function handleLogin() {
    const usernameInput = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value;
    const errorElement = document.getElementById("login-error");
    
    const user = users.find(user => user.username === usernameInput);
    
    if (!user || user.password !== password) {
      errorElement.textContent = "Invalid username or password";
      errorElement.classList.remove("hidden");
      return;
    }
    
    username = usernameInput;
    localStorage.setItem("typingUsername", username);
    localStorage.setItem("typingAuthToken", encodeURIComponent(username) + ":" + encodeURIComponent(password));
    updateUIAfterLogin();
  }
  
  function handleLogout() {
    localStorage.removeItem("typingUsername");
    localStorage.removeItem("typingAuthToken");
    document.getElementById("login-screen").classList.remove("hidden");
    document.getElementById("main-screen").classList.add("hidden");
    resetTest();
    username = "";
    saveUserStreak(0);
  
    document.getElementById("login-username").value = "";
    document.getElementById("login-password").value = "";
    document.getElementById("login-error").classList.add("hidden");
  
    document.getElementById("register-username").value = "";
    document.getElementById("register-password").value = "";
    document.getElementById("register-confirm").value = "";
  }
  
  function updateUIAfterLogin() {
    showMainScreen();
    setTimeout(() => {
      updateUserWelcome();
      updateLeaderboard();
      updateUserAverageStats();
      loadUserStreak();
    }, 0);
  }