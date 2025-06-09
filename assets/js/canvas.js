const canvas = document.getElementById('kanji-canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = '#4CAF50';
ctx.lineWidth = 5;
ctx.lineCap = 'round';

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
    ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#333' : 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStrokeGuide();
}

// Embedded kanji data (replacing kanji.json)
const kanjiData = [
    { character: "日", strokes: ["M50,10L50,90", "M20,40H80"] },
    { character: "月", strokes: ["M50,10L50,90", "M20,40H80", "M50,50L50,90", "M20,60H80"] },
    { character: "火", strokes: ["M50,50L30,20", "M50,50L70,20", "M40,50L60,80"] }
];

let kanjiList = [...kanjiData];
let currentKanji = 0;

function drawStrokeGuide() {
    const guideCanvas = document.getElementById('stroke-guide');
    const guideCtx = guideCanvas.getContext('2d');
    guideCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
    guideCtx.strokeStyle = '#999';
    guideCtx.lineWidth = 2;
    const strokes = kanjiList[currentKanji].strokes;
    strokes.forEach(stroke => {
        const path = new Path2D(stroke);
        guideCtx.stroke(path);
    });
}

function nextKanji() {
    currentKanji = (currentKanji + 1) % kanjiList.length;
    document.getElementById('current-kanji').textContent = kanjiList[currentKanji].character;
    clearCanvas();
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('current-kanji').textContent = kanjiList[currentKanji].character;
    drawStrokeGuide();
});