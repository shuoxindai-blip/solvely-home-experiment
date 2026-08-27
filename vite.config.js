import { createReadStream, cpSync, existsSync, statSync } from 'node:fs'
import { extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))
const assetRoot = resolve(projectRoot, 'assets')

const mimeTypes = {
  '.css':'text/css; charset=utf-8',
  '.html':'text/html; charset=utf-8',
  '.js':'text/javascript; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.md':'text/markdown; charset=utf-8',
  '.mp3':'audio/mpeg',
  '.png':'image/png',
  '.svg':'image/svg+xml',
  '.txt':'text/plain; charset=utf-8',
  '.webp':'image/webp'
}

function serveRootAssets() {
  const middleware = (request, response, next) => {
    const pathname = decodeURIComponent(new URL(request.url || '/', 'http://localhost').pathname)
    const requestedPath = resolve(assetRoot, `.${pathname}`)
    if (!requestedPath.startsWith(`${assetRoot}${sep}`) || !existsSync(requestedPath) || !statSync(requestedPath).isFile()) return next()
    response.setHeader('Content-Type', mimeTypes[extname(requestedPath).toLowerCase()] || 'application/octet-stream')
    createReadStream(requestedPath).pipe(response)
  }

  return {
    name:'solvely-root-assets',
    configureServer(server) { server.middlewares.use('/assets', middleware) },
    configurePreviewServer(server) { server.middlewares.use('/assets', middleware) },
    closeBundle() { cpSync(assetRoot, resolve(projectRoot, 'dist/assets'), { recursive:true }) }
  }
}

export default defineConfig({
  plugins:[vue(), serveRootAssets()],
  resolve:{ alias:{ '@':resolve(projectRoot, 'src') } },
  build:{ target:'es2020' }
})
