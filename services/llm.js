import OpenAI from "openai";
import dotenv from "dotenv";
import { getReferenceCorpus } from './corpus.js';
import fs from 'fs';
import { NEW_ESSAY_PROMPTS, SYSTEM_PROMPTS } from './prompts.js';
import path from 'path';
import { sendMarkdownEmail } from './email.js';

// Load environment variables
dotenv.config();

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
});

const DEFAULT_MODEL = "anthropic/claude-3.5-sonnet";
//const DEFAULT_MODEL = "google/gemini-2.0-flash-001";
const FALLBACK_MODEL = "google/gemini-2.0-flash-001";
const DEFAULT_TEMPERATURE = 0.7;

/**
 * Get a chat completion from the LLM
 * @param {string} systemPrompt - The system prompt to set context
 * @param {string} userMessage - The user's message
 * @param {string} currentSlug - The slug of the essay being processed
 * @returns {Promise<string>} The assistant's response
 */
export async function getVersion(
    systemPrompt,
    userMessage,
    currentSlug,
    originalContent = null
) {
    const MAX_RETRIES = 3;
    let currentTry = 0;
    let lastError = null;

    // Determine if this is a long-form content request (30m)
    const contentLength = userMessage.match(/(\d+)m/)?.[1] + 'm';
    
    // Choose initial model based on content length
    let currentModel = contentLength === '30m' ? FALLBACK_MODEL : DEFAULT_MODEL;
    
    console.log(`[LLM] Starting getVersion for ${currentSlug}`);
    console.log(`[LLM] Initial model: ${currentModel}`);

    while (currentTry < MAX_RETRIES) {
        try {
            console.log(`[LLM] Attempt ${currentTry + 1}/${MAX_RETRIES}`);
            
            const referenceEssays = originalContent !== null ? 
                await getReferenceCorpus(currentSlug) : 
                await getReferenceCorpus();
            
            console.log(`[LLM] Got ${referenceEssays.length} reference essays`);

            const messages = [
                { role: "system", content: systemPrompt }
            ];

            // Add reference essays as examples
            for (const essay of referenceEssays) {
                messages.push({
                    role: "user",
                    content: `REFERENCE STYLE AND CONTENT FROM "${essay.slug}":\n\n${essay.content}`
                });
            }

            messages.push({
                role: "user",
                content: userMessage
            });

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 120000);

            console.log(`[LLM] Making API call with model: ${currentModel}`);
            
            const completion = await openai.chat.completions.create({
                model: currentModel,
                temperature: DEFAULT_TEMPERATURE,
                messages: messages,
                max_tokens: 30000
            }, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            console.log(`[LLM] Successfully got response`);

            const response = completion.choices[0].message.content;
            
            // Extract zoom level from the system prompt by matching it with SYSTEM_PROMPTS
            const contentLength = Object.entries(SYSTEM_PROMPTS)
                .find(([_, prompt]) => prompt === systemPrompt)?.[0] || '5m';
            
            const filename = `${currentSlug}${contentLength ? `.${contentLength}` : ''}.md`;
            const emailSubject = originalContent !== null ?
                `New Version Generated: ${currentSlug} (${contentLength})` :
                `New Essay Generated: ${currentSlug} (${contentLength})`;
                
            await sendMarkdownEmail(
                emailSubject,
                response,
                filename
            );

            return response;

        } catch (error) {
            lastError = error;
            console.error(`[LLM] Error on attempt ${currentTry + 1}:`, error);

            // Switch to fallback model if we're using the default model
            if (currentModel === DEFAULT_MODEL) {
                console.log(`[LLM] Switching to fallback model: ${FALLBACK_MODEL}`);
                currentModel = FALLBACK_MODEL;
            }

            currentTry++;
            
            if (currentTry < MAX_RETRIES) {
                console.log(`[LLM] Retrying in 2 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
            }
        }
    }

    console.error(`[LLM] All retry attempts failed`);
    throw lastError || new Error('Failed to get LLM response after all retries');
}

/**
 * Get a refined chat completion using a two-pass approach
 * @param {string} systemPrompt - The system prompt for the first pass
 * @param {string} userMessage - The user's message for the first pass
 * @param {string} currentSlug - The slug of the essay being processed
 * @param {string} originalContent - The original content
 * @param {string} [model="google/gemini-2.0-flash-001"] - The model to use
 * @param {number} [temperature=0.7] - Temperature for response randomness
 * @returns {Promise<string>} The refined assistant's response
 */
export async function getRefinedChatCompletion(
    systemPrompt,
    userMessage,
    currentSlug,
    originalContent,
    //model = "google/gemini-2.0-flash-001",
    model = "anthropic/claude-3.5-sonnet",
    temperature = 0.4
) {
    try {
        const result = await getChatCompletion(
            systemPrompt,
            userMessage,
            currentSlug,
            originalContent,
            model,
            temperature
        );

        return result;

    } catch (error) {
        console.error("Error in LLM refinement service:", error);
        throw new Error("Failed to get refined chat completion");
    }
}

// Add new function for generating complete essays
export async function generateNewEssay(slug) {
    const topic = slug.replace(/-/g, ' ');

    console.log(`Generating new essay for ${slug}`);
    
    try {
        const essayContent = await getVersion(
            NEW_ESSAY_PROMPTS.system,
            NEW_ESSAY_PROMPTS.user(topic),
            slug,
            null  // This indicates it's a new essay
        );

        // Create essay directory
        const essayDir = `./essays/${slug}`;
        await fs.promises.mkdir(essayDir, { recursive: true });

        // Save the essay
        const essayPath = `${essayDir}/${slug}.md`;
        await fs.promises.writeFile(essayPath, essayContent);

        // Calculate word count
        const wordCount = essayContent.trim().split(/\s+/).length;

        // Create and add TOC entry
        const newEssay = {
            title: slug.replace(/-/g, ' ')
                .replace(/\b\w/g, l => l.toUpperCase()),
            slug: slug,
            timestamp: formatCurrentDate(),
            versions: {
                "5m": {
                    wordCount: wordCount,
                    isOriginal: true,
                    isAIGenerated: true
                }
            },
            naturalZoomLevel: '5m',
            isAIGenerated: true
        };

        // Update TOC with word count
        const tocPath = path.join(process.cwd(), 'toc.json');
        const toc = JSON.parse(await fs.promises.readFile(tocPath, 'utf-8'));
        
        toc.push(newEssay);
        await fs.promises.writeFile(tocPath, JSON.stringify(toc, null, 2));
        console.log(`Added new essay to TOC: ${slug} with ${wordCount} words`);

        // Send email notification for new essay
        await sendMarkdownEmail(
            `New Essay Generated: ${slug}`,
            essayContent,
            `${slug}.md`
        );

        return true;
    } catch (error) {
        console.error('Error generating essay:', error);
        throw error;
    }
}

function formatCurrentDate() {
    const now = new Date();
    return '0' + now.getFullYear() +
           String(now.getMonth() + 1).padStart(2, '0') +
           String(now.getDate()).padStart(2, '0');
}

