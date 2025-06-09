const quizData = [
    {
        question: "What is the hiragana for 'a'?",
        options: ["あ", "い", "う", "え"],
        answer: "あ"
    },
    {
        question: "How do you say 'thank you' in Japanese?",
        options: ["こんにちは", "ありがとう", "おはよう", "じゃあね"],
        answer: "ありがとう"
    },
    {
        question: "What does 'neko' mean in Japanese?",
        options: ["Dog", "Cat", "Bird", "Fish"],
        answer: "Cat"
    }
];

let currentQuestion = 0;
let score = 0;

const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const submitButton = document.getElementById('submit');
const nextButton = document.getElementById('next');
const restartButton = document.getElementById('restart');
const resultElement = document.getElementById('result');
const scoreElement = document.getElementById('score');

function loadQuestion() {
    const q = quizData[currentQuestion];
    questionElement.textContent = q.question;
    optionsElement.innerHTML = '';
    q.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('w-full', 'bg-gray-200', 'py-2', 'rounded', 'option-button');
        button.addEventListener('click', () => selectOption(button, option));
        optionsElement.appendChild(button);
    });
    submitButton.classList.remove('hidden');
    nextButton.classList.add('hidden');
    resultElement.textContent = '';
}

function selectOption(button, selected) {
    optionsElement.querySelectorAll('button').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
}

function checkAnswer() {
    const selected = optionsElement.querySelector('.selected');
    if (!selected) {
        resultElement.textContent = 'Please select an option!';
        resultElement.classList.add('text-red-500');
        return;
    }
    const q = quizData[currentQuestion];
    if (selected.textContent === q.answer) {
        resultElement.textContent = 'Correct!';
        resultElement.classList.add('text-green-500');
        score++;
    } else {
        resultElement.textContent = `Incorrect. The correct answer is ${q.answer}.`;
        resultElement.classList.add('text-red-500');
    }
    scoreElement.textContent = `Score: ${score}/${quizData.length}`;
    submitButton.classList.add('hidden');
    if (currentQuestion < quizData.length - 1) {
        nextButton.classList.remove('hidden');
    } else {
        restartButton.classList.remove('hidden');
    }
}

submitButton.addEventListener('click', checkAnswer);

optionsElement.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        selectOption(e.target, e.target.textContent);
    }
});

nextButton.addEventListener('click', () => {
    currentQuestion++;
    loadQuestion();
});

restartButton.addEventListener('click', () => {
    currentQuestion = 0;
    score = 0;
    scoreElement.textContent = `Score: ${score}/${quizData.length}`;
    restartButton.classList.add('hidden');
    loadQuestion();
});

loadQuestion();