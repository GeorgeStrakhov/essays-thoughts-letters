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
    
    let hasChanges = false;
    
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
            
            // Look for description in the content (first paragraph)
            const description = content
                .split('\n\n')[0]
                .split('---')[1]?.trim() ||  // Try to get subtitle after em dash
                content
                    .split('\n\n')[0]        // Otherwise get first paragraph
                    .replace(/[#*_`]/g, '')  // Remove markdown formatting
                    .replace(/^#+\s*/, '')   // Remove header markers
                    .trim();
            
            // Look for featured image in content
            const featuredImageMatch = content.match(/!\[.*?\]\((.*?)\)/);
            const featuredImage = featuredImageMatch ? 
                featuredImageMatch[1].startsWith('./') ?
                    `/${slug}${featuredImageMatch[1].slice(1)}` :  // Convert relative to absolute
                    featuredImageMatch[1] :                         // Keep absolute URLs as is
                '';
            
            // Create new essay entry
            const newEssay = {
                title: unslugify(slug),
                ...(description && { description }),
                ...(featuredImage && { featured_image: featuredImage }),
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
            hasChanges = true;
            console.log(`Added new essay: ${slug}`);
        } catch (err) {
            console.error(`Error processing new essay ${slug}: ${err.message}`);
        }
    }

    // Process existing essays (rest of the code remains the same)
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
                hasChanges = true;
                console.log(`Natural zoom level for ${essay.slug}: ${essay.naturalZoomLevel}`);
            }
            
            // Add or update the original version
            const existingVersion = essay.versions[essay.naturalZoomLevel] || {};
            const newVersion = {
                ...existingVersion,
                wordCount,
                isOriginal: true,
                ...(existingVersion.isAIGenerated && { isAIGenerated: true })
            };
            
            // Check if version data has changed
            if (JSON.stringify(existingVersion) !== JSON.stringify(newVersion)) {
                essay.versions[essay.naturalZoomLevel] = newVersion;
                hasChanges = true;
                console.log(`Updated ${essay.slug} original version (${wordCount} words)`);
            }
            
            // If the essay is AI-generated, mark it at the top level
            if (existingVersion.isAIGenerated && !essay.isAIGenerated) {
                essay.isAIGenerated = true;
                hasChanges = true;
            }
            
            // Process other versions
            for (const [zoomLevel, config] of Object.entries(ZOOM_LEVELS)) {
                if (zoomLevel === essay.naturalZoomLevel) continue;
                
                const versionPath = path.join(essayDir, `${essay.slug}.${zoomLevel}.md`);
                try {
                    const versionContent = await fs.readFile(versionPath, 'utf8');
                    const versionWordCount = countWords(versionContent);
                    
                    const existingVersionData = essay.versions[zoomLevel] || {};
                    const newVersionData = {
                        ...existingVersionData,
                        wordCount: versionWordCount,
                        isOriginal: false,
                        ...(existingVersionData.isHumanVetted && {
                            isHumanVetted: true,
                            vettedTimestamp: existingVersionData.vettedTimestamp || essay.timestamp
                        })
                    };
                    
                    if (JSON.stringify(existingVersionData) !== JSON.stringify(newVersionData)) {
                        essay.versions[zoomLevel] = newVersionData;
                        hasChanges = true;
                        console.log(`Updated ${essay.slug} ${zoomLevel} version (${versionWordCount} words)`);
                    }
                } catch (err) {
                    // Version file doesn't exist but entry exists in TOC
                    if (essay.versions[zoomLevel] && essay.versions[zoomLevel].isOriginal) {
                        essay.versions[zoomLevel].isOriginal = false;
                        hasChanges = true;
                    }
                }
            }
        } catch (err) {
            console.error(`Error processing ${essay.slug}: ${err.message}`);
        }
    }
    
    // Only write to TOC if there were changes
    if (hasChanges) {
        await fs.writeFile(tocPath, JSON.stringify(toc, null, 2));
        console.log('TOC updated successfully');
    } else {
        console.log('No changes needed in TOC');
    }
}

updateToc().catch(console.error); 