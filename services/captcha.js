import fetch from 'node-fetch';

export async function verifyCaptcha(token) {
    try {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
        });
        
        return await response.json();
    } catch (error) {
        console.error('Error verifying captcha:', error);
        throw error;
    }
} 