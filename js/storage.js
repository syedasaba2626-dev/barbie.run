/**
 * Guess the Song 🎵 - LocalStorage Persistence Manager
 * Handles leaderboards, player history, and API settings.
 */

const STORAGE_KEYS = {
  LEADERBOARD: "guess_song_leaderboard_v1",
  SETTINGS: "guess_song_settings_v1"
};

const StorageManager = {
  /**
   * Retrieves high scores array
   */
  getScores() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      return data ? JSON.parse(data) : this.getDefaultScores();
    } catch (e) {
      console.warn("LocalStorage access error:", e);
      return this.getDefaultScores();
    }
  },

  /**
   * Default sample high scores for impressive initial workshop demo
   */
  getDefaultScores() {
    return [
      { id: "1", player: "Aarav", score: 120, mode: "Classic", language: "Hindi", streak: 8, date: "2026-09-28" },
      { id: "2", player: "Siddharth", score: 105, mode: "Time Attack", language: "Mixed", streak: 6, date: "2026-09-29" },
      { id: "3", player: "Ananya", score: 95, mode: "Streak", language: "Telugu", streak: 9, date: "2026-09-29" },
      { id: "4", player: "Elena", score: 85, mode: "Classic", language: "English", streak: 5, date: "2026-09-30" },
      { id: "5", player: "Rohan", score: 70, mode: "Classic", language: "Mixed", streak: 4, date: "2026-09-30" }
    ];
  },

  /**
   * Save a new score entry
   */
  saveScore(entry) {
    const scores = this.getScores();
    const newEntry = {
      id: Date.now().toString(),
      player: entry.player || "Anonymous Player",
      score: entry.score || 0,
      mode: entry.mode || "Classic",
      language: entry.language || "Mixed",
      streak: entry.streak || 0,
      date: new Date().toISOString().split("T")[0]
    };

    scores.push(newEntry);
    // Sort descending by score
    scores.sort((a, b) => b.score - a.score);

    // Keep top 20
    const topScores = scores.slice(0, 20);
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(topScores));
    } catch (e) {
      console.error(e);
    }
    return topScores;
  },

  /**
   * Reset leaderboard
   */
  clearLeaderboard() {
    try {
      localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
    } catch (e) {
      console.error(e);
    }
  },

  /**
   * Save settings (e.g. Gemini API key)
   */
  getSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : { apiKey: "", playerName: "Music Decoder" };
    } catch (e) {
      return { apiKey: "", playerName: "Music Decoder" };
    }
  },

  saveSettings(settings) {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.error(e);
    }
  }
};
