import fs from 'fs/promises';
import path from 'path';

async function buildCorpus() {
    try {
        // Read toc.json
        const tocPath = path.join(process.cwd(), 'toc.json');
        const toc = JSON.parse(await fs.readFile(tocPath, 'utf-8'));

        // Filter essays: exclude AI-generated ones
        const humanEssays = toc.filter(essay => !essay.isAIGenerated);

        let corpus = '';
        let processedCount = 0;
        let skippedCount = 0;

        for (const essay of humanEssays) {
            // Find the original version
            const originalVersion = Object.entries(essay.versions || {})
                .find(([_, versionData]) => versionData.isOriginal === true);

            if (!originalVersion) {
                console.log(`⚠️  No original version found for: ${essay.title}`);
                skippedCount++;
                continue;
            }

            // Read the essay content
            const essayPath = path.join(process.cwd(), 'essays', essay.slug, `${essay.slug}.md`);

            try {
                let content = await fs.readFile(essayPath, 'utf-8');

                // Strip HTML comments
                content = content.replace(/<!--[\s\S]*?-->/g, '');

                // Strip HTML tags
                content = content.replace(/<[^>]+>/g, '');

                // Strip markdown-it-attrs syntax: {style="..."} or {.class #id}
                content = content.replace(/\{[^}]*?(?:style|class|id|width|height)[^}]*?\}/g, '');

                // Strip images: ![alt](url)
                content = content.replace(/!\[.*?\]\(.*?\)/g, '');

                // Remove entire footnotes section (from "### footnotes" to end of file or next major section)
                content = content.replace(/^###?\s*footnotes[\s\S]*$/im, '');

                // Strip footnote references: [^1], [^note], etc.
                content = content.replace(/\[\^[^\]]+\]/g, '');

                // Strip footnote definitions (lines starting with [^...]:)
                content = content.replace(/^\[\^[^\]]+\]:[\s\S]*?(?=\n\n|\n\[\^|\n#|$)/gm, '');

                // Clean up extra whitespace and horizontal rules at the end
                content = content.replace(/\n{3,}/g, '\n\n').trim();
                content = content.replace(/[\-_]{3,}\s*$/g, '').trim();

                // Add to corpus with delimiter
                corpus += '=====================================\n';
                corpus += `${essay.title}\n`;
                corpus += '=====================================\n\n';
                corpus += content;
                corpus += '\n\n\n';

                processedCount++;
                console.log(`✓ Added: ${essay.title}`);

            } catch (error) {
                console.log(`✗ Could not read: ${essay.title} (${error.message})`);
                skippedCount++;
            }
        }

        // Write corpus file
        const corpusPath = path.join(process.cwd(), 'CORPUS.md');
        await fs.writeFile(corpusPath, corpus, 'utf-8');

        console.log('\n' + '='.repeat(50));
        console.log(`✓ Corpus built successfully!`);
        console.log(`  Processed: ${processedCount} essays`);
        console.log(`  Skipped: ${skippedCount} essays`);
        console.log(`  Output: CORPUS.md`);
        console.log('='.repeat(50));

    } catch (error) {
        console.error('Error building corpus:', error);
        process.exit(1);
    }
}

buildCorpus();
