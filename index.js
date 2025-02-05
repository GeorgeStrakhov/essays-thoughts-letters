import express from 'express';
import md from 'markdown-it';
import mdFootnote from 'markdown-it-footnote';
import markdownItAttrs from 'markdown-it-attrs';
import { engine } from 'express-handlebars';
import { readFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';
import xml from 'xml';
import { ZOOM_LEVELS } from './services/prompts.js';
import { getChatCompletion } from './services/llm.js';
import { SYSTEM_PROMPT, USER_PROMPT_TEMPLATE } from './services/prompts.js';

const BASE_URL = process.env['BASE_URL'];

//initiate markdown-it
const markdown = md({ html: true }).use(mdFootnote).use(markdownItAttrs);

//ensure target blank on outbound links
// Remember the old renderer if overridden, or proxy to the default renderer.
var defaultRender = markdown.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
};

markdown.renderer.rules.link_open = function(tokens, idx, options, env, self) {
    // Add a new `target` attribute, or replace the value of the existing one.
    tokens[idx].attrSet('target', '_blank');

    // Pass the token to the default renderer.
    return defaultRender(tokens, idx, options, env, self);
};

/*
get a table of contents (toc) with an array of essays.
each essay has a 'title', 'slug' and 'timestamp'
*/
const toc = JSON.parse(
    await readFile(
        new URL('./toc.json', import.meta.url)
    )
);

//helper function to format dates
const formatDate = (dateString) => { //date string in YYYYMMDD format
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6) - 1; // JavaScript months are 0-11, so subtract 1 from the month
    const day = dateString.slice(6);
    const dateObj = new Date(year, month, day);
    return dateObj.toUTCString();
};

const app = express();

// Configure handlebars with helpers
app.engine('handlebars', engine({
    helpers: {
        eq: function (a, b) {
            return a === b;
        }
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

//serving static e.g. css
app.use('/static', express.static('static'));

//home
app.get('/', (req, res) => {
    res.render('home', {
        essays: toc,
        title: "Essays. Thoughts. Letters."
    });
});

//RSS
app.get('/feed.rss', async function(req, res) {

    const feedItems = [];
    let feedItem = {};
    let essayText;
    let renderedEssay;

    //build feed Items
    toc.forEach((essay) => {

        essayText = fs.readFileSync(`./essays/${essay.slug}/${essay.slug}.md`, 'utf8');
        //render .md as .html
        renderedEssay = markdown.render(essayText);

        //replace relative paths to images to absolute ones
        renderedEssay = renderedEssay.replace(/src="([^"]*)"/g, (match, path) => {
            let absoluteUrl = new URL(path, `${BASE_URL}/${essay.slug}/`).toString();
            return `src="${absoluteUrl}"`;
        });

        //construct feed item
        feedItem = {
            item: [
                { title: essay.title },
                {
                    pubDate: formatDate(essay.timestamp.slice(1))
                },
                {
                    guid: [
                        { _attr: { isPermaLink: true } },
                        `${BASE_URL}/${essay.slug}/`,
                    ],
                },
                {
                    description: {
                        _cdata: renderedEssay,
                    },
                },
            ],
        };

        feedItems.push(feedItem);

    });

    //sort feed items by date
    feedItems.sort((a, b) => a.pubDate - b.pubDate);

    //build feed object

    const feedObject = {
        rss: [
            {
                _attr: {
                    version: "2.0",
                    "xmlns:atom": "http://www.w3.org/2005/Atom",
                },
            },
            {
                channel: [
                    {
                        "atom:link": {
                            _attr: {
                                href: `${BASE_URL}/feed.rss`,
                                rel: "self",
                                type: "application/rss+xml",
                            },
                        },
                    },
                    {
                        title: "George Strakhov's Essays",
                    },
                    {
                        link: `${BASE_URL}`,
                    },
                    { description: "Essays. Thoughts. Letters. By George." },
                    { language: "en-US" },
                    ...feedItems,
                ],
            },
        ],
    };

    const feed = '<?xml version="1.0" encoding="UTF-8"?>' + xml(feedObject);
    res.set('Content-Type', 'text/xml');
    res.send(feed);
});

//this is specifically for images. we do it this ugly way because it's silly, but works and we want the images to be inside the essay directory - so that markdown is self-contained and also renders on github etc.
app.get('/:essaySlug/img/:imgName', function(req, res) {
    const imgPath = path.resolve(`./essays/${req.params.essaySlug}/img/${req.params.imgName}`);
    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath)
    } else {
        res.status(404).send("Not found.");
    }
});

