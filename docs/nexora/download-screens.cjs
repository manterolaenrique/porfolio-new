// Fallback for stalled binary MCP responses, using public screenshot URLs from MCP.
const fs = require('node:fs/promises')
const path = require('node:path')

async function main() {
  const repo = path.resolve(__dirname, '../..')
  const sources = JSON.parse(await fs.readFile(path.join(__dirname, 'stitch/asset-sources.json'), 'utf8'))
  for (const source of sources) {
    const target = path.resolve(repo, source.path)
    if (!target.startsWith(__dirname + path.sep)) throw new Error('Invalid export destination')
    const url = new URL(source.url)
    if (url.protocol !== 'https:' || url.hostname !== 'lh3.googleusercontent.com') throw new Error('Unexpected screenshot host')
    try {
      const response = await fetch(url.href + '=s0', { signal: AbortSignal.timeout(45000) })
      if (!response.ok) throw new Error('Screenshot HTTP ' + response.status)
      const type = response.headers.get('content-type') || ''
      if (!type.startsWith('image/')) throw new Error('Screenshot is not an image')
      const buffer = Buffer.from(await response.arrayBuffer())
      await fs.mkdir(path.dirname(target), { recursive: true })
      await fs.writeFile(target, buffer)
      console.log(JSON.stringify({ key: source.key, bytes: buffer.length, status: 'saved' }))
    } catch (error) {
      console.log(JSON.stringify({ key: source.key, status: 'failed', error: error.message }))
      process.exitCode = 1
    }
  }
}
main().catch(error => { console.error(error); process.exitCode = 1 })
