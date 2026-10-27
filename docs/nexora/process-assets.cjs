const fs = require('node:fs/promises')
const path = require('node:path')
const crypto = require('node:crypto')
const sharp = require('sharp')

async function main() {
  const root = __dirname
  const repo = path.resolve(root, '../..')
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'manifest.json'), 'utf8'))
  const tiles = []
  for (const [index, entry] of manifest.pages.entries()) {
    const imagePath = path.resolve(repo, entry.exports.image)
    if (!imagePath.startsWith(root + path.sep)) throw new Error('Invalid export path')
    try {
      const base64 = await fs.readFile(imagePath + '.b64', 'utf8')
      await fs.writeFile(imagePath, Buffer.from(base64.trim(), 'base64'))
      await fs.unlink(imagePath + '.b64')
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    try {
      const data = await fs.readFile(imagePath)
      const meta = await sharp(data).metadata()
      entry.exportedImage = { width: meta.width, height: meta.height, sha256: crypto.createHash('sha256').update(data).digest('hex') }
      const thumb = await sharp(data).extract({ left: 0, top: 0, width: meta.width, height: Math.min(meta.height, Math.round(meta.width * 1.4)) }).resize({ width: 420, height: 420, fit: 'contain', background: '#111821' }).png().toBuffer()
      await fs.writeFile(path.join(path.dirname(imagePath), 'preview.png'), thumb)
      const label = Buffer.from(`<svg width="420" height="38"><rect width="420" height="38" fill="#111821"/><text x="14" y="25" font-family="sans-serif" font-size="16" fill="#edf3f6">${entry.page} / ${entry.device}</text></svg>`)
      const tile = await sharp({ create: { width: 420, height: 458, channels: 4, background: '#111821' } }).composite([{ input: label, left: 0, top: 0 }, { input: thumb, left: 0, top: 38 }]).png().toBuffer()
      tiles.push({ input: tile, left: (index % 3) * 436 + 16, top: Math.floor(index / 3) * 474 + 16 })
    } catch (error) {
      entry.imageExportError = error.message
    }
  }
  await fs.writeFile(path.join(root, 'manifest.json'), JSON.stringify(manifest, null, 2))
  if (tiles.length) await sharp({ create: { width: 1324, height: 2860, channels: 4, background: '#080d13' } }).composite(tiles).png().toFile(path.join(root, 'overview.png'))
  console.log(JSON.stringify({ exported: tiles.length, missing: manifest.pages.filter(entry => !entry.exportedImage).map(entry => entry.key) }))
}
main().catch(error => { console.error(error); process.exitCode = 1 })
