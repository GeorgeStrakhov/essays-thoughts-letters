import OpenAI from "openai";
import dotenv from 'dotenv';

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
 * @param {string} [model="anthropic/claude-3-sonnet"] - The model to use
 * @param {number} [temperature=0.7] - Temperature for response randomness
 * @returns {Promise<string>} The assistant's response
 */
export async function getChatCompletion(
    systemPrompt,
    userMessage,
    model = "anthropic/claude-3-sonnet",
    temperature = 0.7
) {
    try {
        const completion = await openai.chat.completions.create({
            model: model,
            temperature: temperature,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: userMessage
                }
            ]
        });

        // Return just the message content
        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error in LLM service:", error);
        throw new Error("Failed to get chat completion");
    }
}

// Example usage:
// import { getChatCompletion } from '../services/llm.js';
//
// const response = await getChatCompletion(
//     "You are a helpful assistant",
//     "What is the meaning of life?",
//     "anthropic/claude-3-opus",
//     0.7
// );
