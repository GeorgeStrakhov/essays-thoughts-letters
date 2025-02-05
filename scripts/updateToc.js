import fs from 'fs/promises';
import path from 'path';
import { ZOOM_LEVELS } from '../services/prompts.js';

// Helper to count words in text
function countWords(text) {
    return text.trim().split(/\s+/).length;
}

async function updateToc() {
    // Read current TOC
    const tocPath = './toc.json';
    const toc = JSON.parse(await fs.readFile(tocPath, 'utf8'));
    
    // Process each essay
    for (const essay of toc) {
        const essayDir = `./essays/${essay.slug}`;
        
        // Initialize versions object if it doesn't exist
        essay.versions = essay.versions || {};
        
        // Check each possible version
        for (const [zoomLevel, config] of Object.entries(ZOOM_LEVELS)) {
            const versionPath = zoomLevel === '5m' 
                ? path.join(essayDir, `${essay.slug}.md`)
                : path.join(essayDir, `${essay.slug}.${zoomLevel}.md`);
            
            try {
                const content = await fs.readFile(versionPath, 'utf8');
                
                // Update version info
                essay.versions[zoomLevel] = {
                    ...essay.versions[zoomLevel], // Preserve existing metadata like isHumanVetted
                    wordCount: countWords(content),
                    isOriginal: zoomLevel === '5m'
                };
                
                console.log(`Updated ${essay.slug} ${zoomLevel} version`);
            } catch (err) {
                // Version doesn't exist, remove it from versions if it was there
                delete essay.versions[zoomLevel];
            }
        }
    }
    
    // Write updated TOC
    await fs.writeFile(tocPath, JSON.stringify(toc, null, 2));
    console.log('TOC updated successfully');
}

updateToc().catch(console.error); 