document.addEventListener("DOMContentLoaded", () => {
    fetch("texts.json")
      .then(response => response.json())
      .then(data => {
        texts = {
          easy: data.texts[0].easy || [],
          medium: data.texts[0].medium || [],
          hard: data.texts[0].hard || []
        };
      })
      .catch(error => {
        console.error("Error loading texts:", error);
        const defaultText = "The quick brown fox jumps over the lazy dog. Programming is fun and challenging.";
        texts = {
          easy: ["simple words typing practice"],
          medium: ["The quick brown fox jumps over the lazy dog"],
          hard: [defaultText]
        };
      });
      
    init();
    initializeParticles();
  });
  
  function init() {
    checkLoginStatus();
    
    document.getElementById("show-register")?.addEventListener("click", showRegisterForm);
    document.getElementById("show-login")?.addEventListener("click", showLoginForm);
    document.getElementById("login-btn")?.addEventListener("click", handleLogin);
    document.getElementById("register-btn")?.addEventListener("click", handleRegister);
    document.getElementById("logout-btn")?.addEventListener("click", handleLogout);
    document.getElementById("start-test")?.addEventListener("click", startTest);
    document.getElementById("retry-btn")?.addEventListener("click", resetTest);
    
    document.querySelectorAll(".difficulty-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".difficulty-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentDifficulty = btn.getAttribute("data-difficulty");
      });
    });
    
    createResetButton();
    
    document.getElementById('modal-confirm').addEventListener('click', () => {
      document.getElementById('custom-modal').classList.add('hidden');
      modalResolve(true);
    });
    
    document.getElementById('modal-cancel').addEventListener('click', () => {
      document.getElementById('custom-modal').classList.add('hidden');
      modalResolve(false);
    });
  }