// Build an offline design handoff from exported Stitch HTML; not application code.
const fs = require('node:fs/promises')
const path = require('node:path')
const { JSDOM, VirtualConsole } = require('jsdom')
const acorn = require('acorn')
const postcss = require('postcss')
const tailwind = require('tailwindcss')

function literal(node, bindings) {
  if (node.type === 'Literal') return node.value
  if (node.type === 'Identifier' && bindings.has(node.name)) return literal(bindings.get(node.name), bindings)
  if (node.type === 'ArrayExpression') return node.elements.map(item => literal(item, bindings))
  if (node.type === 'ObjectExpression') return Object.fromEntries(node.properties.map(property => {
    if (property.type !== 'Property' || property.computed || property.method) throw new Error('Unsupported config property')
    return [property.key.name || property.key.value, literal(property.value, bindings)]
  }))
  if (node.type === 'UnaryExpression' && node.operator === '-') return -literal(node.argument, bindings)
  throw new Error('Non-static Tailwind config: ' + node.type)
}

function readConfig(document) {
  for (const script of document.scripts) {
    if (!script.textContent.includes('tailwind.config')) continue
    const ast = acorn.parse(script.textContent, { ecmaVersion: 'latest' })
    const bindings = new Map()
    for (const statement of ast.body) {
      if (statement.type === 'VariableDeclaration') {
        for (const declaration of statement.declarations) if (declaration.id.type === 'Identifier') bindings.set(declaration.id.name, declaration.init)
      }
      const expression = statement.expression
      if (expression?.type === 'AssignmentExpression' && expression.left.type === 'MemberExpression' && expression.left.object.name === 'tailwind' && expression.left.property.name === 'config') return literal(expression.right, bindings)
    }
  }
  throw new Error('Missing Tailwind design config')
}

async function main() {
  const root = __dirname
  const repo = path.resolve(root, '../..')
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'manifest.json'), 'utf8'))
  const assets = {
    digitalflow: 'https://cdn.sanity.io/images/qw8437rq/production/3d22183d97762bcd19c0a81ce4b5bedec820dba3-2552x748.png',
    guitarra: 'https://cdn.sanity.io/images/qw8437rq/production/5f07560c2abfab0adf319fca571509f2985a8174-2554x909.png',
    bandas: 'https://cdn.sanity.io/images/qw8437rq/production/17a6fe30f4f068e7b80cd37725085d1fb541666e-2555x911.png',
  }
  await fs.mkdir(path.join(root, 'assets'), { recursive: true })
  for (const [name, url] of Object.entries(assets)) {
    const target = path.join(root, 'assets', name + '.png')
    try { await fs.access(target) } catch {
      const response = await fetch(url, { signal: AbortSignal.timeout(30000) })
      if (!response.ok) throw new Error('Asset HTTP ' + response.status)
      await fs.writeFile(target, Buffer.from(await response.arrayBuffer()))
    }
  }
  const report = []
  for (const entry of manifest.pages) {
    const filename = path.join(repo, entry.exports.html)
    const dom = new JSDOM(await fs.readFile(filename, 'utf8'), { virtualConsole: new VirtualConsole() })
    const document = dom.window.document
    const replacements = []
    for (const element of [...document.querySelectorAll('span')]) {
      if (element.children.length === 0 && /90ms|SLA A\+/.test(element.textContent)) element.parentElement.remove()
    }
    const cleanCopy = value => value
      .replaceAll('app.digitalflow.io', 'DigitalFlow')
      .replace(/Mocked Pass\s*\(score\s*[\d.]+\)/gi, 'Verificacion no ejecutada en esta maqueta')
      .replace(/Sincronización Webhook\s*100% activa/gi, 'Integracion de pagos y entregas')
      .replaceAll('0% Burocracia', 'Sin burocracia')
      .replaceAll('100% hands-on engineering', 'Ingenieria directa')
    const walker = document.createTreeWalker(document.body, dom.window.NodeFilter.SHOW_TEXT)
    let textNode
    while ((textNode = walker.nextNode())) {
      if (!['SCRIPT', 'STYLE'].includes(textNode.parentElement?.tagName)) textNode.nodeValue = cleanCopy(textNode.nodeValue)
    }
    for (const element of document.querySelectorAll('span,p,h3')) {
      if (element.children.length === 0 && element.textContent.trim() === '0%') element.textContent = 'Directo'
      if (element.children.length === 0 && element.textContent.trim() === '100%') element.textContent = 'Propio'
      if (element.children.length === 0 && element.textContent.trim() === '7d') element.textContent = 'Iterativo'
    }
    for (const script of [...document.scripts]) {
      if (script.src || script.textContent.includes('tailwind.config')) continue
      script.textContent = cleanCopy(script.textContent)
    }
    for (const image of [...document.images]) {
      const text = (image.alt + ' ' + (image.getAttribute('data-alt') || '')).toLowerCase()
      if (/logo|icon|símbolo/.test(text)) continue
      if (/portrait|retrato|headshot|founder|fundador|enrique/.test(text)) {
        replacements.push({ action: 'omit_unsupplied_portrait', original: image.src })
        image.remove()
        continue
      }
      const product = /guitar|guitarra/.test(text) ? 'guitarra' : /band|music/.test(text) ? 'bandas' : 'digitalflow'
      const relative = path.relative(path.dirname(filename), path.join(root, 'assets', product + '.png')).replaceAll('\\', '/')
      replacements.push({ action: 'reuse_verified_asset', product, original: image.src, local: relative })
      image.src = relative
      image.removeAttribute('srcset')
      image.alt = product === 'digitalflow' ? 'Captura real de DigitalFlow' : product === 'guitarra' ? 'Captura real de Herramientas de Guitarra' : 'Captura real de Sitio para Bandas Musicales'
    }
    if (entry.page === 'contacto') {
      const budgets = { 'Aún no lo sé': 'unknown', 'Tengo un presupuesto': 'defined', 'Prefiero conversarlo': 'discuss' }
      for (const input of document.querySelectorAll('input[name="budget"]')) if (budgets[input.value]) input.value = budgets[input.value]
    }
    const config = readConfig(document)
    config.content = [{ raw: document.documentElement.outerHTML, extension: 'html' }]
    const styles = [...document.querySelectorAll('style')].map(style => style.textContent).join('\n')
    const result = await postcss([tailwind(config)]).process('@tailwind base;\n@tailwind components;\n@tailwind utilities;\n' + styles + '\n*{letter-spacing:0!important}', { from: undefined })
    await fs.writeFile(path.join(path.dirname(filename), 'review.css'), result.css)
    for (const script of [...document.scripts]) if (script.src.includes('cdn.tailwindcss.com') || script.textContent.includes('tailwind.config')) script.remove()
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = './review.css'
    document.head.append(link)
    document.documentElement.dataset.nexoraArtifact = 'design-review-only'
    await fs.writeFile(filename, dom.serialize())
    report.push({ key: entry.key, assets: replacements, offlineStyles: true })
    dom.window.close()
  }
  await fs.writeFile(path.join(root, 'asset-reconciliation.json'), JSON.stringify(report, null, 2))
  console.log(JSON.stringify({ prepared: report.length, files: report.map(item => item.key) }))
}
main().catch(error => { console.error(error); process.exitCode = 1 })
