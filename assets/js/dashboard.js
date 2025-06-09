document.addEventListener('DOMContentLoaded', () => {
    const progress = loadProgress();
    const flashcardProgress = loadFlashcardProgress();
    const totalFlashcards = Object.keys(flashcardProgress).length || 1;
    const learnedFlashcards = Object.values(flashcardProgress).filter(v => v).length;

    // Update stats display
    const stats = document.getElementById('stats');
    stats.innerHTML = `
        <h2 class="text-xl font-bold">Your Progress</h2>
        <p>Hiragana Quiz: ${progress.hiragana || 0}%</p>
        <p>Katakana Quiz: ${progress.katakana || 0}%</p>
        <p>Flashcards Learned: ${learnedFlashcards}/${totalFlashcards}</p>
    `;

    // Render progress chart
    const ctx = document.getElementById('progress-chart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Hiragana', 'Katakana', 'Flashcards Learned'],
            datasets: [{
                label: 'Progress (%)',
                data: [
                    progress.hiragana || 0,
                    progress.katakana || 0,
                    (learnedFlashcards / totalFlashcards) * 100
                ],
                backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'],
                borderColor: ['#388E3C', '#1976D2', '#F57C00'],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: 'Progress (%)' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
});