document.addEventListener('DOMContentLoaded', function() {
    // This will handle all audio buttons dynamically
    document.addEventListener('click', function(e) {
        if (e.target.closest('[id^="playAudio"]')) {
            const button = e.target.closest('[id^="playAudio"]');
            const index = button.id.replace('playAudio', '');
            const audio = document.getElementById(`hiraganaAudio${index}`);
            
            if (audio.paused) {
                audio.play();
                button.innerHTML = '<i class="fas fa-pause"></i><span class="sr-only">Pause pronunciation</span>';
            } else {
                audio.pause();
                audio.currentTime = 0;
                button.innerHTML = '<i class="fas fa-volume-up"></i><span class="sr-only">Play pronunciation</span>';
            }
            
            audio.addEventListener('ended', function() {
                button.innerHTML = '<i class="fas fa-volume-up"></i><span class="sr-only">Play pronunciation</span>';
            }, { once: true });
        }
    });
});