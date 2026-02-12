// Generates a random 12-word recovery phrase from a fixed word list
const WORD_LIST = [
  "apple", "river", "sun", "table", "cloud", "stone", "leaf", "ocean", "star", "mountain", "book", "light",
  "forest", "dream", "music", "fire", "earth", "wind", "tree", "sky", "flower", "moon", "rain", "bird",
  "wolf", "lake", "hill", "road", "field", "wave", "sand", "seed", "root", "fruit", "path", "rock"
];

export function generateRecoveryPhrase() {
  const phrase = [];
  const used = new Set();
  while (phrase.length < 12) {
    const idx = Math.floor(Math.random() * WORD_LIST.length);
    if (!used.has(idx)) {
      phrase.push(WORD_LIST[idx]);
      used.add(idx);
    }
  }
  return phrase;
}
