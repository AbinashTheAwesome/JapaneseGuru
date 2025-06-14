let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;
const QUESTION_TIME = 10; // seconds
const DATA_PATH = '../assets/data/'; // Relative path from quiz.html

const fallbackQuestions = {
    hiragana: [
        {
            question: "What is the romaji for あ?",
            options: ["a", "i", "u", "e"],
            answer: "a",
            explanation: "The hiragana あ is pronounced as 'a' in romaji."
        },
        {
            question: "What does こんにちは mean?",
            options: ["Good morning", "Hello", "Good night", "Thank you"],
            answer: "Hello",
            explanation: "こんにちは is a common greeting used during the day, meaning 'Hello'."
        }
    ],
    katakana: [
        {
            question: "What is the romaji for ア?",
            options: ["a", "i", "u", "e"],
            answer: "a",
            explanation: "The katakana ア is pronounced as 'a' in romaji."
        },
        {
            question: "What is the katakana for 'ki'?",
            options: ["カ", "キ", "ク", "ケ"],
            answer: "キ",
            explanation: "The katakana キ represents the sound 'ki' in romaji."
        }
    ]
};

async function loadQuestions(type) {
    try {
        const fullPath = `${DATA_PATH}${type}.json`;
        console.log(`Attempting to load ${type} questions from ${window.location.origin}${fullPath}`);
        const response = await fetch(fullPath, { cache: 'no-store' });
        console.log(`Response status: ${response.status}, OK: ${response.ok}, URL: ${response.url}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        const text = await response.clone().text();
        console.log(`Raw response: ${text.substring(0, 300)}...`);
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Invalid or empty JSON data');
        }
        questions = data.sort(() => Math.random() - 0.5).slice(0, 5);
        console.log(`Successfully loaded ${questions.length} ${type} questions`);
    } catch (error) {
        console.error(`Error loading ${type} quiz data:`, error);
        questions = fallbackQuestions[type] || [];
        if (questions.length === 0) {
            document.getElementById('result').textContent = `No questions available for ${type}. Please check the data files or console for details.`;
            document.getElementById('result').classList.add('text-red-500');
            document.getElementById('question').textContent = '';
            document.querySelectorAll('.option').forEach(btn => btn.style.display = 'none');
            document.getElementById('progress').textContent = '';
            return;
        } else {
            document.getElementById('result').textContent = `Failed to load ${type} data. Using ${questions.length} fallback questions. Check console for details: ${error.message}`;
            document.getElementById('result').classList.add('text-yellow-500');
            setTimeout(() => {
                document.getElementById('result').textContent = '';
                document.getElementById('result').classList.remove('text-yellow-500');
            }, 3000);
        }
    }
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
        document.getElementById('question').textContent = "No questions available. Please check the console or reload.";
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
        <a href="../dashboard/stats.html" class="cta-button inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">View Stats</a>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    const quizType = new URLSearchParams(window.location.search).get('type') || 'hiragana';
    // Highlight the active quiz type button
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