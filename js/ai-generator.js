/**
 * Guess the Song 🎵 - Generative AI Engine
 * Converts song titles into creative Emoji + Symbol Puzzles!
 * Supports both Local Semantic Engine and optional live Google Gemini API.
 */

class SongAIGenerator {
  constructor() {
    // Extensive semantic mapping dictionary for offline AI generation
    this.emojiLexicon = {
      // Colors & Themes
      saffron: "🧡", kesariya: "🧡", red: "❤️", blue: "💙", black: "🖤", yellow: "💛", gold: "✨",
      rain: "🌧️", coffee: "☕", love: "❤️", heart: "💖", broken: "💔", night: "🌙", moon: "🌙",
      sun: "☀️", sunflower: "🌻", flower: "🌺", star: "⭐️", fire: "🔥", light: "💡", blinding: "🙈",
      train: "🚂", dance: "💃", monkey: "🐒", doll: "🪆", toy: "🧸", basket: "🧺", slippers: "🩴",
      slipper: "🩴", wooden: "🪵", whip: "⛓️", tiger: "🐅", lion: "🦁", jungle: "🌴", roar: "🗣️",
      umbrella: "☔", storm: "⛈️", spanish: "🇪🇸", wine: "🍷", wedding: "👰", groom: "🤵",
      party: "🥳", Holi: "🔫", color: "🎨", water: "💦", sunglasses: "🕶️", glasses: "🕶️",
      shape: "📦", you: "🫵", me: "🙋‍♂️", stay: "🛑", flying: "🛸", levitating: "🌌",
      bad: "😈", guy: "🧔", country: "🇮🇳", india: "🇮🇳", victory: "🏆", king: "👑",
      dookudu: "⚡", cop: "🚔", ocean: "🌊", boat: "⛵", thailand: "🇹🇭", bangkok: "✈️"
    };
  }

  /**
   * Main entry point to generate AI clue for a song title
   */
  async generateSongClue(songTitle) {
    const cleanTitle = songTitle.trim();
    if (!cleanTitle) return null;

    // Check if user has configured a Gemini API key
    const settings = StorageManager.getSettings();
    if (settings && settings.apiKey) {
      try {
        const geminiResult = await this.callGeminiAPI(cleanTitle, settings.apiKey);
        if (geminiResult) return geminiResult;
      } catch (err) {
        console.warn("Gemini API call failed, falling back to local semantic engine:", err);
      }
    }

    // Default: Use Local Generative Semantic Engine
    return this.generateSemanticLocalClue(cleanTitle);
  }

  /**
   * Local Smart Semantic Generator
   */
  generateSemanticLocalClue(title) {
    const words = title.toLowerCase().split(/\s+/);
    let matchedEmojis = [];

    // Check exact song match in our database first for maximum fidelity
    const dbMatch = SONGS_DATABASE.find(s => 
      s.title.toLowerCase() === title.toLowerCase() || 
      (s.altAnswers && s.altAnswers.some(alt => alt.toLowerCase() === title.toLowerCase()))
    );

    if (dbMatch) {
      return {
        title: dbMatch.title,
        emoji: dbMatch.emoji,
        symbolClue: dbMatch.symbolClue || "🎵 + ✨ + 🎶",
        hints: dbMatch.hints,
        artist: dbMatch.artist,
        movie: dbMatch.movie,
        options: this.createMultipleChoiceOptions(dbMatch.title),
        source: "AI Semantic Engine (Matched)"
      };
    }

    // Dynamic keyword parsing for unknown/new songs entered by user!
    words.forEach(word => {
      const cleanWord = word.replace(/[^a-z0-9]/g, "");
      if (this.emojiLexicon[cleanWord]) {
        matchedEmojis.push(this.emojiLexicon[cleanWord]);
      }
    });

    // Fallback creative emojis if no direct keyword matched
    if (matchedEmojis.length === 0) {
      const abstractSet = ["🎵", "❤️", "🔥", "✨", "🌟", "💫", "💃", "🎶"];
      matchedEmojis = [
        abstractSet[Math.floor(Math.random() * abstractSet.length)],
        abstractSet[Math.floor(Math.random() * abstractSet.length)],
        abstractSet[Math.floor(Math.random() * abstractSet.length)],
        "🎶"
      ];
    } else {
      matchedEmojis.push("🎶");
    }

    const emojiStr = matchedEmojis.join(" ");

    return {
      title: title,
      emoji: emojiStr,
      symbolClue: matchedEmojis.slice(0, 3).join(" + "),
      hints: [
        `Song title starts with the letter '${title.charAt(0).toUpperCase()}'`,
        `Contains ${title.split(' ').length} word(s) in the song name`
      ],
      artist: "Generative AI Decoded Track",
      movie: "AI Collection",
      options: this.createMultipleChoiceOptions(title),
      source: "Generative AI Semantic Engine"
    };
  }

  /**
   * Generates 4 distractor choices for Multiple Choice mode
   */
  createMultipleChoiceOptions(correctTitle) {
    const choices = [correctTitle];
    const shuffleDb = [...SONGS_DATABASE].sort(() => Math.random() - 0.5);

    for (let song of shuffleDb) {
      if (song.title.toLowerCase() !== correctTitle.toLowerCase() && !choices.includes(song.title)) {
        choices.push(song.title);
      }
      if (choices.length >= 4) break;
    }

    // Fallback defaults if DB is small
    while (choices.length < 4) {
      choices.push(`Song Track #${choices.length + 1}`);
    }

    // Shuffle options
    return choices.sort(() => Math.random() - 0.5);
  }

  /**
   * Optional Gemini API Integration (v1beta REST)
   */
  async callGeminiAPI(songTitle, apiKey) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const promptText = `
You are an expert music puzzle AI. 
Generate a song clue for the song title: "${songTitle}".
Return ONLY a valid JSON object with the following fields:
{
  "emoji": "3 to 5 emojis representing the song title or theme",
  "symbolClue": "symbol representation like EMOJI + EMOJI",
  "hint1": "first subtle hint",
  "hint2": "second direct hint",
  "artist": "artist or unknown",
  "movie": "movie/album or unknown"
}
Do not include markdown codeblocks or extra text.
`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }]
      })
    });

    if (!response.ok) throw new Error(`Gemini API HTTP Error ${response.status}`);
    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Clean response text to parse JSON
    const cleanJsonText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanJsonText);

    return {
      title: songTitle,
      emoji: parsed.emoji || "🎵 ✨ 🎶",
      symbolClue: parsed.symbolClue || "🎵 + ✨",
      hints: [parsed.hint1 || "AI Generated Hint 1", parsed.hint2 || "AI Generated Hint 2"],
      artist: parsed.artist || "AI Artist",
      movie: parsed.movie || "Gemini Album",
      options: this.createMultipleChoiceOptions(songTitle),
      source: "Google Gemini 1.5 Flash (Live)"
    };
  }
}

// Global Singleton Instance
const songAIEngine = new SongAIGenerator();
