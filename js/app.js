/**
 * Guess the Song 🎵 - Main Application Controller
 * Handles Game Loop, State Machine, UI Navigation, Timers & Animations.
 */

class GameApp {
  constructor() {
    // Game State
    this.currentScreen = "screen-home";
    this.gameMode = "classic";         // 'classic', 'timeattack', 'streak'
    this.language = "mixed";           // 'mixed', 'hindi', 'telugu', 'english'
    this.difficulty = "all";           // 'all', 'easy', 'medium', 'hard'
    this.inputType = "text";           // 'text', 'mcq'
    
    this.questionsPool = [];
    this.currentQuestionIdx = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.hintsUsedInQuestion = 0;
    
    // Timer state for Time Attack
    this.timeLeft = 60;
    this.timerInterval = null;

    // History log for results screen
    this.roundHistory = [];
    
    // AI Challenge active data
    this.activeAiClue = null;
  }

  init() {
    this.bindEvents();
    this.setupConfettiCanvas();
    this.loadInitialSettings();
    console.log("Guess the Song 🎵 Game App initialized successfully.");
  }

  /* ==========================================================================
     UI SCREEN NAVIGATION & SWITCHING
     ========================================================================== */
  showScreen(screenId) {
    soundFX.playClick();

    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => {
      s.classList.remove('screen-active');
      s.classList.add('hidden');
    });

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.remove('hidden');
      // trigger CSS animation frame
      requestAnimationFrame(() => {
        target.classList.add('screen-active');
      });
      this.currentScreen = screenId;
    }

    // Stop timer if moving away from game screen
    if (screenId !== "screen-game") {
      this.stopTimer();
    }
  }

  loadInitialSettings() {
    const settings = StorageManager.getSettings();
    if (settings && settings.apiKey) {
      const input = document.getElementById("gemini-api-key-input");
      if (input) input.value = settings.apiKey;
      const statusMsg = document.getElementById("api-status-msg");
      if (statusMsg) statusMsg.textContent = "Status: Gemini API Key Loaded!";
    }
  }

  /* ==========================================================================
     EVENT BINDINGS
     ========================================================================== */
  bindEvents() {
    // Header navigation
    document.getElementById("logo-btn")?.addEventListener("click", () => this.showScreen("screen-home"));
    document.getElementById("start-game-btn")?.addEventListener("click", () => this.showScreen("screen-setup"));
    document.getElementById("how-to-play-btn")?.addEventListener("click", () => this.toggleHowToPlayModal(true));
    document.getElementById("close-howtoplay-btn")?.addEventListener("click", () => this.toggleHowToPlayModal(false));
    document.getElementById("gotit-btn")?.addEventListener("click", () => this.toggleHowToPlayModal(false));
    document.getElementById("back-to-home-btn")?.addEventListener("click", () => this.showScreen("screen-home"));

    // Header buttons
    document.getElementById("sound-toggle-btn")?.addEventListener("click", () => {
      const isMuted = soundFX.toggleMute();
      const soundIcon = document.querySelector(".sound-icon");
      if (soundIcon) soundIcon.textContent = isMuted ? "🔇" : "🔊";
    });

    document.getElementById("ai-mode-header-btn")?.addEventListener("click", () => this.showScreen("screen-ai-challenge"));
    document.getElementById("ai-challenge-btn")?.addEventListener("click", () => this.showScreen("screen-ai-challenge"));
    document.getElementById("leaderboard-header-btn")?.addEventListener("click", () => this.openLeaderboard());

    // Setup Form Controls
    this.bindSetupForm();

    // Game Action Buttons
    document.getElementById("launch-game-btn")?.addEventListener("click", () => this.startNewGame());
    document.getElementById("submit-answer-btn")?.addEventListener("click", () => this.handleAnswerSubmit());
    document.getElementById("song-answer-input")?.addEventListener("keypress", (e) => {
      if (e.key === "Enter") this.handleAnswerSubmit();
    });

    document.getElementById("hint-btn")?.addEventListener("click", () => this.handleRevealHint());
    document.getElementById("skip-btn")?.addEventListener("click", () => this.handleSkipQuestion());
    document.getElementById("next-question-btn")?.addEventListener("click", () => this.goToNextQuestion());

    // MCQ Buttons
    const mcqBtns = document.querySelectorAll(".mcq-option-btn");
    mcqBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const selectedText = btn.querySelector(".mcq-text").textContent;
        this.handleAnswerSubmit(selectedText);
      });
    });

    // Results screen controls
    document.getElementById("play-again-btn")?.addEventListener("click", () => this.showScreen("screen-setup"));
    document.getElementById("results-home-btn")?.addEventListener("click", () => this.showScreen("screen-home"));
    document.getElementById("save-score-btn")?.addEventListener("click", () => this.handleSaveScore());

    // Leaderboard Controls
    document.getElementById("lb-close-btn")?.addEventListener("click", () => this.showScreen("screen-home"));
    document.getElementById("lb-reset-btn")?.addEventListener("click", () => {
      if (confirm("Reset local leaderboard scores?")) {
        StorageManager.clearLeaderboard();
        this.renderLeaderboardTable("all");
      }
    });

    const lbFilters = document.querySelectorAll(".lb-filter-btn");
    lbFilters.forEach(btn => {
      btn.addEventListener("click", () => {
        lbFilters.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        this.renderLeaderboardTable(btn.dataset.filter);
      });
    });

    // AI Challenge Page Events
    this.bindAiChallengeEvents();
  }

  bindSetupForm() {
    // Interactive styling for card selections
    const setupCardGroups = [
      ".language-selector .choice-card",
      ".mode-selector .choice-card",
      ".difficulty-selector .choice-card",
      ".input-type-toggle .toggle-card"
    ];

    setupCardGroups.forEach(selector => {
      const cards = document.querySelectorAll(selector);
      cards.forEach(card => {
        card.addEventListener("click", () => {
          cards.forEach(c => c.classList.remove("selected"));
          card.classList.add("selected");
          const radio = card.querySelector("input[type='radio']");
          if (radio) radio.checked = true;
          soundFX.playClick();
        });
      });
    });
  }

  toggleHowToPlayModal(show) {
    soundFX.playClick();
    const modal = document.getElementById("modal-howtoplay");
    if (modal) {
      if (show) modal.classList.remove("hidden");
      else modal.classList.add("hidden");
    }
  }

  /* ==========================================================================
     GAME ENGINE & ROUND MANAGEMENT
     ========================================================================== */
  startNewGame() {
    // Read selections from form
    const langInput = document.querySelector('input[name="language"]:checked');
    const modeInput = document.querySelector('input[name="mode"]:checked');
    const diffInput = document.querySelector('input[name="difficulty"]:checked');
    const typeInput = document.querySelector('input[name="input_type"]:checked');

    this.language = langInput ? langInput.value : "mixed";
    this.gameMode = modeInput ? modeInput.value : "classic";
    this.difficulty = diffInput ? diffInput.value : "all";
    this.inputType = typeInput ? typeInput.value : "text";

    // Filter questions from Database
    const pool = getFilteredSongs(this.language, this.difficulty);
    
    if (pool.length === 0) {
      alert("No songs found for selected filters! Switching to All Difficulties.");
      this.questionsPool = [...SONGS_DATABASE].sort(() => Math.random() - 0.5);
    } else {
      // Shuffle pool
      this.questionsPool = [...pool].sort(() => Math.random() - 0.5);
    }

    // Limit Classic mode to 10 questions
    if (this.gameMode === "classic") {
      this.questionsPool = this.questionsPool.slice(0, 10);
    }

    // Reset game round stats
    this.currentQuestionIdx = 0;
    this.score = 0;
    this.streak = 0;
    this.maxStreak = 0;
    this.roundHistory = [];

    // Setup UI for input mode
    this.configureInputModeUI();

    // Setup Timer for Time Attack
    const timerBox = document.getElementById("game-timer-box");
    if (this.gameMode === "timeattack") {
      this.timeLeft = 60;
      if (timerBox) timerBox.classList.remove("hidden");
      this.startTimer();
    } else {
      if (timerBox) timerBox.classList.add("hidden");
    }

    // Switch to Game Screen & Render Q1
    this.showScreen("screen-game");
    this.renderCurrentQuestion();
  }

  configureInputModeUI() {
    const textMode = document.getElementById("text-answer-mode");
    const mcqMode = document.getElementById("mcq-answer-mode");

    if (this.inputType === "mcq") {
      if (textMode) textMode.classList.add("hidden");
      if (mcqMode) mcqMode.classList.remove("hidden");
    } else {
      if (textMode) textMode.classList.remove("hidden");
      if (mcqMode) mcqMode.classList.add("hidden");
    }
  }

  renderCurrentQuestion() {
    const question = this.questionsPool[this.currentQuestionIdx];
    if (!question) {
      this.endGameRound();
      return;
    }

    // Reset hints & feedback state for new question
    this.hintsUsedInQuestion = 0;
    this.hideFeedbackBanner();

    document.getElementById("hint-1-box")?.classList.add("hidden");
    document.getElementById("hint-2-box")?.classList.add("hidden");
    document.getElementById("next-question-btn")?.classList.add("hidden");
    document.getElementById("submit-answer-btn")?.classList.remove("hidden");
    document.getElementById("hint-btn")?.classList.remove("hidden");
    document.getElementById("skip-btn")?.classList.remove("hidden");

    // Enable inputs
    const input = document.getElementById("song-answer-input");
    if (input) {
      input.value = "";
      input.disabled = false;
      input.focus();
    }

    const mcqBtns = document.querySelectorAll(".mcq-option-btn");
    mcqBtns.forEach(btn => {
      btn.disabled = false;
      btn.style.opacity = "1";
    });

    // Update Header Bar stats
    const totalQ = (this.gameMode === "classic") ? this.questionsPool.length : "∞";
    document.getElementById("game-progress-text").textContent = `Q ${this.currentQuestionIdx + 1} / ${totalQ}`;
    document.getElementById("game-score-text").textContent = this.score;
    document.getElementById("game-streak-text").textContent = `🔥 ${this.streak}`;
    document.getElementById("clue-points-possible").textContent = "+10 Points";

    // Progress bar fill %
    const fillPercent = ((this.currentQuestionIdx + 1) / this.questionsPool.length) * 100;
    const progressFill = document.getElementById("game-progress-fill");
    if (progressFill) progressFill.style.width = `${Math.min(fillPercent, 100)}%`;

    // Render Clue Metadata
    const langEmojiMap = { hindi: "🇮🇳 Hindi", telugu: "🪷 Telugu", english: "🇬🇧 English" };
    const langTag = document.getElementById("clue-lang-tag");
    if (langTag) langTag.textContent = langEmojiMap[question.language] || "🎶 Music";

    const diffTag = document.getElementById("clue-diff-tag");
    if (diffTag) {
      diffTag.className = `badge badge-diff-${question.difficulty}`;
      diffTag.textContent = `${question.difficulty === 'easy' ? '🟢' : question.difficulty === 'medium' ? '🟡' : '🔴'} ${question.difficulty.toUpperCase()}`;
    }

    // Render Clue Text
    document.getElementById("clue-emoji-display").textContent = question.emoji;
    const symbolText = document.getElementById("clue-symbol-text");
    if (symbolText) {
      if (question.symbolClue) {
        symbolText.textContent = `Clue: ${question.symbolClue}`;
        symbolText.classList.remove("hidden");
      } else {
        symbolText.classList.add("hidden");
      }
    }

    // Render MCQ Options if MCQ mode
    if (this.inputType === "mcq") {
      const options = songAIEngine.createMultipleChoiceOptions(question.title);
      mcqBtns.forEach((btn, idx) => {
        const textSpan = btn.querySelector(".mcq-text");
        if (textSpan && options[idx]) {
          textSpan.textContent = options[idx];
        }
      });
    }
  }

  /* ==========================================================================
     ANSWER SUBMISSION & VALIDATION
     ========================================================================== */
  handleAnswerSubmit(overrideGuess = null) {
    const question = this.questionsPool[this.currentQuestionIdx];
    if (!question) return;

    const input = document.getElementById("song-answer-input");
    const userGuess = overrideGuess !== null ? overrideGuess : (input ? input.value : "");

    if (!userGuess.trim()) {
      input?.focus();
      return;
    }

    const isCorrect = checkAnswerMatch(userGuess, question);

    // Disable inputs after submission
    if (input) input.disabled = true;
    const mcqBtns = document.querySelectorAll(".mcq-option-btn");
    mcqBtns.forEach(btn => btn.disabled = true);

    document.getElementById("submit-answer-btn")?.classList.add("hidden");
    document.getElementById("hint-btn")?.classList.add("hidden");
    document.getElementById("skip-btn")?.classList.add("hidden");
    document.getElementById("next-question-btn")?.classList.remove("hidden");

    if (isCorrect) {
      // Calculate Points
      let points = 10;
      if (this.hintsUsedInQuestion === 1) points = 7;
      if (this.hintsUsedInQuestion === 2) points = 5;

      this.score += points;
      this.streak++;
      if (this.streak > this.maxStreak) this.maxStreak = this.streak;

      soundFX.playCorrect();
      this.triggerConfetti();

      this.showFeedbackBanner(
        true,
        `✅ Correct! (+${points} pts)`,
        `Song: <strong>${question.title}</strong> (${question.movie || question.artist})`
      );

      this.roundHistory.push({
        question,
        userGuess,
        isCorrect: true,
        pointsEarned: points
      });

    } else {
      // Wrong answer
      this.streak = 0; // reset streak
      soundFX.playWrong();

      // Card shake effect
      const clueCard = document.getElementById("clue-card");
      if (clueCard) {
        clueCard.classList.add("shake-anim");
        setTimeout(() => clueCard.classList.remove("shake-anim"), 600);
      }

      this.showFeedbackBanner(
        false,
        `❌ Wrong Answer!`,
        `The correct song was: <strong>${question.title}</strong> (${question.artist})`
      );

      this.roundHistory.push({
        question,
        userGuess,
        isCorrect: false,
        pointsEarned: 0
      });

      // If Streak Mode, wrong answer ends game immediately!
      if (this.gameMode === "streak") {
        setTimeout(() => this.endGameRound(), 1800);
        return;
      }
    }

    // Update Header Bar Stats
    document.getElementById("game-score-text").textContent = this.score;
    document.getElementById("game-streak-text").textContent = `🔥 ${this.streak}`;
  }

  handleRevealHint() {
    const question = this.questionsPool[this.currentQuestionIdx];
    if (!question || !question.hints) return;

    soundFX.playHint();

    if (this.hintsUsedInQuestion === 0) {
      this.hintsUsedInQuestion = 1;
      const h1Box = document.getElementById("hint-1-box");
      const h1Text = document.getElementById("hint-1-text");
      if (h1Text) h1Text.textContent = question.hints[0] || "No hint available.";
      if (h1Box) h1Box.classList.remove("hidden");
      document.getElementById("clue-points-possible").textContent = "+7 Points (Hint 1 Used)";
    } else if (this.hintsUsedInQuestion === 1) {
      this.hintsUsedInQuestion = 2;
      const h2Box = document.getElementById("hint-2-box");
      const h2Text = document.getElementById("hint-2-text");
      if (h2Text) h2Text.textContent = question.hints[1] || "No further hints.";
      if (h2Box) h2Box.classList.remove("hidden");
      document.getElementById("clue-points-possible").textContent = "+5 Points (2 Hints Used)";
      document.getElementById("hint-btn")?.classList.add("hidden");
    }
  }

  handleSkipQuestion() {
    const question = this.questionsPool[this.currentQuestionIdx];
    soundFX.playWrong();

    this.streak = 0; // reset streak
    document.getElementById("game-streak-text").textContent = `🔥 ${this.streak}`;

    this.roundHistory.push({
      question,
      userGuess: "[Skipped]",
      isCorrect: false,
      pointsEarned: 0
    });

    this.goToNextQuestion();
  }

  goToNextQuestion() {
    this.currentQuestionIdx++;

    // Check if end of questions
    if (this.currentQuestionIdx >= this.questionsPool.length) {
      // In Streak Mode or Time Attack, if pool exhausted, reshuffle and continue
      if (this.gameMode === "streak" || this.gameMode === "timeattack") {
        this.questionsPool = [...SONGS_DATABASE].sort(() => Math.random() - 0.5);
        this.currentQuestionIdx = 0;
      } else {
        this.endGameRound();
        return;
      }
    }

    this.renderCurrentQuestion();
  }

  showFeedbackBanner(isCorrect, title, desc) {
    const banner = document.getElementById("feedback-banner");
    const icon = document.getElementById("feedback-icon");
    const titleEl = document.getElementById("feedback-title");
    const descEl = document.getElementById("feedback-desc");

    if (banner && icon && titleEl && descEl) {
      banner.className = `feedback-banner ${isCorrect ? 'correct' : 'wrong'}`;
      icon.textContent = isCorrect ? "✅" : "❌";
      titleEl.textContent = title;
      descEl.innerHTML = desc;
      banner.classList.remove("hidden");
    }
  }

  hideFeedbackBanner() {
    document.getElementById("feedback-banner")?.classList.add("hidden");
  }

  /* ==========================================================================
     TIMER SYSTEM (TIME ATTACK MODE)
     ========================================================================== */
  startTimer() {
    this.stopTimer();
    const timerText = document.getElementById("game-timer-text");

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (timerText) timerText.textContent = this.timeLeft;

      if (this.timeLeft <= 0) {
        this.stopTimer();
        soundFX.playWrong();
        this.endGameRound();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /* ==========================================================================
     RESULTS SCREEN & SUMMARY
     ========================================================================== */
  endGameRound() {
    this.stopTimer();
    soundFX.playVictory();
    this.triggerConfetti();

    // Compute Stats
    const totalQs = this.roundHistory.length;
    const correctCount = this.roundHistory.filter(h => h.isCorrect).length;
    const accuracy = totalQs > 0 ? Math.round((correctCount / totalQs) * 100) : 0;
    const hintsCount = this.roundHistory.reduce((acc, curr) => acc + (curr.hintsUsed || 0), 0);

    // Performance Title Rank
    let rankTitle = "👑 Musical Genius";
    if (this.score < 40) rankTitle = "📻 Music Rookie";
    else if (this.score < 70) rankTitle = "🎧 Beat Collector";
    else if (this.score < 100) rankTitle = "🎵 Emoji Master";

    document.getElementById("results-headline").textContent = this.gameMode === "streak" && this.streak === 0 ? "Streak Ended!" : "Game Complete! 🎉";
    document.getElementById("results-rank-title").textContent = rankTitle;
    document.getElementById("final-score-value").textContent = this.score;
    document.getElementById("stat-accuracy").textContent = `${accuracy}%`;
    document.getElementById("stat-correct").textContent = `${correctCount} / ${totalQs}`;
    document.getElementById("stat-max-streak").textContent = `🔥 ${this.maxStreak}`;
    document.getElementById("stat-hints-used").textContent = hintsCount;

    // Render Round History List
    const summaryList = document.getElementById("round-summary-list");
    if (summaryList) {
      summaryList.innerHTML = "";
      this.roundHistory.forEach(item => {
        const card = document.createElement("div");
        card.className = `summary-item ${item.isCorrect ? 'is-correct' : 'is-wrong'}`;
        card.innerHTML = `
          <span class="summary-clue">${item.question.emoji}</span>
          <span class="summary-title">${item.question.title} (${item.question.artist})</span>
          <span class="summary-status">${item.isCorrect ? `+${item.pointsEarned} pts` : '❌ 0 pts'}</span>
        `;
        summaryList.appendChild(card);
      });
    }

    this.showScreen("screen-results");
  }

  handleSaveScore() {
    const playerName = prompt("Enter your name for the Leaderboard:", "Music Decoder");
    if (playerName && playerName.trim()) {
      StorageManager.saveScore({
        player: playerName.trim(),
        score: this.score,
        mode: this.gameMode.toUpperCase(),
        language: this.language.toUpperCase(),
        streak: this.maxStreak
      });
      alert("Score saved to Leaderboard! 🏆");
      this.openLeaderboard();
    }
  }

  /* ==========================================================================
     LEADERBOARD VIEW
     ========================================================================== */
  openLeaderboard() {
    this.renderLeaderboardTable("all");
    this.showScreen("screen-leaderboard");
  }

  renderLeaderboardTable(filterMode = "all") {
    const tbody = document.getElementById("lb-table-body");
    if (!tbody) return;

    let scores = StorageManager.getScores();
    if (filterMode !== "all") {
      scores = scores.filter(s => s.mode.toLowerCase() === filterMode.toLowerCase());
    }

    tbody.innerHTML = "";
    if (scores.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: var(--text-muted);">No high scores recorded yet!</td></tr>`;
      return;
    }

    scores.forEach((entry, idx) => {
      const tr = document.createElement("tr");
      const rankEmoji = idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`;
      tr.innerHTML = `
        <td>${rankEmoji}</td>
        <td><strong>${entry.player}</strong></td>
        <td style="color: var(--neon-cyan); font-weight: 800;">${entry.score}</td>
        <td><span class="badge badge-lang">${entry.mode}</span></td>
        <td>🔥 ${entry.streak}</td>
        <td style="color: var(--text-muted); font-size: 0.85rem;">${entry.date}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  /* ==========================================================================
     AI CHALLENGE FEATURE CONTROLLER
     ========================================================================== */
  bindAiChallengeEvents() {
    const genBtn = document.getElementById("generate-ai-clue-btn");
    const input = document.getElementById("ai-song-input");
    const configBtn = document.getElementById("ai-config-toggle-btn");
    const saveKeyBtn = document.getElementById("save-api-key-btn");
    const aiBackBtn = document.getElementById("ai-back-btn");

    configBtn?.addEventListener("click", () => {
      const drawer = document.getElementById("ai-api-drawer");
      drawer?.classList.toggle("hidden");
    });

    saveKeyBtn?.addEventListener("click", () => {
      const keyVal = document.getElementById("gemini-api-key-input")?.value.trim();
      StorageManager.saveSettings({ apiKey: keyVal });
      const statusMsg = document.getElementById("api-status-msg");
      if (statusMsg) statusMsg.textContent = keyVal ? "Status: Gemini API Key Saved!" : "Status: Using Built-in Semantic AI Engine";
      alert("API Settings updated!");
    });

    aiBackBtn?.addEventListener("click", () => this.showScreen("screen-home"));

    genBtn?.addEventListener("click", async () => {
      const songTitle = input ? input.value.trim() : "";
      if (!songTitle) {
        alert("Please enter a song title!");
        return;
      }
      await this.runAiGeneration(songTitle);
    });

    // Quick suggestions pills
    const pills = document.querySelectorAll(".ai-pill");
    pills.forEach(pill => {
      pill.addEventListener("click", async () => {
        const song = pill.dataset.song;
        if (input) input.value = song;
        await this.runAiGeneration(song);
      });
    });

    // Test guess on AI generated clue
    document.getElementById("submit-ai-guess-btn")?.addEventListener("click", () => {
      const guessInput = document.getElementById("ai-guess-input");
      const userGuess = guessInput ? guessInput.value.trim() : "";
      if (!userGuess || !this.activeAiClue) return;

      const isMatch = checkAnswerMatch(userGuess, {
        title: this.activeAiClue.title,
        altAnswers: []
      });

      const feedback = document.getElementById("ai-guess-feedback");
      if (feedback) {
        feedback.className = `feedback-banner ${isMatch ? 'correct' : 'wrong'}`;
        feedback.innerHTML = isMatch 
          ? `✅ Spot On! You decoded the AI puzzle for <strong>${this.activeAiClue.title}</strong>!`
          : `❌ Not quite! The song title was: <strong>${this.activeAiClue.title}</strong>`;
        feedback.classList.remove("hidden");
      }
    });
  }

  async runAiGeneration(songTitle) {
    soundFX.playClick();
    const resultCard = document.getElementById("ai-result-card");
    const outputEmojis = document.getElementById("ai-output-emojis");
    const h1 = document.getElementById("ai-output-hint1");
    const h2 = document.getElementById("ai-output-hint2");
    const feedback = document.getElementById("ai-guess-feedback");

    if (outputEmojis) outputEmojis.textContent = "🤖 Generating AI Emojis...";
    if (resultCard) resultCard.classList.remove("hidden");
    if (feedback) feedback.classList.add("hidden");

    const clueData = await songAIEngine.generateSongClue(songTitle);
    this.activeAiClue = clueData;

    if (clueData) {
      if (outputEmojis) outputEmojis.textContent = clueData.emoji;
      if (h1) h1.textContent = clueData.hints[0] || "...";
      if (h2) h2.textContent = clueData.hints[1] || "...";
      soundFX.playCorrect();
    }
  }

  /* ==========================================================================
     CANVAS CONFETTI CELEBRATION EFFECT
     ========================================================================== */
  setupConfettiCanvas() {
    this.canvas = document.getElementById("confetti-canvas");
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];

    window.addEventListener("resize", () => {
      if (this.canvas) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }
    });
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  triggerConfetti() {
    if (!this.canvas || !this.ctx) return;
    const colors = ["#9d4edd", "#f72585", "#4cc9f0", "#ffb703", "#06d6a0"];

    for (let i = 0; i < 80; i++) {
      this.particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.7) * 14,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    if (!this.animatingConfetti) {
      this.animatingConfetti = true;
      this.renderConfettiFrame();
    }
  }

  renderConfettiFrame() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // gravity
      p.rotation += p.rSpeed;
      p.opacity -= 0.015;

      if (p.opacity <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.renderConfettiFrame());
    } else {
      this.animatingConfetti = false;
    }
  }
}

// Instantiate App when DOM Ready
document.addEventListener("DOMContentLoaded", () => {
  window.app = new GameApp();
  window.app.init();
});
