# Telescopic Writings of George Strakhov

This is a simple minimal repo for my essays, letters and thoughts that can expand or contract based on your available reading time.

## Structure

- Inside `essays` each essay has its own directory containing:
  - `{essayName}.md` - the original essay (standard 5-minute version)
  - Time-based variations: `{essayName}.{time}.md` where time is:
    - `1m` - One-minute version (TLDR with bullets)
    - `5m` - Five-minute version (basic argument)
    - `15m` - Fifteen-minute version (detailed exploration)
    - `30m` - Thirty-minute version (comprehensive analysis with interdisciplinary commentary)
  - `img/` subfolder - containing images (.png, .jpg, or .svg files)
- `toc.json` file containing the list of all essays, each with a name, slug(directory_name) and last edited date
- `index.js` - Express.js server that generates HTML for individual essays, 404s, or the essay list

## Telescopic Reading

These essays are telescopic (inspired by TelescopicText.org), allowing readers to zoom in or out based on their current attention capacity and time availability.

### Time-based Versions

- Shorter versions (10s, 1m) are concise distillations of the main ideas
- The original essay (.md) serves as the standard 5-minute version
- Longer versions (15m, 30m) don't fabricate additional content but rather enhance the original by adding:
  - Commentary from multiple perspectives
  - Analysis from different viewpoints
  - Related discussions and context
  - Similar to the Talmudic approach of layered commentary

### Dynamic Generation

If a requested time version doesn't exist in the essay's directory, the server will:
1. Generate that version on-the-fly using LLM
2. Save it to the appropriate file for future use
3. Serve it to the reader

This ensures that readers can always access their preferred reading length while maintaining content quality and authenticity.

NB! Since the deployed version on Fly is ephemeral, it will be lost after a while. So what we need to also implement is a service that whenever a new non-existing version is generated - it will send the new version to me via email. And if I like it - I will manually add it to the repo and redeploy it.

### Extra fun for the 404 page

If the requested essay is not found - we can show a button to generate the essay on the fly, based on the style of the other essays
(need to fine-tune the LLM to do this well and/or just have a long-context one).
And we should add a captcha or something to prevent robot abuse.

### Deployed via Fly.io

Automatic redeploy on every push to github to the main branch.