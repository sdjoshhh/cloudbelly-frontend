import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { OMEGA_API_BASE, SUBURBS } from '../H11A_Omega'

const suburbFilter = SUBURBS.map(s => `'${s}'`).join(',')
const PECLET_GEOJSON_URL =
  `https://data.peclet.com.au/api/explore/v2.1/catalog/datasets/nsw-administrative-boundaries-theme-suburb/exports/geojson?where=suburbname in (${suburbFilter})`

async function fetchAvgValue(type, lat, lon, dateStart, dateEnd) {
  const url = `${OMEGA_API_BASE}/data?type=${type}&dateStart=${dateStart}&dateEnd=${dateEnd}&lat=${lat}&lon=${lon}`
  try {
    const res = await fetch(url)
    const json = await res.json()
    const events = json.events ?? []
    if (!events.length) return null
    const avg = events.reduce((sum, e) => sum + e.attribute.value, 0) / events.length
    return parseFloat(avg.toFixed(1))
  } catch {
    return null
  }
}

export function valueToColor(value, min, max, colourStops) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min)))
  const segment = 1 / (colourStops.length - 1)
  const i = Math.min(Math.floor(t / segment), colourStops.length - 2)
  const s = (t - i * segment) / segment
  const lerp = (a, b) => Math.round(a + s * (b - a))
  const [r1, g1, b1] = colourStops[i]
  const [r2, g2, b2] = colourStops[i + 1]
  return `rgb(${lerp(r1, r2)},${lerp(g1, g2)},${lerp(b1, b2)})`
}

function getCentroid(feature) {
  const coords = feature.geometry.type === 'Polygon'
    ? feature.geometry.coordinates[0]
    : feature.geometry.coordinates[0][0]
  const n = coords.length
  return {
    lat: parseFloat((coords.reduce((s, c) => s + c[1], 0) / n).toFixed(2)),
    lon: parseFloat((coords.reduce((s, c) => s + c[0], 0) / n).toFixed(2)),
  }
}

let geojsonCache = null
const dataCache = {}

function ChoroplethLayer({ type, dateStart, dateEnd, visible, onLoadingChange, colourRamp, popupLabel, unit }) {
  const map = useMap()
  const groupRef = useRef(null)
  const cancelRef = useRef(false)

  useEffect(() => {
    const paneName = `choroplethPane_${type}`
    if (!map.getPane(paneName)) {
      map.createPane(paneName)
      map.getPane(paneName).style.zIndex = 250
    }
    const group = L.layerGroup().addTo(map)
    groupRef.current = group
    return () => { group.clearLayers(); map.removeLayer(group) }
  }, [map])

  useEffect(() => {
    const pane = map.getPane(`choroplethPane_${type}`)
    if (pane) pane.style.display = visible ? '' : 'none'
  }, [visible, map, type])

  useEffect(() => {
    const key = `${type}__${dateStart}__${dateEnd}`
    cancelRef.current = false

    function renderSuburbs(suburbs) {
      const group = groupRef.current
      if (!group) return
      group.clearLayers()
      if (!suburbs.length) return

      const values = suburbs.map(s => s.avgValue)
      const min = Math.min(...values)
      const max = Math.max(...values)

      suburbs.forEach(({ feature, name, avgValue }) => {
        L.geoJSON(feature, {
          pane: `choroplethPane_${type}`,
          style: {
            fillColor: valueToColor(avgValue, min, max, colourRamp),
            fillOpacity: 0.65,
            color: '#fff',
            weight: 0.5,
          },
        })
          .bindPopup(
            `<strong>${name}</strong><br/>
             ${popupLabel}: <strong>${avgValue}${unit}</strong><br/>
             <span style="font-size:11px;color:#888">${dateStart} → ${dateEnd}</span>`
          )
          .addTo(group)
      })
    }

    async function load() {
      if (dataCache[key]) {
        renderSuburbs(dataCache[key])
        return
      }

      onLoadingChange?.(true)

      if (!geojsonCache) {
        try {
          const res = await fetch(PECLET_GEOJSON_URL)
          geojsonCache = await res.json()
        } catch (e) {
          console.error('Failed to load suburb boundaries from Peclet:', e)
          onLoadingChange?.(false)
          return
        }
      }

      if (cancelRef.current) return

      const features = geojsonCache.features

      const CONCURRENCY = 20
      const results = []

      for (let i = 0; i < features.length; i += CONCURRENCY) {
        if (cancelRef.current) return
        const batch = features.slice(i, i + CONCURRENCY)
        const batchResults = await Promise.all(
          batch.map(async feature => {
            const { lat, lon } = getCentroid(feature)
            const name = feature.properties.suburbname
              ?? feature.properties.locality_name
              ?? `${lat}, ${lon}`
            const avgValue = await fetchAvgValue(type, lat, lon, dateStart, dateEnd)
            if (avgValue === null) return null
            return { feature, name, avgValue }
          })
        )
        results.push(...batchResults)
      }

      if (cancelRef.current) return

      const suburbs = results.filter(Boolean)
      dataCache[key] = suburbs
      renderSuburbs(suburbs)
      onLoadingChange?.(false)
    }

    load()
    return () => { cancelRef.current = true }
  }, [type, dateStart, dateEnd])

  return null
}

export default ChoroplethLayer
