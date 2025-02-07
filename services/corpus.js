import fs from 'fs/promises';
import path from 'path';

/**
 * Get the original content of an essay by its slug
 * @param {string} slug - The essay's directory name
 * @returns {Promise<string>} The essay content
 */
async function getEssayContent(slug) {
    try {
        // Find the original file (not time-based variations)
        const essayPath = path.join(process.cwd(), 'essays', slug, `${slug}.md`);
        return await fs.readFile(essayPath, 'utf-8');
    } catch (error) {
        // Don't log error for new essays that don't exist yet
        if (error.code !== 'ENOENT') {
            console.error(`Error reading essay ${slug}:`, error);
        }
        return null;
    }
}

/**
 * Get reference essays for style matching, excluding the current essay
 * @param {string} currentSlug - Slug of the essay being processed (optional)
 * @returns {Promise<Array<{slug: string, content: string}>>} Array of reference essays
 */
export async function getReferenceCorpus(currentSlug = null) {
    try {
        // Read and parse toc.json
        const tocPath = path.join(process.cwd(), 'toc.json');
        const toc = JSON.parse(await fs.readFile(tocPath, 'utf-8'));
        
        // Filter essays and shuffle them
        const eligibleEssays = toc
            .filter(essay => 
                (!currentSlug || essay.slug !== currentSlug) &&
                essay.versions && Object.keys(essay.versions).length > 0 &&
                !essay.isAIGenerated
            )
            // Shuffle the array using Fisher-Yates algorithm
            .sort(() => Math.random() - 0.5);

        // Get content for each essay, limiting total size
        const essays = [];
        let totalTokens = 0;
        const TOKEN_LIMIT = 500000;
        // Rough approximation: 1 token ≈ 4 characters
        const CHARS_PER_TOKEN = 4;

        for (const essay of eligibleEssays) {
            try {
                const content = await getEssayContent(essay.slug);
                
                if (content) {
                    // Remove image references from markdown
                    const contentWithoutImages = content.replace(/!\[.*?\]\(.*?\)/g, '');
                    
                    // Estimate tokens in this content
                    const estimatedTokens = Math.ceil(contentWithoutImages.length / CHARS_PER_TOKEN);
                    
                    // Check if adding this essay would exceed the token limit
                    if (totalTokens + estimatedTokens > TOKEN_LIMIT) {
                        break;
                    }

                    essays.push({
                        slug: essay.slug,
                        content: contentWithoutImages
                    });
                    
                    totalTokens += estimatedTokens;
                }
            } catch (error) {
                // If we can't read an essay, just skip it and continue
                console.log(`Skipping essay ${essay.slug}: ${error.message}`);
                continue;
            }
        }

        if (essays.length === 0) {
            console.log('Warning: No reference essays found, proceeding without style examples');
        }

        return essays;
    } catch (error) {
        console.error('Error getting reference corpus:', error);
        // Return empty array rather than failing completely
        return [];
    }
} 