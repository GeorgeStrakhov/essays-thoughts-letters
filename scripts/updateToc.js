import fs from 'fs/promises';
import path from 'path';
import { ZOOM_LEVELS, findNaturalZoomLevel } from '../services/prompts.js';

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
        
        // First, find and process the original .md file
        const originalPath = path.join(essayDir, `${essay.slug}.md`);
        try {
            const content = await fs.readFile(originalPath, 'utf8');
            const wordCount = countWords(content);
            
            // Calculate natural zoom level first
            essay.naturalZoomLevel = findNaturalZoomLevel(wordCount);
            console.log(`Natural zoom level for ${essay.slug}: ${essay.naturalZoomLevel}`);
            
            // Add the original version at its natural zoom level
            essay.versions[essay.naturalZoomLevel] = {
                wordCount,
                isOriginal: true
            };
            
            console.log(`Updated ${essay.slug} original version (${wordCount} words)`);
            
            // Then process other versions
            for (const [zoomLevel, config] of Object.entries(ZOOM_LEVELS)) {
                if (zoomLevel === essay.naturalZoomLevel) continue; // Skip natural zoom level as we already processed it
                
                const versionPath = path.join(essayDir, `${essay.slug}.${zoomLevel}.md`);
                try {
                    const versionContent = await fs.readFile(versionPath, 'utf8');
                    const versionWordCount = countWords(versionContent);
                    
                    // Any .{time}.md file in the repo is human-vetted
                    essay.versions[zoomLevel] = {
                        wordCount: versionWordCount,
                        isOriginal: false,
                        isHumanVetted: true,
                        vettedTimestamp: essay.timestamp
                    };
                    
                    console.log(`Updated ${essay.slug} ${zoomLevel} version (${versionWordCount} words)`);
                } catch (err) {
                    // Version doesn't exist, remove it from versions if it was there
                    delete essay.versions[zoomLevel];
                }
            }
        } catch (err) {
            console.error(`Error processing ${essay.slug}: ${err.message}`);
        }
    }
    
    // Write updated TOC
    await fs.writeFile(tocPath, JSON.stringify(toc, null, 2));
    console.log('TOC updated successfully');
}

updateToc().catch(console.error); 