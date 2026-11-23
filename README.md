# HackGDG

Homepage prototype for the GDG UT Dallas hackathon.

## Local preview

Run `npm ci` and `npm run dev`, then open <http://127.0.0.1:5173>.

## Deployment build

Run `npm ci` and `npm run build` to generate the static site in `dist/`. Run
`npm run preview` to serve that build at <http://127.0.0.1:4173>.

Vercel uses the build settings in `vercel.json`. For another static host, use
`npm run build` as the build command and `dist/` as the publish directory. The
site needs no runtime server or environment variables.

Schedule, Hackerpack, sponsors, and registration are marked as coming soon. The Log in button is a placeholder.

The footer social icons come from [Simple Icons v16](https://simpleicons.org/) via the GDG UTD site.
