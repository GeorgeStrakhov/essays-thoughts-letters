document.addEventListener('DOMContentLoaded', function() {
    const zoomCloseButton = document.querySelector('.zoom-close');
    
    if (zoomCloseButton) {
        zoomCloseButton.addEventListener('click', function(e) {
            e.preventDefault();
            const zoomControl = document.querySelector('.zoom-control');
            if (zoomControl) {
                zoomControl.classList.add('hidden');
            }
        });
    }

    // AI essays toggle
    const toggleButtons = document.querySelectorAll('.toggle-ai-btn');
    const toggleAllButton = document.querySelector('.toggle-all-ai-btn');
    const aiEssays = document.querySelectorAll('.ai-essay');

    // Hide AI essays by default
    aiEssays.forEach(essay => {
        essay.classList.add('hidden');
    });

    // Individual toggle buttons
    toggleButtons.forEach(button => {
        button.textContent = ' (show robowritten too)';
        
        button.addEventListener('click', function() {
            const isHidden = aiEssays[0]?.classList.contains('hidden');
            
            aiEssays.forEach(essay => {
                essay.classList.toggle('hidden');
            });

            // Update all button texts
            updateButtonTexts(!isHidden);
        });
    });

    // Global toggle button
    if (toggleAllButton) {
        toggleAllButton.addEventListener('click', function() {
            const isHidden = aiEssays[0]?.classList.contains('hidden');
            
            aiEssays.forEach(essay => {
                essay.classList.toggle('hidden');
            });

            // Update all button texts
            updateButtonTexts(!isHidden);
            
            // Update global toggle button text
            this.textContent = isHidden ? 
                'Hide AI-generated essays' : 
                'Show AI-generated essays';
        });
    }

    function updateButtonTexts(isHidden) {
        toggleButtons.forEach(btn => {
            btn.textContent = isHidden ? 
                ' (show robowritten too)' : 
                ' (hide robowritten)';
        });
    }

    // Add zoom slider toggle functionality
    const showSizesLink = document.querySelector('.show-sizes-link');
    const zoomStuff = document.querySelector('.zoom-stuff');
    
    if (showSizesLink && zoomStuff) {
        showSizesLink.addEventListener('click', function(e) {
            e.preventDefault();
            zoomStuff.classList.toggle('hidden');
            this.textContent = zoomStuff.classList.contains('hidden') ? 'Show other sizes' : 'Hide other sizes';
        });
    }

    // AI essays control close button
    const aiEssaysControl = document.querySelector('.ai-essays-control');
    const aiCloseButton = aiEssaysControl?.querySelector('.zoom-close');
    
    if (aiCloseButton) {
        aiCloseButton.addEventListener('click', function() {
            aiEssaysControl.classList.add('hidden');
        });
    }
}); 