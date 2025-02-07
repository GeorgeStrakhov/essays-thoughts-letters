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
    const toggleButton = document.getElementById('toggle-ai');
    if (toggleButton) {
        const aiEssays = document.querySelectorAll('.ai-essay');

        toggleButton.addEventListener('click', function() {
            const isHidden = aiEssays[0]?.classList.contains('hidden');
            
            aiEssays.forEach(essay => {
                essay.classList.toggle('hidden');
            });

            // Update button text and save preference
            toggleButton.textContent = isHidden ? 
                'Hide AI-generated essays' : 
                'Show AI-generated essays';
        });
    }
}); 