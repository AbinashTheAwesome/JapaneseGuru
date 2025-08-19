const canvas = document.getElementById('kanji-canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Initialize canvas
ctx.fillStyle = 'white'; // Matches main.css #kanji-canvas background
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(); // Use --primary from main.css
ctx.lineWidth = 5;
ctx.lineCap = 'round';

// Event listeners for drawing
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
canvas.addEventListener('touchstart', handleTouchStart);
canvas.addEventListener('touchmove', handleTouchMove);
canvas.addEventListener('touchend', stopDrawing);

document.getElementById('clear-btn').addEventListener('click', clearCanvas);
document.getElementById('next-kanji').addEventListener('click', nextKanji);

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function handleTouchStart(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    [lastX, lastY] = [touch.clientX - rect.left, touch.clientY - rect.top];
    isDrawing = true;
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const [x, y] = [touch.clientX - rect.left, touch.clientY - rect.top];
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    [lastX, lastY] = [x, y];
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    ctx.fillStyle = theme === 'dark' ? '#333' : 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

let kanjiList = [];
let currentKanji = 0;

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.color = 'red';
}

async function loadKanji() {
    try {
        const response = await fetch('../assets/data/kanji.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        kanjiList = await response.json();
        console.log('Loaded kanji count:', kanjiList.length); // Debug log
        if (kanjiList.length === 0) {
            throw new Error('Kanji data is empty');
        }
    } catch (error) {
        console.error('Error loading kanji data:', error);
        showError('Failed to load kanji data. Using default set.');
        kanjiList = [
            { character: '日', meaning: 'sun / day' },
            { character: '月', meaning: 'moon / month' },
            { character: '火', meaning: 'fire' }
        ];
    }
    document.getElementById('current-kanji').textContent = kanjiList[currentKanji].character;
    document.getElementById('kanji-meaning').textContent = `(${kanjiList[currentKanji].meaning})`;
}

function nextKanji() {
    currentKanji = (currentKanji + 1) % kanjiList.length;
    document.getElementById('current-kanji').textContent = kanjiList[currentKanji].character;
    document.getElementById('kanji-meaning').textContent = `(${kanjiList[currentKanji].meaning})`;
    clearCanvas();
}

document.addEventListener('DOMContentLoaded', loadKanji);