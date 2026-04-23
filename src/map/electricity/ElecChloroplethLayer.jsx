import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import { getElecPrice } from '../../services/elecPriceApi'

const DATE_START = '2026-04-10'
const DATE_END = '2026-04-19'

const STATES = [
  { id: 'NSW1', label: 'New South Wales' },
  { id: 'VIC1', label: 'Victoria' },
  { id: 'QLD1', label: 'Queensland' },
  { id: 'TAS1', label: 'Tasmania' },
]

const ABS_GEOJSON_URL =
  'https://raw.githubusercontent.com/rowanhogan/australian-states/master/states.geojson'

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

export const PRICE_RAMP = [[255, 247, 0], [255, 140, 0], [220, 38, 38]]

function parseAvgPrice(rows) {
  try {
    if (!Array.isArray(rows) || !rows.length) return null
    const prices = rows.map(r => r.avgPrice).filter(v => v != null)
    if (!prices.length) return null
    return parseFloat((prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2))
  } catch (e) {
    console.error('[ElecChoropleth] Failed to parse price response:', e)
    return null
  }
}

let geojsonCache = null
const dataCache = {}

function ElecChoroplethLayer({
  visible = true,
  onLoadingChange,
  colourRamp = PRICE_RAMP,
}) {
  const map = useMap()
  const groupRef  = useRef(null)
  const cancelRef = useRef(false)

  useEffect(() => {
    const paneName = 'elecChoroplethPane'
    if (!map.getPane(paneName)) {
      map.createPane(paneName)
      map.getPane(paneName).style.zIndex = 250
    }
    const group = L.layerGroup().addTo(map)
    groupRef.current = group
    return () => {
      group.clearLayers()
      map.removeLayer(group)
    }
  }, [map])

  useEffect(() => {
    const pane = map.getPane('elecChoroplethPane')
    if (pane) pane.style.display = visible ? '' : 'none'
  }, [visible, map])

  useEffect(() => {
    cancelRef.current = false
    const cacheKey = `price__${DATE_START}__${DATE_END}`

    function renderStates(stateData) {
      const group = groupRef.current
      if (!group) return
      group.clearLayers()
      if (!stateData.length) return

      const values = stateData.map(s => s.avgPrice)
      const min = Math.min(...values)
      const max = Math.max(...values)

      stateData.forEach(({ feature, label, avgPrice }) => {
        const geoShape = feature.properties?.geo_shape?.geometry ?? feature.geometry

        L.geoJSON({ type: 'Feature', geometry: geoShape, properties: {} }, {
          pane: 'elecChoroplethPane',
          style: {
            fillColor: valueToColor(avgPrice, min, max, colourRamp),
            fillOpacity: 0.75,
            color: '#fff',
            weight: 1,
          },
        })
          .bindPopup(`
            <strong style="font-size:14px">${label}</strong><br/>
            <span style="font-size:12px;color:#555">${DATE_START} → ${DATE_END}</span>
            <hr style="margin:6px 0;border:none;border-top:1px solid #eee"/>
            <span style="font-size:13px">Avg price: <strong>$${avgPrice.toFixed(2)}/MWh</strong></span>
          `)
          .addTo(group)
      })
    }

    async function load() {
      if (dataCache[cacheKey]) {
        renderStates(dataCache[cacheKey])
        return
      }

      onLoadingChange?.(true)

      if (!geojsonCache) {
        try {
          const res = await fetch(ABS_GEOJSON_URL)
          geojsonCache = await res.json()
          if (!geojsonCache.features?.length) {
            console.error('[ElecChoropleth] GeoJSON returned no features')
            onLoadingChange?.(false)
            return
          }
        } catch (e) {
          console.error('[ElecChoropleth] Failed to load state boundaries:', e)
          onLoadingChange?.(false)
          return
        }
      }

      if (cancelRef.current) return

      const results = await Promise.all(
        STATES.map(async ({ id, label }) => {
          let avgPrice = null
          try {
            const rows = await getElecPrice(id)
            avgPrice = parseAvgPrice(rows)
          } catch (e) {
            console.error(`[ElecChoropleth] getElecPrice failed for ${id}:`, e)
          }
          if (avgPrice == null) return null

          const feature = geojsonCache.features.find(f => {
            const props = f.properties ?? {}
            return (
              props.STATE_CODE === id ||
              props.STE_CODE21 === id ||
              props.abb?.toUpperCase() === id ||
              (props.STATE_NAME ?? props.STE_NAME21 ?? '').toLowerCase() === label.toLowerCase()
            )
          })

          if (!feature) {
            console.warn(`[ElecChoropleth] No GeoJSON feature matched for ${id}`)
            return null
          }

          return { feature, label, avgPrice }
        })
      )

      if (cancelRef.current) return

      const stateData = results.filter(Boolean)
      dataCache[cacheKey] = stateData
      renderStates(stateData)
      onLoadingChange?.(false)
    }

    load()
    return () => { cancelRef.current = true }
  }, [])

  return null
}

export default ElecChoroplethLayer
