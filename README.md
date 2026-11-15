# ShowBuddy

Website for ShowBuddy, a set of open apps for sound, lighting and visuals:
<https://showbuddy-seven.vercel.app/>.

Static page with no build step; Vercel deploys it on every push to `main`.
To preview locally, open `index.html`.

- `index.html`: content.
- `styles.css`: 8-bit style (black, greys and one colour per app; thick
  borders and hard shadows).
- `pixels.js`: pixel icons, defined as 10x10 grids.
- `i18n.js`: English/Spanish switch. English lives in the HTML; this file
  holds the Spanish strings. The default language follows the visitor's
  country (`api/geo.js`, a Vercel function), then the browser language.
