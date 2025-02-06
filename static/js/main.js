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
}); 