document.addEventListener('DOMContentLoaded', function() {
    const playButton = document.getElementById('playAudio');
    const audio = document.getElementById('hiraganaAudio');
    const errorMessage = document.getElementById('error-message');
    
    // First, try to load the audio
    audio.load().catch(e => {
        console.error("Audio loading failed:", e);
        errorMessage.textContent = "Error loading audio file. Please check your connection.";
    });
    
    playButton.addEventListener('click', async function() {
        try {
            if (audio.paused) {
                await audio.play();
                playButton.innerHTML = '<i class="fas fa-pause"></i><span class="sr-only">Pause pronunciation</span>';
                errorMessage.textContent = "";
            } else {
                audio.pause();
                audio.currentTime = 0;
                playButton.innerHTML = '<i class="fas fa-volume-up"></i><span class="sr-only">Play pronunciation</span>';
            }
        } catch (error) {
            console.error("Audio playback failed:", error);
            errorMessage.textContent = "Error playing audio. Please click the button again.";
        }
    });
    
    audio.addEventListener('ended', function() {
        playButton.innerHTML = '<i class="fas fa-volume-up"></i><span class="sr-only">Play pronunciation</span>';
    });
});