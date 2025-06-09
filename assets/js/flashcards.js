let flashcards = [];
let currentCard = 0;
let showMeaning = false;

// Embedded vocabulary data (replacing vocabulary.json)
const vocabularyData = [
    { word: "日", meaning: "Sun / Day", romaji: "hi, nichi" },
    { word: "月", meaning: "Moon / Month", romaji: "tsuki, getsu" },
    { word: "火", meaning: "Fire", romaji: "hi, ka" },
    { word: "水", meaning: "Water", romaji: "mizu, sui" },
    { word: "木", meaning: "Tree / Wood", romaji: "ki, moku" },
    { word: "金", meaning: "Gold / Money", romaji: "kane, kin" },
    { word: "土", meaning: "Earth / Soil", romaji: "tsuchi, do" },
    { word: "人", meaning: "Person", romaji: "hito, jin" },
    { word: "山", meaning: "Mountain", romaji: "yama, san" },
    { word: "川", meaning: "River", romaji: "kawa, sen" }
    // Add more as needed; truncated for brevity
];

async function loadFlashcards() {
    flashcards = [...vocabularyData]; // Load embedded data
    const errorMessage = document.getElementById('error-message');
    if (!errorMessage) {
        console.error('Error message element not found');
        return;
    }
    errorMessage.textContent = '';
    loadCard();
    updateProgress();
}

function loadCard() {
    const flashcardInner = document.getElementById('flashcard-inner');
    const wordElement = document.getElementById('flashcard-word');
    const romajiFrontElement = document.getElementById('flashcard-romaji-front');
    const meaningElement = document.getElementById('flashcard-meaning');
    const romajiBackElement = document.getElementById('flashcard-romaji-back');

    if (!flashcardInner || !wordElement || !romajiFrontElement || !meaningElement || !romajiBackElement) {
        console.error('Flashcard elements not found');
        return;
    }

    if (flashcards.length === 0) {
        wordElement.textContent = 'No flashcards available.';
        romajiFrontElement.textContent = '';
        meaningElement.textContent = '';
        romajiBackElement.textContent = '';
        return;
    }

    const card = flashcards[currentCard];
    const progress = loadFlashcardProgress();
    if (showMeaning) {
        wordElement.textContent = '';
        romajiFrontElement.textContent = '';
        meaningElement.textContent = card.meaning;
        romajiBackElement.textContent = card.romaji ? `(${card.romaji})` : '';
        flashcardInner.parentElement.classList.add('flashcard-flipped');
        if (!progress[currentCard]) {
            saveFlashcardProgress(currentCard, true);
            updateProgress();
        }
    } else {
        wordElement.textContent = card.word;
        romajiFrontElement.textContent = card.romaji ? `(${card.romaji})` : '';
        meaningElement.textContent = '';
        romajiBackElement.textContent = '';
        flashcardInner.parentElement.classList.remove('flashcard-flipped');
    }
}

function updateProgress() {
    const progress = loadFlashcardProgress();
    const learnedCount = Object.values(progress).filter(Boolean).length;
    const totalCards = flashcards.length;
    const progressPercent = totalCards ? Math.round((learnedCount / totalCards) * 100) : 0;
    saveProgress('flashcards', progressPercent);
}

document.addEventListener('DOMContentLoaded', () => {
    const nextCardBtn = document.getElementById('next-card');
    const flipCardBtn = document.getElementById('flip-card');
    if (!nextCardBtn || !flipCardBtn) {
        console.error('Button elements not found');
        return;
    }
    loadFlashcards();
    nextCardBtn.addEventListener('click', () => {
        currentCard = (currentCard + 1) % flashcards.length;
        showMeaning = false;
        loadCard();
    });
    flipCardBtn.addEventListener('click', () => {
        showMeaning = !showMeaning;
        loadCard();
    });
});