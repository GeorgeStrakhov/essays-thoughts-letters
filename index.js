import express from 'express';
import md from 'markdown-it';
import mdFootnote from 'markdown-it-footnote';
import { engine } from 'express-handlebars';
import { readFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';

//initiate markdown-it
const markdown = md().use(mdFootnote);

/*
get a table of contents (toc) with an array of essays.
each essay has a 'title', 'slug' and 'timestamp'
*/
const toc = JSON.parse(
  await readFile(
    new URL('./toc.json', import.meta.url)
  )
);

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use('/static', express.static('static'));

app.get('/', (req, res) => {
    res.render('home',{
      essays: toc,
      title: "Essays. Thoughts. Letters."
    });
});

//this is specifically for images. we do it this ugly way because it's silly, but works and we want the images to be inside the essay directory
app.get('/:essaySlug/img/:imgName', function(req, res){
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
    if(essay.slug == slug) {
      //get the .md file
      const essayText = fs.readFileSync(`./essays/${slug}/${slug}.md`, 'utf8');
      //render .md as .html
      const renderedEssay = markdown.render(essayText);
      //pass it on to the template
      res.render('essay',{
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
  if(!found){
    res.render('notfound', {title: "404"})
  }
  
});

//catch all 404
app.get('*', (req,res) =>{
  res.render('notfound', {title: "404"});
})

app.listen(3000);