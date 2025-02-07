import postmark from 'postmark';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN);

const isDev = process.env.NODE_ENV === 'development';

/**
 * Sends an email with a markdown file attachment in production,
 * logs content in development
 * @param {string} subject - Email subject
 * @param {string} content - Markdown content
 * @param {string} filename - Name of the markdown file
 */
export async function sendMarkdownEmail(subject, content, filename) {
    if (isDev) {
        console.log('Development mode - would have sent email with:');
        console.log('Subject:', subject);
        console.log('Filename:', filename);
        console.log('Content:', content);
        return;
    }

    try {
        await client.sendEmail({
            "From": process.env.FROM_EMAIL,
            "To": process.env.ADMIN_EMAIL,
            "Subject": subject,
            "TextBody": "New essay/version has been generated.",
            "Attachments": [{
                "Name": filename,
                "Content": Buffer.from(content).toString('base64'),
                "ContentType": "text/markdown"
            }]
        });
        console.log(`Email sent successfully for ${filename}`);
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw - we don't want to break the generation process if email fails
    }
}