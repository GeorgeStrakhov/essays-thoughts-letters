import OpenAI from "openai";
import dotenv from "dotenv";
import { getReferenceCorpus } from './corpus.js';
import { SYSTEM_PROMPT, REFINEMENT_PROMPT, REFINEMENT_USER_TEMPLATE } from './prompts.js';

// Load environment variables
dotenv.config();

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
});

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
export async function getChatCompletion(
    systemPrompt,
    userMessage,
    currentSlug,
    originalContent,
    //model = "google/gemini-2.0-flash-001",
    model = "anthropic/claude-3.5-sonnet",
    temperature = 0.7
) {
    try {
        // Get reference essays
        const referenceEssays = await getReferenceCorpus(currentSlug);

        // Construct messages array
        const messages = [
            {
                role: "system",
                content: systemPrompt
            }
        ];

        // Add reference essays as user messages
        for (const essay of referenceEssays) {
            messages.push({
                role: "user",
                content: `REFERENCE STYLE AND CONTENT FROM "${essay.slug}":\n\n${essay.content}`
            });
        }

        // Add the final instruction
        messages.push({
            role: "user",
            content: userMessage
        });

        //console.log(messages);

        const completion = await openai.chat.completions.create({
            model: model,
            temperature: 0.2,
            messages: messages
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error in LLM service:", error);
        throw new Error("Failed to get chat completion");
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
    temperature = 0.5
) {
    try {
        // First pass - get initial adaptation
        const firstPassResult = await getChatCompletion(
            systemPrompt,
            userMessage,
            currentSlug,
            originalContent,
            model,
            temperature
        );

        /*
        const targetLengthMatch = userMessage.match(/target length: (\d+)/i);
        const targetLength = targetLengthMatch ? targetLengthMatch[1] : null;

        // Second pass - refinement
        const refinementMessages = [
            {
                role: "system",
                content: REFINEMENT_PROMPT
            },
            {
                role: "user",
                content: REFINEMENT_USER_TEMPLATE(originalContent, firstPassResult, targetLength)
            }
        ];

        const refinementCompletion = await openai.chat.completions.create({
            model: model,
            temperature: temperature,
            messages: refinementMessages
        });

        return refinementCompletion.choices[0].message.content;
        */
       return firstPassResult;

    } catch (error) {
        console.error("Error in LLM refinement service:", error);
        throw new Error("Failed to get refined chat completion");
    }
}

