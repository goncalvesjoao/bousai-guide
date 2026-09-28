import { Map, NavigationControl, setWorkerUrl } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import 'maplibre-gl/dist/maplibre-gl.css'
import './style.css'
import layers from './layers.json'

setWorkerUrl(workerUrl)
const status = document.querySelector<HTMLParagraphElement>('#map-status')!
const list = document.querySelector<HTMLDivElement>('#layers')!
const map = new Map({
  container: 'map',
  style: 'https://tiles.openfreemap.org/styles/liberty',
  center: [138, 37],
  zoom: 4.5,
  minZoom: 2,
  maxZoom: 17,
  // Include Japan's outlying islands as well as the main archipelago.
  maxBounds: [[122, 20], [154, 46]],
  renderWorldCopies: false,
})
map.addControl(new NavigationControl())
map.on('error', () => {
  status.textContent = 'Some map data could not load. Missing shading does not mean an area is safe.'
})

// Local catalogue strings are trusted; no external/user HTML is inserted.
for (const layer of layers) {
  const row = document.createElement('section')
  row.className = 'layer'
  row.innerHTML = `<label><input type="checkbox" disabled ${layer.id === 'tsunami' ? 'checked' : ''}>${layer.name}</label>
    <small>${layer.japanese}</small>
    <details><summary>Official legend (Japanese)</summary><img src="${layer.legend}" loading="lazy" alt="${layer.name}: official colour legend"></details>`
  const toggle = row.querySelector<HTMLInputElement>('input')!
  list.append(row)
  const update = () => {
    if (toggle.checked && !map.getSource(layer.id)) {
      map.addSource(layer.id, {
        type: 'raster', tiles: [layer.url], tileSize: 256, minzoom: 2, maxzoom: 17,
        attribution: '<a href="https://disaportal.gsi.go.jp/">GSI Hazard Map Portal</a>',
      })
      map.addLayer({ id: layer.id, type: 'raster', source: layer.id, paint: { 'raster-opacity': 0.65 } },
        map.getStyle().layers.find(item => item.type === 'symbol')?.id)
    }
    if (map.getLayer(layer.id)) {
      map.setLayoutProperty(layer.id, 'visibility', toggle.checked ? 'visible' : 'none')
    }
  }
  toggle.addEventListener('change', update)
  map.on('load', () => { toggle.disabled = false; update() })
}
map.on('load', () => {
  if (status.textContent === 'Loading map…') status.textContent = ''
})
