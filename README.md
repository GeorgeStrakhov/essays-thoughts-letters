This is a simple minimal repo for my essays

- inside `essays` each essay has its own directory and inside it there is one .md file for the text and inside `img` subfolder - multiple images if needed. all diagrams are .svg
- there is a `toc.json` file that has the list of all essays, each with a name, slug(directory_name) and last edited date
- `index.js` has an express.js server running that looks at the toc.json file and generates the html for either an individual essay (looking at the slug) or a 404 or a list of all essays (for `/` request)