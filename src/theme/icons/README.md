# Icons

A curated subset of [Lucide](https://lucide.dev) (`lucide-static@0.544.0`, ISC).
`manifest.json` lists every id.

Cross-origin `<use href="external.svg#id">` does not work in Chrome or Safari, so
the theme does **not** ship a usable cross-origin sprite. Each app builds its own
same-origin subset instead.

## Per-app build

1. Decide which ids the app uses (grep templates, or keep a list).
2. At build time, concatenate the matching `theme/v1/icons/<id>.svg` files into
   one same-origin `static/icons.svg` sprite of `<symbol id="<id>">` elements,
   or inline that sprite into the base template.
3. Reference with `<svg class="icon"><use href="/static/icons.svg#bell"/></svg>`
   (or `<use href="#bell"/>` when the sprite is inlined in the document).

`theme/v1/icons/sprite.svg` is the full subset as one file — fine to copy
wholesale into an app that has no build (`error_pages`, `december`).

## Direct use

Each `<id>.svg` is a standalone 24x24 stroke icon and can be used as-is in an
`<img>`, a CSS `mask-image`, or pasted inline.
