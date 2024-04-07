import express from 'express';
import md from 'markdown-it';
import mdFootnote from 'markdown-it-footnote';
import markdownItAttrs from 'markdown-it-attrs';
import { engine } from 'express-handlebars';
import { readFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';
import xml from 'xml';

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

app.engine('handlebars', engine());
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

//this is specifically for images. we do it this ugly way because it's silly, but works and we want the images to be inside the essay directory
app.get('/:essaySlug/img/:imgName', function(req, res) {
    const imgPath = path.resolve(`./essays/${req.params.essaySlug}/img/${req.params.imgName}`);
    if (fs.existsSync(imgPath)) {
        res.sendFile(imgPath)
    } else {
        res.status(404).send("Not found.");
    }
});

app.get('/:essaySlug', function(req, res) {
    const slug = req.params.essaySlug;

    //if the slug exists in the toc.json - then serve the right essay
    let found = false;
    toc.forEach(essay => {
        if (essay.slug == slug) {
            //get the .md file
            const essayText = fs.readFileSync(`./essays/${slug}/${slug}.md`, 'utf8');
            //render .md as .html
            const renderedEssay = markdown.render(essayText);
            //pass it on to the template
            res.render('essay', {
                title: essay.title,
                slug: essay.slug,
                description: essay.description,
                featured_image: essay.featured_image,
                html: renderedEssay
            });
            found = true;
        }
    });
    //if no such thing - show 404
    if (!found) {
        res.render('notfound', { title: "404" })
    }

});

//catch all 404
app.get('*', (req, res) => {
    res.render('notfound', { title: "404" });
})

app.listen(3000);