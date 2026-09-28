// Run after npm run build: node tests/map.mjs
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import vm from 'node:vm'

const layers = JSON.parse(readFileSync(new URL('../src/resources/layers.json', import.meta.url)))
const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8')
const toggles = Object.fromEntries(layers.map(layer => {
  assert.ok(html.includes(`id="layer-${layer.id}"`), `${layer.id} is rendered by Astro`)
  assert.ok(html.includes(`id="description-${layer.id}"`))
  const toggle = { checked: layer.id === 'tsunami', disabled: true, addEventListener: (_, fn) => toggle.change = fn }
  return [`layer-${layer.id}`, toggle]
}))
const status = { textContent: 'Loading map…' }
let map
class Map {
  constructor() { map = this; this.events = {}; this.layers = {}; this.sources = {} }
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
  layers, Map, NavigationControl: class {}, setWorkerUrl() {}, workerUrl: '',
  document: { querySelector: () => status, getElementById: id => toggles[id] },
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
assert.match(status.textContent, /could not load/)
console.log('Passed: 12 rendered layer controls, map binding, lazy loading, toggles, source reuse and error status.')
