// Materialize Stitch's structured edit events; never modifies application files.
const fs = require('node:fs/promises')
const path = require('node:path')
const { JSDOM, VirtualConsole } = require('jsdom')

async function main() {
  const root = __dirname
  const repo = path.resolve(root, '../..')
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'manifest.json'), 'utf8'))
  const events = JSON.parse(await fs.readFile(path.join(root, 'stitch/mcp-edits.json'), 'utf8'))
  const audit = []

  for (const entry of manifest.pages) {
    const source = await fs.readFile(path.join(repo, entry.exports.sourceHtml), 'utf8')
    const dom = new JSDOM(source, { virtualConsole: new VirtualConsole() })
    const document = dom.window.document
    const edits = events.filter(event => event.eventPayload?.screen_id === entry.screenId)
    const operations = []

    for (const event of edits) {
      for (const operation of event.eventPayload.dom_operations || []) {
        let elements
        try {
          elements = [...document.querySelectorAll(operation.selector)]
        } catch (error) {
          operations.push({ selector: operation.selector, status: 'invalid_selector', message: error.message })
          continue
        }
        if (!elements.length) {
          operations.push({ selector: operation.selector, status: 'not_found' })
          continue
        }
        let supported = true
        for (const element of elements) {
          if (operation.action === 'replace_content') element.innerHTML = operation.content || ''
          else if (operation.action === 'set_attribute') element.setAttribute(operation.attr_name, operation.attr_value || '')
          else if (operation.action === 'remove_attribute') element.removeAttribute(operation.attr_name)
          else if (operation.action === 'add_class') element.classList.add(...operation.class_name.split(/\s+/))
          else if (operation.action === 'remove_class') element.classList.remove(...operation.class_name.split(/\s+/))
          else if (operation.action === 'remove_element') element.remove()
          else supported = false
        }
        operations.push({ selector: operation.selector, action: operation.action, count: elements.length, status: supported ? 'applied' : 'unsupported' })
      }
    }

    const html = dom.serialize()
    await fs.writeFile(path.join(repo, entry.exports.html), html)
    const visibleCopy = document.body.textContent.replace(/\s+/g, ' ')
    const scripts = [...document.scripts].filter(script => !script.src && script.id !== 'tailwind-config').map(script => script.textContent).join('\n')
    const form = entry.page === 'contacto' ? {
      projectTypes: [...document.querySelectorAll('input[name="projectType"]')].map(input => input.value),
      budgets: [...document.querySelectorAll('input[name="budget"]')].map(input => input.value),
      maxDescription: [...document.querySelectorAll('textarea')].map(input => input.maxLength),
      checkedConsent: [...document.querySelectorAll('input[type="checkbox"]')].some(input => input.checked),
      testCopy: visibleCopy.includes('Modo de prueba: no se enviaron correos'),
      networkCalls: /\bfetch\s*\(|XMLHttpRequest|sendBeacon/.test(scripts),
    } : null
    audit.push({
      key: entry.key,
      title: document.title,
      headings: [...document.querySelectorAll('h1,h2,h3')].map(heading => heading.textContent.trim()),
      hasNosotrosRoute: !!document.querySelector('a[href="/nexora/nosotros"]'),
      placeholderLinks: document.querySelectorAll('a[href="#"]').length,
      unverifiedNexoraEmail: /contacto@nexora\.dev/.test(visibleCopy),
      operations,
      form,
    })
    dom.window.close()
  }
  await fs.writeFile(path.join(root, 'audit.json'), JSON.stringify(audit, null, 2))
  console.log(JSON.stringify(audit.map(item => ({ key: item.key, operations: item.operations.length, unresolved: item.operations.filter(operation => operation.status !== 'applied').length, placeholderLinks: item.placeholderLinks, unverifiedNexoraEmail: item.unverifiedNexoraEmail, form: item.form })), null, 2))
}

main().catch(error => { console.error(error); process.exitCode = 1 })
