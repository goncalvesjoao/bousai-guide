// Run with: node tests/map.mjs
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
const layers = JSON.parse(readFileSync(new URL('../src/layers.json', import.meta.url)))
const rows = []
const status = { textContent: 'Loading map…' }
let map
class Map {
  constructor(options) { map = this; this.options = options; this.events = {}; this.layers = {}; this.sources = {} }
  addControl() {}
  on(event, fn) { (this.events[event] ??= []).push(fn) }
  addSource(id, source) { assert.ok(!this.sources[id]); this.sources[id] = source }
  getSource(id) { return this.sources[id] }
  getLayer(id) { return this.layers[id] }
  getStyle() { return { layers: [{ id: 'labels', type: 'symbol' }] } }
  addLayer(layer, before) { assert.equal(before, 'labels'); this.layers[layer.id] = layer }
  setLayoutProperty(id, property, value) { this.layers[id][property] = value }
}
const source = readFileSync(new URL('../src/main.ts', import.meta.url), 'utf8').replace(/^import .*$/gm, '')
vm.runInNewContext(ts.transpile(source), {
  layers, Map, NavigationControl: class {}, setWorkerUrl() {}, workerUrl: '',
  document: {
    querySelector: selector => selector === '#layers' ? { append: row => rows.push(row) } : status,
    createElement: () => {
      const toggle = { disabled: true, addEventListener: (_, fn) => toggle.change = fn }
      return { set innerHTML(html) { toggle.checked = html.includes('checked'); }, querySelector: () => toggle }
    },
  },
})
assert.equal(rows.length, 12)
assert.equal(new Set(layers.map(layer => layer.id)).size, 12)
assert.equal(Object.keys(map.sources).length, 0)
assert.ok(rows.every(row => row.querySelector().disabled))
map.events.load.forEach(fn => fn())
assert.deepEqual(Object.keys(map.sources), ['tsunami'])
assert.ok(!map.sources.tsunami.bounds, 'No Chiba restriction')
assert.match(map.sources.tsunami.tiles[0], /04_tsunami_newlegend_data/)
for (const [index, row] of rows.entries()) {
  const toggle = row.querySelector()
  assert.equal(toggle.disabled, false)
  toggle.checked = true; toggle.change()
  assert.equal(map.layers[layers[index].id].visibility, 'visible')
  toggle.checked = false; toggle.change()
  assert.equal(map.layers[layers[index].id].visibility, 'none')
  toggle.checked = true; toggle.change() // Existing sources are reused.
}
assert.equal(Object.keys(map.sources).length, 12)
map.events.error.forEach(fn => fn())
assert.match(status.textContent, /could not load/)
console.log('12 layers: lazy loading, independent toggles, reuse, nationwide coverage and error checks passed')
