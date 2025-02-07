import OpenAI from "openai";
import dotenv from "dotenv";
import { getReferenceCorpus } from './corpus.js';

// Load environment variables
dotenv.config();

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
});

const DEFAULT_MODEL = "anthropic/claude-3.5-sonnet";
const FALLBACK_MODEL = "google/gemini-2.0-flash-001";
const DEFAULT_TEMPERATURE = 0.4;

/**
 * Get a chat completion from the LLM
 * @param {string} systemPrompt - The system prompt to set context
 * @param {string} userMessage - The user's message
 * @param {string} currentSlug - The slug of the essay being processed
 * @param {string} originalContent - The content to be modified
 * @param {string} [model="google/gemini-2.0-flash-001"] - The model to use
 * @param {number} [temperature=0.7] - Temperature for response randomness
 * @returns {Promise<string>} The assistant's response
 */
export async function getVersion(
    systemPrompt,
    userMessage,
    currentSlug,
    model = DEFAULT_MODEL,
    temperature = DEFAULT_TEMPERATURE
) {
    // Use Gemini by default for 30min versions
    if (userMessage.includes("30 min version")) {
        model = FALLBACK_MODEL;
        console.log("Using Gemini model for 30min version");
    }
    
    const MAX_RETRIES = 3;
    const TIMEOUT = 120000; // 2 minutes timeout
    let currentModel = model;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`Attempt ${attempt} of ${MAX_RETRIES} using model: ${currentModel}`);

            // Get reference essays
            const referenceEssays = await getReferenceCorpus(currentSlug);

            // Construct messages array with zoom-specific system prompt
            const messages = [
                {
                    role: "system",
                    content: systemPrompt
                }
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
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

            const completion = await openai.chat.completions.create({
                model: currentModel,
                temperature: temperature,
                messages: messages
            }, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return completion.choices[0].message.content;

        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);
            
            if (error.name === 'AbortError') {
                console.log('Request timed out');
            }
            
            // Switch to fallback model after first failure if using default model
            if (attempt === 1 && currentModel === DEFAULT_MODEL) {
                console.log(`Switching to fallback model: ${FALLBACK_MODEL}`);
                currentModel = FALLBACK_MODEL;
                continue; // Skip the retry delay for model switch
            }
            
            if (attempt === MAX_RETRIES) {
                throw new Error(`Failed after ${MAX_RETRIES} attempts: ${error.message}`);
            }
            
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
        }
    }
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