app.get('/:essaySlug/', async function(req, res) {
    const slug = req.params.essaySlug;
    const zoomLevel = req.query.zoom || '5m';

    if (!ZOOM_LEVELS[zoomLevel]) {
        return res.status(400).render('notfound', { 
            title: "Invalid zoom level",
            message: "Please select a valid reading time" 
        });
    }

    // Find essay in TOC
    const essay = toc.find(e => e.slug === slug);
    if (!essay) {
        return res.status(404).render('notfound', { title: "404" });
    }

    try {
        // Try to get the specific version file
        const versionPath = zoomLevel === '5m' 
            ? `./essays/${slug}/${slug}.md`
            : `./essays/${slug}/${slug}.${zoomLevel}.md`;
        
        let essayText;
        let isGenerated = false;
        let isGenerating = false;

        try {
            essayText = await readFile(versionPath, 'utf8');
        } catch (err) {
            // File doesn't exist, generate it
            if (zoomLevel !== '5m') { // Don't generate for 5m - that's the original
                const originalText = await readFile(`./essays/${slug}/${slug}.md`, 'utf8');
                isGenerating = true;
                
                // First render the loading state
                res.render('essay', {
                    title: essay.title,
                    slug: essay.slug,
                    description: essay.description,
                    featured_image: essay.featured_image,
                    html: `<div class="generating">
                        <h2>Generating ${ZOOM_LEVELS[zoomLevel].name} version...</h2>
                        <p>This may take a few seconds. Please refresh the page.</p>
                    </div>`,
                    zoomLevel,
                    zoomLevels: ZOOM_LEVELS,
                    isGenerating,
                    currentZoom: ZOOM_LEVELS[zoomLevel]
                });

                // Generate in the background
                getChatCompletion(
                    SYSTEM_PROMPT,
                    USER_PROMPT_TEMPLATE(
                        originalText, 
                        ZOOM_LEVELS[zoomLevel].format,
                        ZOOM_LEVELS[zoomLevel].targetLength
                    )
                ).then(async (generatedText) => {
                    // Save generated version
                    await fs.promises.writeFile(versionPath, generatedText);
                }).catch(console.error);

                return; // End the request here
            } else {
                throw new Error('Original essay not found');
            }
        }

        // Render markdown to HTML
        let renderedEssay = markdown.render(essayText);
        
        // Fix relative image paths
        renderedEssay = renderedEssay.replace(/src="\.\/img\//g, `src="/${slug}/img/`);

        // Pass to template
        res.render('essay', {
            title: essay.title,
            slug: essay.slug,
            description: essay.description,
            featured_image: essay.featured_image,
            html: renderedEssay,
            zoomLevel,
            zoomLevels: ZOOM_LEVELS,
            isGenerated,
            currentZoom: ZOOM_LEVELS[zoomLevel]
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).render('notfound', { 
            title: "Error",
            message: "Failed to load or generate essay" 
        });
    }
});

// Add this before the catch-all 404 route

app.get('/:essaySlug/check-version', function(req, res) {
    const slug = req.params.essaySlug;
    const zoomLevel = req.query.zoom;
    
    if (!zoomLevel || !ZOOM_LEVELS[zoomLevel]) {
        return res.status(400).json({ error: 'Invalid zoom level' });
    }

    const versionPath = zoomLevel === '5m' 
        ? `./essays/${slug}/${slug}.md`
        : `./essays/${slug}/${slug}.${zoomLevel}.md`;

    res.json({
        exists: fs.existsSync(versionPath)
    });
});

//catch all 404
app.get('*', (req, res) => {
    res.render('notfound', { title: "404" });
})

app.listen(3000);