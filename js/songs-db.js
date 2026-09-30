/**
 * Guess the Song 🎵 - Song Database & Validation Utilities
 * Contains 36 curated songs across Hindi, Telugu, and English.
 */

const SONGS_DATABASE = [
  // ==========================================
  // 🇮🇳 HINDI SONGS (12 Songs)
  // ==========================================
  {
    id: "h1",
    title: "Kesariya",
    language: "hindi",
    emoji: "🧡 🌺 👩‍❤️‍👨 ✨",
    symbolClue: "🧡 + 🌺 + ❤️",
    artist: "Arijit Singh",
    movie: "Brahmastra",
    hints: [
      "Title starts with 'K' and refers to the vibrant saffron color",
      "Massive romantic blockbuster song featuring Ranbir Kapoor & Alia Bhatt"
    ],
    difficulty: "easy",
    altAnswers: ["Kesariya Tera", "Kesariya song", "Kesariya Brahmastra", "Kesariya Song"]
  },
  {
    id: "h2",
    title: "Tum Hi Ho",
    language: "hindi",
    emoji: "🌧️ ❤️ ☕ ☔ 👩‍❤️‍👨",
    symbolClue: "🌧️ + ❤️ + ☔",
    artist: "Arijit Singh",
    movie: "Aashiqui 2",
    hints: [
      "Iconic rain love anthem with the coat scene",
      "Famous lyrics: 'Hum tere bin ab reh nahi sakte...'"
    ],
    difficulty: "easy",
    altAnswers: ["Tumhi Ho", "Tum Hi Ho Aashiqui 2", "Tumhiho"]
  },
  {
    id: "h3",
    title: "Channa Mereya",
    language: "hindi",
    emoji: "🌙 ☕ 💔 🤵 👰",
    symbolClue: "🌙 + ☕ + 💔",
    artist: "Arijit Singh",
    movie: "Ae Dil Hai Mushkil",
    hints: [
      "Heartbreaking wedding song with mehendi hands",
      "Ranbir Kapoor sings goodbye to Anushka Sharma"
    ],
    difficulty: "medium",
    altAnswers: ["Channa Merya", "Chana Mereya", "Channa Mereya Ae Dil Hai Mushkil"]
  },
  {
    id: "h4",
    title: "Chaiyya Chaiyya",
    language: "hindi",
    emoji: "☕ ☕ 🚂 💨 💃 🕺",
    symbolClue: "☕ + ☕ + 🚂",
    artist: "Sukhwinder Singh, Sapna Awasthi",
    movie: "Dil Se",
    hints: [
      "High-energy dance performed on top of a moving train",
      "Featuring Shah Rukh Khan and Malaika Arora"
    ],
    difficulty: "easy",
    altAnswers: ["Chaiya Chaiya", "Chaiya Chaiyya", "Chaiyya Chaiyya Dil Se"]
  },
  {
    id: "h5",
    title: "Pasoori",
    language: "hindi",
    emoji: "🚶‍♂️ 🏃‍♀️ 🛑 💔 🎶 🇵🇰",
    symbolClue: "🏃‍♀️ + 🛑 + 💔",
    artist: "Ali Sethi, Shae Gill",
    movie: "Coke Studio Season 14",
    hints: [
      "Global viral hit with Punjabi & Hindi vocals",
      "Lyrics include: 'Agg lavan majboori nu, aane jaan di pasoori nu...'"
    ],
    difficulty: "medium",
    altAnswers: ["Pasoori Coke Studio", "Pasuri", "Pasoori Song"]
  },
  {
    id: "h6",
    title: "Kala Chashma",
    language: "hindi",
    emoji: "🕶️ 🖤 💃 🥻 🎉",
    symbolClue: "🕶️ + 🖤 + 💃",
    artist: "Badshah, Neha Kakkar",
    movie: "Baar Baar Dekho",
    hints: [
      "Party wedding song where everyone wears black sunglasses",
      "Katrina Kaif's famous viral hook step"
    ],
    difficulty: "easy",
    altAnswers: ["Kaala Chashma", "Kala Chasma", "Kaala Chasma"]
  },
  {
    id: "h7",
    title: "Senorita",
    language: "hindi",
    emoji: "💃 🇪🇸 🌹 🎸 🍷",
    symbolClue: "💃 + 🇪🇸 + 🎸",
    artist: "Farhan Akhtar, Hrithik Roshan, Abhay Deol",
    movie: "Zindagi Na Milegi Dobara",
    hints: [
      "Spanish flamenco song from a famous bachelor trip movie",
      "Hrithik Roshan, Farhan Akhtar & Abhay Deol all sing together"
    ],
    difficulty: "medium",
    altAnswers: ["Senorita ZNMD", "Senorita Zindagi Na Milegi Dobara"]
  },
  {
    id: "h8",
    title: "Ghar More Pardesiya",
    language: "hindi",
    emoji: "🏠 ➡️ 🧔 🥻 🪔 💃",
    symbolClue: "🏠 + ➡️ + 🪔",
    artist: "Shreya Ghoshal, Vaishali Mhade",
    movie: "Kalank",
    hints: [
      "Classical Kathak dance duet between Madhuri Dixit & Alia Bhatt",
      "Set during Ramnavami festival in grand historical sets"
    ],
    difficulty: "hard",
    altAnswers: ["Ghar More Pardesiya Kalank", "Ghar More Pardesya"]
  },
  {
    id: "h9",
    title: "Teri Mitti",
    language: "hindi",
    emoji: "🫵 🪵 🇮🇳 🫡 🩸 🎖️",
    symbolClue: "🫵 + 🪵 + 🇮🇳",
    artist: "B Praak",
    movie: "Kesari",
    hints: [
      "Patriotic anthem paying homage to the soil of motherland",
      "Akshay Kumar period battle movie song"
    ],
    difficulty: "medium",
    altAnswers: ["Teri Miti", "Teri Mitti Kesari"]
  },
  {
    id: "h10",
    title: "Tera Ban Jaunga",
    language: "hindi",
    emoji: "🫵 🏗️ 💍 👩‍❤️‍👨 🎵",
    symbolClue: "🫵 + 💍 + ❤️",
    artist: "Akhil Sachdeva, Tulsi Kumar",
    movie: "Kabir Singh",
    hints: [
      "Romantic hit track featuring Shahid Kapoor & Kiara Advani",
      "'Main tera ban jaunga...'"
    ],
    difficulty: "easy",
    altAnswers: ["Tera Ban Jaunga Kabir Singh", "Terabanjaunga"]
  },
  {
    id: "h11",
    title: "Balam Pichkari",
    language: "hindi",
    emoji: "🔫 💦 🎨 🥳 🕺",
    symbolClue: "🔫 + 💦 + 🎨",
    artist: "Vishal Dadlani, Shalmali Kholgade",
    movie: "Yeh Jawaani Hai Deewani",
    hints: [
      "Ultimate modern Holi party song",
      "Ranbir Kapoor splashes gulal color on Deepika Padukone"
    ],
    difficulty: "easy",
    altAnswers: ["Balam Pichkari YJHD", "Balam Pichkari Song"]
  },
  {
    id: "h12",
    title: "Jai Ho",
    language: "hindi",
    emoji: "🙌 🏆 🇮🇳 💃 🕺 🎶",
    symbolClue: "🙌 + 🏆 + 🇮🇳",
    artist: "A.R. Rahman, Sukhwinder Singh",
    movie: "Slumdog Millionaire",
    hints: [
      "Academy Award (Oscar) winning song composed by A.R. Rahman",
      "Means 'Victory to Thee'"
    ],
    difficulty: "medium",
    altAnswers: ["Jai Ho AR Rahman", "Jai Ho Slumdog Millionaire"]
  },

  // ==========================================
  // 🪷 TELUGU SONGS (12 Songs)
  // ==========================================
  {
    id: "t1",
    title: "Naatu Naatu",
    language: "telugu",
    emoji: "🕺 🕺 🪵 💨 🏆 🇮🇳",
    symbolClue: "🕺 + 🕺 + 🏆",
    artist: "Rahul Sipligunj, Kaala Bhairava",
    movie: "RRR",
    hints: [
      "Historical Oscar-winning Best Original Song from India!",
      "Furious hook-step dance battle with Ram Charan & Jr NTR"
    ],
    difficulty: "easy",
    altAnswers: ["Natu Natu", "Naatu Naatu RRR", "Naatu Naatu Song", "Natu Natu Song"]
  },
  {
    id: "t2",
    title: "Samajavaragamana",
    language: "telugu",
    emoji: "👣 👸 🚶‍♂️ ❤️ 🎵 🌾",
    symbolClue: "👣 + 👸 + ❤️",
    artist: "Sid Sriram",
    movie: "Ala Vaikunthapurramuloo",
    hints: [
      "Chart-topping Sid Sriram melody praising her walking style",
      "Featuring Allu Arjun & Pooja Hegde"
    ],
    difficulty: "easy",
    altAnswers: ["Samajavaragamana Ala Vaikunthapurramuloo", "Samajavaragamana Sid Sriram", "Samajavaragamana Song"]
  },
  {
    id: "t3",
    title: "Oo Antava Mava Oo Oo Antava",
    language: "telugu",
    emoji: "😮 ❓ 👨 😮 😮 ❓ 💃",
    symbolClue: "😮 + ❓ + 👨",
    artist: "Indravathi Chauhan",
    movie: "Pushpa: The Rise",
    hints: [
      "Viral sensation item song featuring Samantha Ruth Prabhu",
      "Composed by Devi Sri Prasad (DSP)"
    ],
    difficulty: "medium",
    altAnswers: ["Oo Antava", "Oo Antava Mava", "Oo Oo Antava", "Oo Antava Mava Oo Oo Antava Pushpa"]
  },
  {
    id: "t4",
    title: "Butta Bomma",
    language: "telugu",
    emoji: "🧺 🪆 💃 🕺 🎶",
    symbolClue: "🧺 + 🪆 + 💃",
    artist: "Armaan Malik",
    movie: "Ala Vaikunthapurramuloo",
    hints: [
      "Means 'Toy Doll' or 'Basket Doll'",
      "Famous leg-sway dance step by Allu Arjun"
    ],
    difficulty: "easy",
    altAnswers: ["Buttabomma", "Butta Bomma Song", "Butta Bomma Ala Vaikunthapurramuloo"]
  },
  {
    id: "t5",
    title: "Ramuloo Ramulaa",
    language: "telugu",
    emoji: "🍷 🥳 🕺 🕺 💔 🎵",
    symbolClue: "🍷 + 🥳 + 🕺",
    artist: "Anurag Kulkarni, Mangli",
    movie: "Ala Vaikunthapurramuloo",
    hints: [
      "Massive Telangana folk-style party song",
      "Allu Arjun wearing party glasses dancing in a club"
    ],
    difficulty: "medium",
    altAnswers: ["Ramulo Ramula", "Ramuloo Ramulaa Song", "Ramuloo Ramulaa Ala Vaikunthapurramuloo"]
  },
  {
    id: "t6",
    title: "Inkem Inkem Inkem Kaavaale",
    language: "telugu",
    emoji: "❓ ❓ ❓ 🤲 ❤️ 👩‍❤️‍👨",
    symbolClue: "❓ + 🤲 + ❤️",
    artist: "Sid Sriram",
    movie: "Geetha Govindam",
    hints: [
      "Romantic melody featuring Vijay Deverakonda & Rashmika Mandanna",
      "Means 'What else, what else do I need?'"
    ],
    difficulty: "easy",
    altAnswers: ["Inkem Inkem", "Inkem Inkem Inkem Kaavale", "Inkem Inkem Inkem Kavaale"]
  },
  {
    id: "t7",
    title: "Srivalli",
    language: "telugu",
    emoji: "👠 🚶‍♂️ 🩴 🪵 🪓 ❤️",
    symbolClue: "🩴 + 🪵 + ❤️",
    artist: "Sid Sriram",
    movie: "Pushpa: The Rise",
    hints: [
      "Allu Arjun's iconic slipper sliding step",
      "'Chupe bangaramayeeyene Srivalli...'"
    ],
    difficulty: "easy",
    altAnswers: ["Srivalli Song", "Srivalli Pushpa", "Sreevalli"]
  },
  {
    id: "t8",
    title: "Chuttamalle",
    language: "telugu",
    emoji: "🌊 ⛵ 👩‍❤️‍👨 💃 🥻",
    symbolClue: "🌊 + ⛵ + 👩‍❤️‍👨",
    artist: "Shilpa Rao",
    movie: "Devara",
    hints: [
      "2024 sensation featuring Jr NTR & Janhvi Kapoor",
      "Composed by Anirudh Ravichander"
    ],
    difficulty: "medium",
    altAnswers: ["Chuttamalle Devara", "Chuttamalle Song"]
  },
  {
    id: "t9",
    title: "Dookudu Title Song",
    language: "telugu",
    emoji: "🏎️ 💥 🚔 👨‍✈️ ⚡",
    symbolClue: "🚔 + 👨‍✈️ + ⚡",
    artist: "Shankar Mahadevan",
    movie: "Dookudu",
    hints: [
      "Massive hero intro track for Mahesh Babu as a cop",
      "Title means 'Aggression' or 'Impulse'"
    ],
    difficulty: "hard",
    altAnswers: ["Dookudu", "Dookudu Title Track", "Dookudu Dookudu"]
  },
  {
    id: "t10",
    title: "Reddy Ikkada Soodu",
    language: "telugu",
    emoji: "👑 🕺 🔥 💥 🌾",
    symbolClue: "👑 + 🕺 + 🔥",
    artist: "Daler Mehndi, Anitha",
    movie: "Aravinda Sametha",
    hints: [
      "High energy mass folk beat composed by Thaman S",
      "Jr NTR & Pooja Hegde energetic dance performance"
    ],
    difficulty: "hard",
    altAnswers: ["Reddy Ikkada Soodu Aravinda Sametha", "Reddy Ikkada Sudu"]
  },
  {
    id: "t11",
    title: "Komuram Bheemudo",
    language: "telugu",
    emoji: "🐅 ⛓️ 🩸 🇮🇳 🫡",
    symbolClue: "🐅 + ⛓️ + 🩸",
    artist: "Kaala Bhairava",
    movie: "RRR",
    hints: [
      "Intense whipping scene song showcasing Jr NTR's endurance",
      "Soulful freedom anthem composed by M.M. Keeravaani"
    ],
    difficulty: "medium",
    altAnswers: ["Komuram Bheemudo RRR", "Komaram Bheemudo"]
  },
  {
    id: "t12",
    title: "Bang Bang Bangkok",
    language: "telugu",
    emoji: "✈️ 🇹🇭 🏙️ 🥳 🍺",
    symbolClue: "✈️ + 🇹🇭 + 🥳",
    artist: "Devi Sri Prasad (DSP)",
    movie: "Kumari 21F",
    hints: [
      "Peppy holiday party song about traveling to Thailand capital",
      "Composed by DSP"
    ],
    difficulty: "hard",
    altAnswers: ["Bangkok Song", "Bang Bang Bangkok Kumari 21F"]
  },

  // ==========================================
  // 🇬🇧 ENGLISH SONGS (12 Songs)
  // ==========================================
  {
    id: "e1",
    title: "Shape of You",
    language: "english",
    emoji: "📦 🫵 🧍‍♀️ ➕ 🧍‍♂️ ❤️ 💃",
    symbolClue: "📦 + 🫵 + ❤️",
    artist: "Ed Sheeran",
    movie: "÷ (Divide)",
    hints: [
      "Billboard mega-hit with over 6 Billion streams",
      "Lyrics: 'The club isn't the best place to find a lover...'"
    ],
    difficulty: "easy",
    altAnswers: ["Shape Of You Ed Sheeran", "Shapeofyou"]
  },
  {
    id: "e2",
    title: "Blinding Lights",
    language: "english",
    emoji: "🙈 💡 💡 🏙️ 🏎️ 🌃",
    symbolClue: "🙈 + 💡 + 🌃",
    artist: "The Weeknd",
    movie: "After Hours",
    hints: [
      "Retro 80s synthwave anthem that spent over 90 weeks on Billboard",
      "The Weeknd wearing red suit & bandages in music video"
    ],
    difficulty: "easy",
    altAnswers: ["Blinding Lights The Weeknd", "Blindinglights"]
  },
  {
    id: "e3",
    title: "Despacito",
    language: "english",
    emoji: "🐢 💨 💃 🇵🇷 🏖️ 🌊",
    symbolClue: "🐢 + 💨 + 💃",
    artist: "Luis Fonsi ft. Daddy Yankee / Justin Bieber",
    movie: "Vida",
    hints: [
      "Latin pop smash song meaning 'Slowly'",
      "Broke YouTube record with over 8 Billion views"
    ],
    difficulty: "easy",
    altAnswers: ["Despacito Luis Fonsi", "Despacito Justin Bieber"]
  },
  {
    id: "e4",
    title: "Dance Monkey",
    language: "english",
    emoji: "💃 🐒 🎶 🎹 🎤",
    symbolClue: "💃 + 🐒 + 🎶",
    artist: "Tones and I",
    movie: "The Kids Are Coming",
    hints: [
      "Australian busker hit with high unique vocals",
      "'Dance for me, dance for me, dance for me, oh-oh-oh'"
    ],
    difficulty: "easy",
    altAnswers: ["Dance Monkey Tones and I", "Dancemonkey"]
  },
  {
    id: "e5",
    title: "Counting Stars",
    language: "english",
    emoji: "🔢 ⭐️ 🌟 🌃 💰 🪙",
    symbolClue: "🔢 + ⭐️ + 💰",
    artist: "OneRepublic",
    movie: "Native",
    hints: [
      "Pop-rock anthem by Ryan Tedder's band",
      "Lyrics: 'Lately I've been losing sleep, dreaming about the things that we could be...'"
    ],
    difficulty: "medium",
    altAnswers: ["Counting Stars OneRepublic", "Countingstars"]
  },
  {
    id: "e6",
    title: "Firework",
    language: "english",
    emoji: "🎆 💥 🎆 ✨ 💖 🎆",
    symbolClue: "🎆 + 💥 + ✨",
    artist: "Katy Perry",
    movie: "Teenage Dream",
    hints: [
      "Empowerment anthem about letting your light burst open",
      "'Cause baby you're a firework, come on show 'em what you're worth!'"
    ],
    difficulty: "easy",
    altAnswers: ["Firework Katy Perry", "Fireworks"]
  },
  {
    id: "e7",
    title: "Sunflower",
    language: "english",
    emoji: "🌻 🕷️ 🕸️ 🏙️ 🎧",
    symbolClue: "🌻 + 🕷️ + 🏙️",
    artist: "Post Malone, Swae Lee",
    movie: "Spider-Man: Into the Spider-Verse",
    hints: [
      "Featured on Spider-Man: Into the Spider-Verse soundtrack",
      "'Then you're left in the dust, unless I stuck by ya, you're a sunflower...'"
    ],
    difficulty: "medium",
    altAnswers: ["Sunflower Post Malone", "Spider-Man Sunflower", "Sunflower Spider Verse"]
  },
  {
    id: "e8",
    title: "Bad Guy",
    language: "english",
    emoji: "😈 🧔 👱‍♀️ 🤫 🎶",
    symbolClue: "😈 + 🧔 + 🤫",
    artist: "Billie Eilish",
    movie: "When We All Fall Asleep, Where Do We Go?",
    hints: [
      "Grammy Record of the Year hit by Billie Eilish",
      "Famous whispered line: '...Duh!'"
    ],
    difficulty: "medium",
    altAnswers: ["Bad Guy Billie Eilish", "Badguy"]
  },
  {
    id: "e9",
    title: "Stay",
    language: "english",
    emoji: "🧍‍♂️ 🛑 🚶‍♀️ 🥺 ⏰ ⌛",
    symbolClue: "🧍‍♂️ + 🛑 + 🚶‍♀️",
    artist: "The Kid LAROI, Justin Bieber",
    movie: "F*ck Love 3: Over You",
    hints: [
      "Fast-paced viral pop hit by The Kid LAROI & Justin Bieber",
      "'I do the same thing I told you that I never would... I need you to stay'"
    ],
    difficulty: "easy",
    altAnswers: ["Stay Justin Bieber", "Stay Kid Laroi"]
  },
  {
    id: "e10",
    title: "Levitating",
    language: "english",
    emoji: "🛸 🌌 💃 🕺 💫 🌟",
    symbolClue: "🛸 + 🌌 + 💫",
    artist: "Dua Lipa",
    movie: "Future Nostalgia",
    hints: [
      "Disco-pop blockbuster hit by Dua Lipa",
      "'I got you, moonlight, you're my starlight, I need you all night...'"
    ],
    difficulty: "medium",
    altAnswers: ["Levitating Dua Lipa"]
  },
  {
    id: "e11",
    title: "Umbrella",
    language: "english",
    emoji: "☔ 🌧️ ⛈️ 💧 ☂️",
    symbolClue: "☔ + 🌧️ + 💧",
    artist: "Rihanna ft. Jay-Z",
    movie: "Good Girl Gone Bad",
    hints: [
      "Rihanna's iconic rain track with the catchy hook",
      "'Under my umbrella, ella, ella, eh, eh, eh...'"
    ],
    difficulty: "easy",
    altAnswers: ["Umbrella Rihanna"]
  },
  {
    id: "e12",
    title: "Roar",
    language: "english",
    emoji: "🦁 🗣️ 🔊 🌴 🐯",
    symbolClue: "🦁 + 🗣️ + 🐯",
    artist: "Katy Perry",
    movie: "Prism",
    hints: [
      "Jungle themed empowerment hit by Katy Perry",
      "'I got the eye of the tiger, a fighter, dancing through the fire...'"
    ],
    difficulty: "medium",
    altAnswers: ["Roar Katy Perry"]
  }
];

