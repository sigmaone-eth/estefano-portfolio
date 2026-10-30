# Estéfano Gómez — portfolio

A static site (plain HTML, CSS and JavaScript, no build step). GSAP, ScrollTrigger and Lenis are vendored in `vendor/`.

- `index.html`: the page
- `styles.css`: all styles (colours are the variables at the top)
- `main.js`: the interactions (cursor grid, image trail, live-code dither portrait, crosshair, carousel and full-screen view)
- `assets/work/01.jpg` … `10.jpg`: carousel and image-trail pictures, 3:4
- `assets/img/portrait.webp`: the portrait used in the hero and the About section

## Swap in your own work

Replace `assets/work/01.jpg` … `10.jpg` with your stills (keep the names, any 3:4 image works), then edit the `PIECES` list at the top of `main.js` for titles, years and Instagram links. The current pictures are free test images; their credits are in the footer.

## Preview locally

```bash
npx http-server . -p 5173
```

Then open http://localhost:5173. Opening `index.html` directly from disk mostly works, but the dither portrait needs a server.

## Publishing

The site is published with GitHub Pages from the `main` branch. Every push to `main` updates the live site within a minute or two.
