const fs = require('node:fs/promises')
const path = require('node:path')
const crypto = require('node:crypto')
const acorn = require('acorn')
const sharp = require('sharp')
const { JSDOM, VirtualConsole } = require('jsdom')

async function main() {
  const root = __dirname
  const repo = path.resolve(root, '../..')
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'manifest.json'), 'utf8'))
  const results = []
  for (const entry of manifest.pages) {
    const filename = path.join(repo, entry.exports.html)
    const html = await fs.readFile(filename, 'utf8')
    const dom = new JSDOM(html, { virtualConsole: new VirtualConsole() })
    const document = dom.window.document
    const errors = []
    const warnings = []
    const imagePath = path.join(repo, entry.exports.image)
    const image = await fs.readFile(imagePath)
    const dimensions = await sharp(image).metadata()
    await fs.access(path.join(path.dirname(filename), 'review.css'))
    await fs.access(path.join(repo, entry.exports.sourceHtml))
    if (!document.querySelector('h1')) errors.push('Missing H1')
    if (!document.querySelector('a[href="/nexora/nosotros"]')) errors.push('Missing institutional route')
    if (document.querySelector('a[href="#"]')) errors.push('Unresolved placeholder link')
    if ([...document.scripts].some(script => script.src.includes('cdn.tailwindcss.com'))) errors.push('Remote Tailwind runtime remains')
    for (const script of document.scripts) {
      if (script.src) continue
      try { acorn.parse(script.textContent, { ecmaVersion: 'latest' }) } catch (error) { errors.push('Prototype syntax: ' + error.message) }
    }
    const text = document.body.textContent.replace(/\s+/g, ' ')
    if (/contacto@nexora\.dev|app\.digitalflow\.io|Mocked Pass|score\s*[\d.]+/.test(text)) errors.push('Unverified contact or security claim')
    if (entry.page === 'contacto') {
      const budgets = [...document.querySelectorAll('input[name="budget"]')].map(input => input.value).sort()
      if (JSON.stringify(budgets) !== JSON.stringify(['defined', 'discuss', 'unknown'])) errors.push('Budget values differ from contract')
      if (document.querySelectorAll('input[name="projectType"]').length !== 5) errors.push('Project types differ from contract')
      if (![...document.querySelectorAll('textarea')].some(input => input.maxLength === 2000 && !input.required)) errors.push('Description limit or optionality differs')
      if ([...document.querySelectorAll('input[type="checkbox"]')].some(input => input.checked)) errors.push('Consent checked by default')
      if (!text.includes('Modo de prueba: no se enviaron correos')) errors.push('Missing explicit test notice')
      if ([...document.scripts].some(script => /\bfetch\s*\(|XMLHttpRequest|sendBeacon/.test(script.textContent))) errors.push('Prototype has network sending code')
    }
    for (const img of document.images) {
      const src = img.getAttribute('src')
      if (src && !/^https?:|^data:/.test(src)) await fs.access(path.resolve(path.dirname(filename), src))
    }
    const logicalSourceWidth = dimensions.width / 2
    if (Math.abs(logicalSourceWidth - entry.viewport.width) > 4) warnings.push('Original Stitch screenshot viewport differs from the review frame; inspect HTML at target width')
    const result = { key: entry.key, errors, warnings, htmlSha256: crypto.createHash('sha256').update(html).digest('hex'), image: { width: dimensions.width, height: dimensions.height }, automatedBrowserReview: 'blocked_local_file_policy', visualApproval: 'pending' }
    entry.status = 'ready_for_visual_review'
    entry.approval = 'pending'
    entry.reviewAdjustments = { verifiedAssets: true, localCompiledStyles: true, originalScreenshotIsCompositionReference: true }
    results.push(result)
    dom.window.close()
  }
  if (new Set(manifest.pages.map(page => page.key)).size !== 18) throw new Error('Canonical design inventory must have 18 unique entries')
  manifest.phase = '1A_review_pending'
  manifest.implementationGate = 'awaiting_visual_approval'
  manifest.motion = ['Scroll Reveal', 'Hero con entrada escalonada', 'Tarjetas 3D', 'Mockups desktop/mobile', 'Glow con cursor'].map(name => ({ name, status: 'specified_for_phase_1B', specification: 'ANIMATIONS.md' }))
  await fs.writeFile(path.join(root, 'manifest.json'), JSON.stringify(manifest, null, 2))
  await fs.writeFile(path.join(root, 'verification.json'), JSON.stringify({ method: 'Static HTML, resources, syntax, and image metadata checks. No browser rendering verification.', results }, null, 2))
  const errors = results.flatMap(result => result.errors.map(error => ({ key: result.key, error })))
  console.log(JSON.stringify({ references: results.length, errors, viewportWarnings: results.filter(result => result.warnings.length).map(result => result.key), browserReview: 'blocked', approval: 'pending' }, null, 2))
  if (errors.length) process.exitCode = 1
}
main().catch(error => { console.error(error); process.exitCode = 1 })
