document.addEventListener('DOMContentLoaded', function() {
    const closeButton = document.querySelector('.zoom-close');
    
    if (closeButton) {
        closeButton.addEventListener('click', function(e) {
            e.preventDefault();
            const zoomControl = document.querySelector('.zoom-control');
            if (zoomControl) {
                zoomControl.classList.add('hidden');
            }
        });
    }

    // AI essays toggle
    const toggleButtons = document.querySelectorAll('.toggle-ai-btn');
    const aiEssays = document.querySelectorAll('.ai-essay');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isHidden = aiEssays[0]?.classList.contains('hidden');
            
            aiEssays.forEach(essay => {
                essay.classList.toggle('hidden');
            });

            // Update all button texts
            toggleButtons.forEach(btn => {
                btn.textContent = isHidden ? 
                    ' (hide all robo-written)' : 
                    ' (show all robo-written)';
            });
        });
    });
}); 