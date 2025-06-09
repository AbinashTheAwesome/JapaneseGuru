let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;
const QUESTION_TIME = 10; // seconds

// Embedded hiragana data (replacing hiragana.json)
const hiraganaData = [
    { question: "What is the romaji for あ?", options: ["a", "i", "u", "e"], answer: "a", explanation: "The hiragana あ is pronounced as 'a'." },
    { question: "What is the romaji for い?", options: ["a", "i", "u", "e"], answer: "i", explanation: "The hiragana い is pronounced as 'i'." },
    { question: "What is the romaji for う?", options: ["u", "o", "e", "a"], answer: "u", explanation: "The hiragana う is pronounced as 'u'." },
    { question: "What is the romaji for え?", options: ["e", "i", "o", "a"], answer: "e", explanation: "The hiragana え is pronounced as 'e'." },
    { question: "What is the romaji for お?", options: ["o", "u", "a", "i"], answer: "o", explanation: "The hiragana お is pronounced as 'o'." }
    // Add more as needed; truncated for brevity
];

// Embedded katakana data (replacing katakana.json)
const katakanaData = [
    { question: "What is the romaji for ア?", options: ["a", "i", "u", "e"], answer: "a", explanation: "The katakana ア is pronounced as 'a'." },
    { question: "What is the romaji for イ?", options: ["a", "i", "u", "e"], answer: "i", explanation: "The katakana イ is pronounced as 'i'." },
    { question: "What is the romaji for ウ?", options: ["u", "o", "e", "a"], answer: "u", explanation: "The katakana ウ is pronounced as 'u'." },
    { question: "What is the romaji for エ?", options: ["e", "i", "o", "a"], answer: "e", explanation: "The katakana エ is pronounced as 'e'." },
    { question: "What is the romaji for オ?", options: ["o", "u", "a", "i"], answer: "o", explanation: "The katakana オ is pronounced as 'o'." }
    // Add more as needed; truncated for brevity
];

function loadQuestions(type) {
    questions = type === 'katakana' ? [...katakanaData] : [...hiraganaData];
    questions = questions.sort(() => Math.random() - 0.5).slice(0, 5); // Randomize and limit to 5
    loadQuestion();
}

function startTimer() {
    let timeLeft = QUESTION_TIME;
    document.getElementById('timer').textContent = `Time: ${timeLeft}s`;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Time: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(null);
        }
    }, 1000);
}

function loadQuestion() {
    clearInterval(timer);
    if (questions.length === 0) {
        document.getElementById('question').textContent = "No questions available.";
        document.querySelectorAll('.option').forEach(btn => btn.style.display = 'none');
        document.getElementById('result').textContent = '';
        document.getElementById('progress').textContent = '';
        return;
    }
    const q = questions[currentQuestion];
    const shuffledOptions = q.options.slice().sort(() => Math.random() - 0.5);
    document.getElementById('question').textContent = q.question;
    const optionButtons = document.querySelectorAll('.option');
    optionButtons.forEach((btn, i) => {
        btn.textContent = shuffledOptions[i] || '';
        btn.onclick = () => checkAnswer(btn);
        btn.dataset.correct = shuffledOptions[i] === q.answer;
        btn.style.display = shuffledOptions[i] ? 'block' : 'none';
    });
    document.getElementById('progress').textContent = `Question ${currentQuestion + 1}/${questions.length}`;
    startTimer();
}

function checkAnswer(btn) {
    clearInterval(timer);
    const correct = btn ? btn.dataset.correct === 'true' : false;
    if (correct) score++;
    const q = questions[currentQuestion];
    document.getElementById('result').innerHTML = correct 
        ? `✅ Correct! ${q.explanation}` 
        : `❌ Wrong! The correct answer is ${q.answer}. ${q.explanation}`;
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            loadQuestion();
        } else {
            endQuiz();
        }
    }, 2000);
}

function endQuiz() {
    const quizType = new URLSearchParams(window.location.search).get('type') || 'hiragana';
    saveProgress(quizType, Math.round((score / questions.length) * 100));
    document.querySelector('.quiz-container').innerHTML = `
        <h2 class="text-xl font-bold">Quiz Complete!</h2>
        <p>Your score: ${score}/${questions.length}</p>
        <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" onclick="location.reload()">Restart</button>
        <a href="../index.html" class="cta-button inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Return Home</a>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const quizType = new URLSearchParams(window.location.search).get('type') || 'hiragana';
    const hiraganaBtn = document.getElementById('hiragana-btn');
    const katakanaBtn = document.getElementById('katakana-btn');
    if (quizType === 'hiragana') {
        hiraganaBtn.classList.add('bg-blue-800', 'ring-2', 'ring-blue-400');
        katakanaBtn.classList.remove('bg-purple-800', 'ring-2', 'ring-purple-400');
    } else {
        katakanaBtn.classList.add('bg-purple-800', 'ring-2', 'ring-purple-400');
        hiraganaBtn.classList.remove('bg-blue-800', 'ring-2', 'ring-blue-400');
    }
    loadQuestions(quizType);
});