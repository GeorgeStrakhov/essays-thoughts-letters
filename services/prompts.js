export const ZOOM_LEVELS = {
    '10s': {
        name: '10 seconds',
        format: 'one-liner',
        targetLength: 20, // words
        description: 'Key idea in one punchy sentence'
    },
    '1m': {
        name: '1 minute',
        format: 'bullet-points',
        targetLength: 200, // words
        description: 'TLDR with key points'
    },
    '5m': {
        name: '5 minutes',
        format: 'article',
        targetLength: 1000, // words
        description: 'Original essay'
    },
    '15m': {
        name: '15 minutes',
        format: 'detailed',
        targetLength: 3000, // words
        description: 'Detailed exploration with commentary'
    },
    '30m': {
        name: '30 minutes',
        format: 'comprehensive',
        targetLength: 6000, // words
        description: 'Comprehensive analysis'
    },
    '1h': {
        name: '1 hour',
        format: 'extensive',
        targetLength: 12000, // words
        description: 'Deep dive with extensive commentary'
    }
};

export const SYSTEM_PROMPT = `You are an expert at adapting essays to different reading lengths while preserving their core ideas and adding insightful commentary.

Important: Output only the final text content without any meta-commentary or explanations.

For shorter versions:
- Distill to essential points
- Use concise, impactful language
- Remove all meta-text like "Here's a shortened version..."
- For 10s: Create exactly one powerful sentence
- For 1m: Create a brief TLDR with key bullet points

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