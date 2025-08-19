function saveProgress(category, score) {
    const progress = JSON.parse(localStorage.getItem('japanese_progress')) || {};
    progress[category] = score;
    localStorage.setItem('japanese_progress', JSON.stringify(progress));
    const total = Object.values(progress).reduce((a, b) => a + b, 0);
    const max = Object.keys(progress).length * 100;
    const overallProgress = Math.round((total / max) * 100);
    localStorage.setItem('progress', overallProgress);
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) progressBar.style.width = `${overallProgress}%`;
}

function loadProgress() {
    return JSON.parse(localStorage.getItem('japanese_progress')) || {};
}

function saveFlashcardProgress(cardIndex, learned) {
    const flashcardProgress = JSON.parse(localStorage.getItem('flashcard_progress')) || {};
    flashcardProgress[cardIndex] = learned;
    localStorage.setItem('flashcard_progress', JSON.stringify(flashcardProgress));
}

function loadFlashcardProgress() {
    return JSON.parse(localStorage.getItem('flashcard_progress')) || {};
}