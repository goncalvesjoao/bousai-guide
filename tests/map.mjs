// Run after npm run build: node tests/map.mjs
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import vm from 'node:vm'

const translations = stripTypeScriptTypes(readFileSync(new URL('../src/i18n/ui.ts', import.meta.url), 'utf8'))
const dictionaryUrl = `data:text/javascript;base64,${Buffer.from(translations).toString('base64')}`
const utils = stripTypeScriptTypes(readFileSync(new URL('../src/i18n/utils.ts', import.meta.url), 'utf8'))
  .replace("'./ui'", JSON.stringify(dictionaryUrl))
const { getLangFromUrl, useTranslations } = await import(`data:text/javascript;base64,${Buffer.from(utils).toString('base64')}`)

for (const locale of ['en', 'ja']) {
const t = useTranslations(locale)
const layers = JSON.parse(readFileSync(new URL('../src/resources/layers.json', import.meta.url)))
const html = readFileSync(new URL(locale === 'en' ? '../dist/index.html' : '../dist/ja/index.html', import.meta.url), 'utf8')
assert.ok(html.includes(`<html lang="${locale}">`))
assert.ok(html.includes(`<title>${t('title')}</title>`))
assert.ok(html.includes(`aria-label="${t('language')}"`))
assert.ok(html.includes(`value="/" lang="en"${locale === 'en' ? ' selected' : ''}>English</option>`))
assert.ok(html.includes(`value="/ja/" lang="ja"${locale === 'ja' ? ' selected' : ''}>日本語</option>`))
assert.ok(html.includes(t('warning')))
assert.ok(html.includes(t('loading')))
assert.ok(html.includes(t('legendAlt')))
assert.match(html, /<h1[^>]*>Bousai Guide<\/h1>/)
const toggles = Object.fromEntries(layers.map(layer => {
  assert.ok(html.includes(`id="layer-${layer.id}"`), `${layer.id} is rendered by Astro`)
  assert.ok(!html.includes(locale === 'ja' ? layer.name : layer.japanese), 'Only the selected language is rendered for each layer')
  assert.ok(html.includes(`font-semibold">${locale === 'ja' ? layer.japanese : layer.name}</span>`))
  const toggle = { checked: layer.id === 'tsunami', disabled: true, addEventListener: (_, fn) => toggle.change = fn }
  return [`layer-${layer.id}`, toggle]
}))
const status = { textContent: t('loading') }
let map
class Map {
  constructor(options) { assert.equal(options.locale['NavigationControl.ZoomIn'], t('NavigationControl.ZoomIn')); map = this; this.events = {}; this.layers = {}; this.sources = {} }
  addControl() {}
  on(event, fn) { (this.events[event] ??= []).push(fn) }
  addSource(id, source) { assert.ok(!this.sources[id]); this.sources[id] = source }
  getSource(id) { return this.sources[id] }
  getLayer(id) { return this.layers[id] }
  getStyle() { return { layers: [{ id: 'labels', type: 'symbol' }] } }
  addLayer(layer, before) { assert.equal(before, 'labels'); this.layers[layer.id] = layer }
  setLayoutProperty(id, property, value) { this.layers[id][property] = value }
}
const source = readFileSync(new URL('../src/components/Map.astro', import.meta.url), 'utf8')
  .split('<script>')[1].split('</script>')[0].replace(/^import .*$/gm, '')
vm.runInNewContext(stripTypeScriptTypes(source), {
  getLangFromUrl, useTranslations, URL, layers, Map, NavigationControl: class {}, setWorkerUrl() {}, workerUrl: '',
  window: { location: { href: `https://example.com${locale === 'en' ? '/' : '/ja/'}` } },
  document: { documentElement: { lang: locale }, querySelector: () => status, getElementById: id => toggles[id] },
})
assert.equal(layers.length, 12)
assert.equal(Object.keys(map.sources).length, 0)
map.events.load.forEach(fn => fn())
assert.equal(status.textContent, '')
assert.deepEqual(Object.keys(map.sources), ['tsunami'])
for (const layer of layers) {
  const toggle = toggles[`layer-${layer.id}`]
  assert.equal(toggle.disabled, false)
  toggle.checked = true; toggle.change()
  assert.equal(map.layers[layer.id].visibility, 'visible')
  toggle.checked = false; toggle.change()
  assert.equal(map.layers[layer.id].visibility, 'none')
  toggle.checked = true; toggle.change()
}
assert.equal(Object.keys(map.sources).length, 12)
map.events.error.forEach(fn => fn())
assert.equal(status.textContent, t('error'))
map.events.load.forEach(fn => fn())
assert.equal(status.textContent, t('error'))
console.log(`Passed (${locale}): language dropdown, translated UI, 12 layer controls, map binding, lazy loading, toggles, source reuse and error status.`)
}
