let flashcards = [];
let currentCard = 0;
let showMeaning = false;
const DATA_PATH = '../assets/data/';

async function loadFlashcards() {
    const errorMessage = document.getElementById('error-message');
    if (!errorMessage) {
        console.error('Error message element not found');
        return;
    }
    errorMessage.textContent = 'Loading flashcards...';
    errorMessage.classList.add('text-gray-500');

    try {
        const fullPath = `${DATA_PATH}vocabulary.json`;
        console.log(`Loading flashcards from ${fullPath}`);
        const response = await fetch(fullPath, { cache: 'no-store' });
        console.log(`Fetch response: status=${response.status}, ok=${response.ok}, url=${response.url}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const text = await response.clone().text();
        console.log(`Raw response: ${text.substring(0, 300)}...`);
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Invalid or empty JSON data');
        }
        flashcards = data;
        console.log(`Loaded ${flashcards.length} flashcards`);
        errorMessage.textContent = '';
        errorMessage.classList.remove('text-gray-500');
    } catch (error) {
        console.error('Error loading flashcards:', error);
        flashcards = [
            { word: "こんにちは", meaning: "Hello", romaji: "konnichiwa" },
            { word: "ありがとう", meaning: "Thank you", romaji: "arigatou" },
            { word: "さようなら", meaning: "Goodbye", romaji: "sayonara" }
        ];
        errorMessage.textContent = `Failed to load flashcards. Using ${flashcards.length} fallback cards.`;
        errorMessage.classList.add('text-red-700');
        errorMessage.classList.remove('text-gray-500');
        setTimeout(() => {
            errorMessage.textContent = '';
            errorMessage.classList.remove('text-red-700');
        }, 3000);
    }
    loadCard();
}

function loadCard() {
    const flashcardInner = document.getElementById('flashcard-inner');
    const wordElement = document.getElementById('flashcard-word');
    const romajiFrontElement = document.getElementById('flashcard-romaji-front');
    const meaningElement = document.getElementById('flashcard-meaning');
    const romajiBackElement = document.getElementById('flashcard-romaji-back');

    if (!flashcardInner || !wordElement || !romajiFrontElement || !meaningElement || !romajiBackElement) {
        console.error('Flashcard elements not found:', {
            flashcardInner: !!flashcardInner,
            wordElement: !!wordElement,
            romajiFrontElement: !!romajiFrontElement,
            meaningElement: !!meaningElement,
            romajiBackElement: !!romajiBackElement
        });
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
    if (showMeaning) {
        wordElement.textContent = '';
        romajiFrontElement.textContent = '';
        meaningElement.textContent = card.meaning;
        romajiBackElement.textContent = card.romaji ? `(${card.romaji})` : '';
        flashcardInner.parentElement.classList.add('flashcard-flipped');
    } else {
        wordElement.textContent = card.word;
        romajiFrontElement.textContent = card.romaji ? `(${card.romaji})` : '';
        meaningElement.textContent = '';
        romajiBackElement.textContent = '';
        flashcardInner.parentElement.classList.remove('flashcard-flipped');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const nextCardBtn = document.getElementById('next-card');
    const flipCardBtn = document.getElementById('flip-card');
    if (!nextCardBtn || !flipCardBtn) {
        console.error('Button elements not found:', {
            nextCard: !!nextCardBtn,
            flipCard: !!flipCardBtn
        });
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