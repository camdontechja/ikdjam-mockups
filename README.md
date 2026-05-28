# IKD Jamaica Mockup Review

Static HTML5 review site for presenting client mockups and collecting browser-local comments.

## Open locally

Open `index.html` in a browser, or serve the folder with any static server.

## Add a mockup

1. Copy the HTML mockup into `mockups/`.
2. Add an entry to `assets/js/mockups.js`.

```js
{
  id: "new-concept",
  title: "New Concept",
  description: "Short description for the client.",
  file: "mockups/new-concept.html",
  tag: "New"
}
```

## Remove a mockup

Delete or comment out its entry in `assets/js/mockups.js`. You can also remove the HTML file from `mockups/` if it is no longer needed.

## Comments

Comments are stored in the browser's `localStorage` per mockup. This keeps the project deployable as a plain static site, including on GitHub Pages. If comments need to be shared between all reviewers, add a small backend or hosted form service later.
