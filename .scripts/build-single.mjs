// Gera um único HTML com JS, CSS e favicon embutidos, para abrir via file:// no celular.
// Uso: node .scripts/build-single.mjs
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const releasesDir = join(root, 'releases')
const output = join(releasesDir, 'sintonia.html')
const buildDir = mkdtempSync(join(tmpdir(), 'sintonia-build-'))

try {
  execFileSync(join(root, 'node_modules', '.bin', 'vite'), ['build', '--outDir', buildDir, '--emptyOutDir'], {
    cwd: root,
    stdio: 'inherit',
  })

  const read = (file) => readFileSync(join(buildDir, file), 'utf8')
  let html = read('index.html')

  html = html.replace(/<script type="module" crossorigin src="\/([^"]+)"><\/script>/g, (_, src) => {
    const js = read(src).replace(/<\/script/gi, '<\\/script')
    return `<script type="module">${js}</script>`
  })
  html = html.replace(/<link rel="stylesheet" crossorigin href="\/([^"]+)">/g, (_, href) => `<style>${read(href)}</style>`)

  const favicon = readFileSync(join(buildDir, 'favicon.svg')).toString('base64')
  html = html.replace('href="/favicon.svg"', `href="data:image/svg+xml;base64,${favicon}"`)

  if (/(src|href)="\/(?!\/)/.test(html)) {
    throw new Error('O HTML ainda referencia arquivos externos; o build gerou assets que o script não embute.')
  }

  mkdirSync(releasesDir, { recursive: true })
  writeFileSync(output, html)
  console.log(`\nArquivo único gerado: ${output} (${(Buffer.byteLength(html) / 1024).toFixed(1)} kB)`)
} finally {
  rmSync(buildDir, { recursive: true, force: true })
}
