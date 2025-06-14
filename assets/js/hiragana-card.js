document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('hiraganaContainer');
    
    hiraganaData.forEach((charData, index) => {
        const card = document.createElement('div');
        card.className = 'bg-gray-800 p-4 rounded-lg shadow-lg relative';
        card.innerHTML = `
            <button id="playAudio${index}" class="absolute top-3 right-3 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-all">
                <i class="fas fa-volume-up"></i>
                <span class="sr-only">Play pronunciation</span>
            </button>
            <audio id="hiraganaAudio${index}">
                <source src="../assets/audio/${charData.audio}" type="audio/mpeg">
            </audio>
            
            <h3 class="text-lg font-medium mb-4">Hiragana ${charData.char}</h3>
            <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div class="text-center flex-1 flex flex-col items-center">
                    <img src="../assets/images/hiragana/${charData.imgStatic}" alt="Hiragana '${charData.romaji}' character" 
                        class="w-full max-w-[200px] h-auto object-contain">
                    <p class="mt-2 text-sm">${charData.char} (${charData.romaji})</p>
                </div>
                <div class="text-center flex-1 flex flex-col items-center">
                    <img src="../assets/images/hiragana/${charData.imgGif}" alt="Hiragana '${charData.romaji}' writing animation" 
                        class="w-full max-w-[200px] h-auto object-contain">
                    <p class="mt-2 text-sm">${charData.romaji}</p> <!-- Changed from "A" to dynamic romaji -->
                </div>
            </div>
        `;
        container.appendChild(card);
    });
});