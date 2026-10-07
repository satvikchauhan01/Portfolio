# Portfolio

Personal site for Satvik Chauhan, served by GitHub Pages from the root of `main`:
<https://satvikchauhan01.github.io/Portfolio/>

Plain HTML, CSS and JavaScript. There is no build step and no dependencies.

## Layout

```
index.html              Page structure and the copy that rarely changes (hero, about, approach, contact)
assets/js/data.js       Content: projects, case studies, experience, skills, stats, certificates
assets/js/main.js       Renders data.js and handles the menu, case studies, lightbox and theme
assets/css/styles.css   Design tokens (colours, type, spacing) and all styles, in page order
assets/img/             Portrait, project screenshots, certificates, social preview image
assets/icons/           Technology logos from Devicon (MIT licence)
satvik-jp.pdf           Resume linked from the nav, hero and contact section
```

## Updating content

Almost every change is an edit to `assets/js/data.js`.

- **Add or edit a project.** Each entry in `projects` drives the block on the page and its
  case study. `figure.type` picks the diagram: `pipeline`, `rollout`, `layers` or `topology`.
  `hue` sets the project's colour and `hot` the colour of its highlighted step
  (`orange`, `blue`, `teal`, `amber`, `rose`, `violet`, `green`).
- **Add a screenshot.** Put the image in `assets/img/projects/` and add it to the project's
  `shots` array with its `src`, `w`, `h`, `label` and `alt`. It appears in the case study and
  opens in the lightbox. `figure.shot` puts one at the top of the project's figure.
- **Add a role.** Add an object to `experience`, newest first. A commented template is in the file.
- **Add a certificate.** Add the full image and a preview (about 720px wide) to
  `assets/img/certs/`, then add an entry to `certificates` with `img` and `thumb`.
- **Add a technology logo.** Drop the SVG in `assets/icons/` and map its name in `logos`.
  Names without a logo show a coloured dot.
- **Replace the resume.** Overwrite `satvik-jp.pdf` (visitors download it as Satvik-Chauhan-Resume.pdf), or change the links in `index.html`.

Only state what the project repositories, the certificates or the resume can back up.

After changing `styles.css`, `data.js` or `main.js`, bump the `?v=` number on their three
URLs in `index.html` so browsers fetch the new files instead of a cached copy.

## Previewing locally

```bash
python -m http.server 4173
```

Then open <http://localhost:4173>. Opening `index.html` directly from disk also works.
