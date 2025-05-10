document.addEventListener('DOMContentLoaded', function() {
    // Define reCAPTCHA callback globally
    window.onRecaptchaLoad = function() {
        const generateButton = document.getElementById('generate-essay');
        if (generateButton) {
            grecaptcha.render('captcha-container', {
                'sitekey': '6Lcd0M8qAAAAAIcq38vEPUsdZ9clKiunuZAF_cy8',
                'callback': function(token) {
                    generateButton.disabled = false;
                },
                'expired-callback': function() {
                    generateButton.disabled = true;
                }
            });
        }
    };

    // 404 generation code
    const generateButton = document.getElementById('generate-essay');
    if (generateButton) {
        generateButton.addEventListener('click', async function() {
            const token = grecaptcha.getResponse();
            if (!token) return;

            const slug = window.location.pathname.split('/')[1];
            
            try {
                generateButton.disabled = true;
                const response = await fetch(`/generate-essay/${slug}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        captchaToken: token,
                        slug: slug
                    })
                });

                if (response.ok) {
                    // Update button text to show generating state
                    generateButton.textContent = 'Starting generation...';
                    generateButton.disabled = true;
                    
                    // Fade out the captcha and button
                    const aiGenerateSection = document.querySelector('.ai-generate-section');
                    aiGenerateSection.style.opacity = '0.5';
                    aiGenerateSection.style.transition = 'opacity 0.3s';
                    
                    // Show generating state
                    setTimeout(() => {
                        aiGenerateSection.innerHTML = `
                            <div class="generating-state">
                                <h2>Writing a new essay...</h2>
                                <p>This may take a few minutes. The page will refresh automatically when it's ready.</p>
                                <div class="loading-animation">
                                    <div class="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                                <p class="generation-time">Usually takes 1-2 minutes</p>
                            </div>
                        `;
                        aiGenerateSection.style.opacity = '1';
                        
                        // Start polling for completion
                        const checkStatus = async () => {
                            try {
                                const response = await fetch(`/${slug}/check-version?zoom=medium`);
                                const data = await response.json();
                                if (data.exists) {
                                    window.location.href = `/${slug}/`;
                                }
                            } catch (error) {
                                console.error('Error checking status:', error);
                            }
                        };
                        
                        // Poll every 2 seconds
                        const interval = setInterval(checkStatus, 2000);
                        
                        // Stop polling after 5 minutes
                        setTimeout(() => {
                            clearInterval(interval);
                        }, 300000);
                    }, 800);
                } else {
                    throw new Error('Generation failed');
                }
            } catch (error) {
                console.error('Error:', error);
                generateButton.disabled = false;
                grecaptcha.reset();
            }
        });
    }
}); 