// --- Validation & Normalization Helpers ---

/**
 * Clean string for comparison: removes spaces, special chars, accents, lowercase.
 */
function normalizeAnswer(str) {
  if (!str) return "";
  return str
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritical marks
    .replace(/[^a-z0-9]/g, "")      // keep only alphanumeric
    .trim();
}

/**
 * Calculates Levenshtein Distance for slight typos tolerance.
 */
function levenshteinDistance(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0)
  );

  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return matrix[a.length][b.length];
}

/**
 * Validates user input against a song object.
 * Returns true if exact, alternative, or close match.
 */
function checkAnswerMatch(userGuess, songObj) {
  const cleanInput = normalizeAnswer(userGuess);
  if (!cleanInput) return false;

  // 1. Check primary title
  const cleanTitle = normalizeAnswer(songObj.title);
  if (cleanInput === cleanTitle) return true;

  // 2. Check alternative titles
  if (songObj.altAnswers && Array.isArray(songObj.altAnswers)) {
    for (let alt of songObj.altAnswers) {
      if (cleanInput === normalizeAnswer(alt)) return true;
    }
  }

  // 3. Substring matching for multi-word titles (if input length >= 4)
  if (cleanInput.length >= 4) {
    if (cleanTitle.includes(cleanInput) || cleanInput.includes(cleanTitle)) {
      return true;
    }
    // Also check alt answers for substring
    if (songObj.altAnswers) {
      for (let alt of songObj.altAnswers) {
        const cleanAlt = normalizeAnswer(alt);
        if (cleanAlt.includes(cleanInput) || cleanInput.includes(cleanAlt)) {
          return true;
        }
      }
    }
  }

  // 4. Fuzzy Levenshtein Distance (allow 1-2 character typos depending on length)
  const maxDistance = cleanTitle.length > 7 ? 2 : 1;
  const dist = levenshteinDistance(cleanInput, cleanTitle);
  if (dist <= maxDistance) return true;

  return false;
}

/**
 * Filter songs by language and difficulty
 */
function getFilteredSongs(languageFilter = "mixed", difficultyFilter = "all") {
  return SONGS_DATABASE.filter(song => {
    const langMatch = (languageFilter === "mixed" || song.language === languageFilter);
    const diffMatch = (difficultyFilter === "all" || song.difficulty === difficultyFilter);
    return langMatch && diffMatch;
  });
}
