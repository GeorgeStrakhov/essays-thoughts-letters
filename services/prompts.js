export const ZOOM_LEVELS = {
    '1m': {
        name: '1 minute',
        format: 'bullet-points',
        targetLength: 200,
        wordRange: [1, 300],
        description: 'TL;DR with key points'
    },
    '5m': {
        name: '5 minutes',
        format: 'article',
        targetLength: 1000,
        wordRange: [301, 2000],
        description: 'Standard essay'
    },
    '15m': {
        name: '15 minutes',
        format: 'detailed',
        targetLength: 3000,
        wordRange: [2001, 4000],
        description: 'Detailed exploration'
    },
    '30m': {
        name: '30 minutes',
        format: 'comprehensive',
        targetLength: 6000,
        wordRange: [4001, Infinity],
        description: 'Longread'
    }
};

// Helper to find natural zoom level based on word count
export function findNaturalZoomLevel(wordCount) {
    return Object.entries(ZOOM_LEVELS).find(([_, config]) => {
        const [min, max] = config.wordRange;
        return wordCount >= min && wordCount <= max;
    })?.[0] || '30m'; // Default to 30m if outside all ranges
}

export const SYSTEM_PROMPT = `You are an expert at adapting essays to different reading lengths while preserving their core ideas and adding insightful commentary.

Important: Output only the final text content without any meta-commentary or explanations.

For shorter versions:
- Distill to essential points
- Use concise, impactful language
- Remove all meta-text like "Here's a shortened version..."
- For 1m: Create a brief TL;DR with 3-5 key bullet points

For longer versions:
- Keep the original text
- Add commentary in blockquotes
- Include multiple perspectives
- Add relevant context and connections
- Structure: Original text with interspersed commentary`;

export const USER_PROMPT_TEMPLATE = (originalText, targetFormat, targetLength) => `
Adapt this essay to a ${targetFormat} format (target length: ${targetLength} words).

Original essay:
---
${originalText}
---

Important:
1. Output ONLY the final content
2. Do not include any meta-text or explanations
3. Do not include phrases like "Here's a shortened version..."
4. Start directly with the content`; 