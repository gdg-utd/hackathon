import { cp, mkdir, readFile, rm } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname } from 'node:path'

const assets = new Map([
  ['/index.html', 'index.html'],
  ['/src/main.js', 'src/main.js'],
  ['/src/style.css', 'src/style.css'],
  ['/src/gsap.min.js', 'node_modules/gsap/dist/gsap.min.js'],
  ['/src/ScrollTrigger.min.js', 'node_modules/gsap/dist/ScrollTrigger.min.js'],
])

const mode = process.argv[2]

if (mode === '--serve' || mode === '--preview') {
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
  }
  const port = mode === '--preview' ? 4173 : 5173

  createServer(async (request, response) => {
    const pathname = request.url.split('?')[0]
    const route = pathname === '/' ? '/index.html' : pathname
    const source = assets.get(route) ?? (
      /^(?:\/favicon\.ico|\/(?:art|brand)\/[\w-]+\.png|\/icons\/[\w-]+\.svg)$/.test(route)
        ? `public${route}`
        : null
    )
    const file = source && (mode === '--preview' ? `dist${route}` : source)
    if (file) {
      try {
        const data = await readFile(file)
        response.writeHead(200, { 'Content-Type': types[extname(file)] })
        response.end(data)
        return
      } catch (error) {
        if (error.code !== 'ENOENT') {
          response.writeHead(500).end('Could not read the preview file.')
          return
        }
      }
    }
    response.writeHead(404).end('Page not found.')
  }).listen(port, '127.0.0.1', () => {
    console.log(`HackGDG preview at http://127.0.0.1:${port}`)
  })
} else {
  await rm('dist', { recursive: true, force: true })
  await mkdir('dist/src', { recursive: true })
  await Promise.all([
    cp('public', 'dist', { recursive: true }),
    ...Array.from(assets, ([route, file]) => cp(file, `dist${route}`)),
  ])
}
