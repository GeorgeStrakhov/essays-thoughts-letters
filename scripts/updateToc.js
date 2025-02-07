import fs from 'fs/promises';
import path from 'path';
import { ZOOM_LEVELS, findNaturalZoomLevel } from '../services/prompts.js';

// Helper to count words in text
function countWords(text) {
    return text.trim().split(/\s+/).length;
}

// Helper to unslugify text to title case
function unslugify(slug) {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Helper to generate timestamp in required format (YYMMDD with '020' prefix)
function generateTimestamp() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `020${year}${month}${day}`;
}

async function updateToc() {
    // Read current TOC
    const tocPath = './toc.json';
    const toc = JSON.parse(await fs.readFile(tocPath, 'utf8'));
    
    // Get all directories in essays folder
    const essaysDir = './essays';
    const essayDirs = await fs.readdir(essaysDir, { withFileTypes: true });
    const existingSlugs = new Set(toc.map(essay => essay.slug));
    
    // Find new essays
    for (const dir of essayDirs) {
        if (!dir.isDirectory()) continue;
        
        const slug = dir.name;
        if (existingSlugs.has(slug)) continue;
        
        // Found a new essay directory
        const originalPath = path.join(essaysDir, slug, `${slug}.md`);
        try {
            const content = await fs.readFile(originalPath, 'utf8');
            const wordCount = countWords(content);
            const naturalZoomLevel = findNaturalZoomLevel(wordCount);
            
            // Create new essay entry with auto-generated title and timestamp
            const newEssay = {
                title: unslugify(slug),
                slug,
                timestamp: generateTimestamp(),
                versions: {
                    [naturalZoomLevel]: {
                        wordCount,
                        isOriginal: true
                    }
                },
                naturalZoomLevel
            };
            
            toc.push(newEssay);
            console.log(`Added new essay: ${slug}`);
        } catch (err) {
            console.error(`Error processing new essay ${slug}: ${err.message}`);
        }
    }

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
            
            // Calculate natural zoom level if not already set
            if (!essay.naturalZoomLevel) {
                essay.naturalZoomLevel = findNaturalZoomLevel(wordCount);
                console.log(`Natural zoom level for ${essay.slug}: ${essay.naturalZoomLevel}`);
            }
            
            // Add or update the original version at its natural zoom level
            const existingVersion = essay.versions[essay.naturalZoomLevel] || {};
            essay.versions[essay.naturalZoomLevel] = {
                ...existingVersion,
                wordCount,
                isOriginal: true,
                // Preserve isAIGenerated if it was set
                ...(existingVersion.isAIGenerated && { isAIGenerated: true })
            };
            
            // If the essay is AI-generated, mark it at the top level
            if (existingVersion.isAIGenerated) {
                essay.isAIGenerated = true;
            }
            
            console.log(`Updated ${essay.slug} original version (${wordCount} words)`);
            
            // Then process other versions
            for (const [zoomLevel, config] of Object.entries(ZOOM_LEVELS)) {
                if (zoomLevel === essay.naturalZoomLevel) continue;
                
                const versionPath = path.join(essayDir, `${essay.slug}.${zoomLevel}.md`);
                try {
                    const versionContent = await fs.readFile(versionPath, 'utf8');
                    const versionWordCount = countWords(versionContent);
                    
                    // Preserve existing version metadata while updating
                    const existingVersionData = essay.versions[zoomLevel] || {};
                    essay.versions[zoomLevel] = {
                        ...existingVersionData,
                        wordCount: versionWordCount,
                        isOriginal: false,
                        // Only set isHumanVetted if it exists in the file system
                        ...(existingVersionData.isHumanVetted && {
                            isHumanVetted: true,
                            vettedTimestamp: existingVersionData.vettedTimestamp || essay.timestamp
                        })
                    };
                    
                    console.log(`Updated ${essay.slug} ${zoomLevel} version (${versionWordCount} words)`);
                } catch (err) {
                    // If version doesn't exist in filesystem but exists in TOC,
                    // preserve it but update isOriginal flag
                    if (essay.versions[zoomLevel]) {
                        essay.versions[zoomLevel] = {
                            ...essay.versions[zoomLevel],
                            isOriginal: false
                        };
                    }
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