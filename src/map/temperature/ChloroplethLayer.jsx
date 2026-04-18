import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

const NSW_STATIONS = [ // the group that made this (H11A-OMEGA) plan on adding a way to ge the temp for coords, so this will all be removed and changed out with the geocode locations later
  { location: 'sydney_(observatory_hill)',           state: 'nsw', label: 'Sydney',        coords: [-33.8688, 151.2093] },
  { location: 'newcastle_nobbys_signal_station_aws', state: 'nsw', label: 'Newcastle',     coords: [-32.9167, 151.7500] },
  { location: 'wollongong',                          state: 'nsw', label: 'Wollongong',    coords: [-34.4278, 150.8931] },
  { location: 'orange_agricultural_station',         state: 'nsw', label: 'Orange',        coords: [-33.2833, 149.1000] },
  { location: 'bathurst_agricultural_station',       state: 'nsw', label: 'Bathurst',      coords: [-33.4167, 149.5833] },
  { location: 'dubbo_airport_aws',                   state: 'nsw', label: 'Dubbo',         coords: [-32.2167, 148.5667] },
  { location: 'tamworth_airport_aws',                state: 'nsw', label: 'Tamworth',      coords: [-31.0833, 150.8333] },
  { location: 'wagga_wagga_amo',                     state: 'nsw', label: 'Wagga Wagga',   coords: [-35.1667, 147.4667] },
  { location: 'albury_airport',                      state: 'nsw', label: 'Albury',        coords: [-36.0667, 146.9500] },
  { location: 'coffs_harbour_mo',                    state: 'nsw', label: 'Coffs Harbour', coords: [-30.3000, 153.1167] },
  { location: 'lismore_airport',                     state: 'nsw', label: 'Lismore',       coords: [-28.8333, 153.2667] },
  { location: 'broken_hill_airport_aws',             state: 'nsw', label: 'Broken Hill',   coords: [-31.9833, 141.4667] },
  { location: 'griffith_airport_aws',                state: 'nsw', label: 'Griffith',      coords: [-34.2500, 146.0667] },
  { location: 'armidale_airport',                    state: 'nsw', label: 'Armidale',      coords: [-30.5333, 151.6167] },
  { location: 'nowra_ran_air_station_aws',           state: 'nsw', label: 'Nowra',         coords: [-34.9333, 150.5333] },
]

const API_BASE = 'https://a683sqnr5m.execute-api.ap-southeast-2.amazonaws.com'

async function fetchAvgTemp(location, state, dateStart, dateEnd) {
  const url = `${API_BASE}/data?type=max_temperature&dateStart=${dateStart}&dateEnd=${dateEnd}&location=${encodeURIComponent(location)}&state=${state}`
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

export function tempToColor(temp, min, max) {
  const t = Math.max(0, Math.min(1, (temp - min) / (max - min)))
  let r, g, b
  if (t < 0.5) {
    const s = t / 0.5
    r = Math.round(30 + s * (255 - 30))
    g = Math.round(144 + s * (235 - 144))
    b = Math.round(255 + s * (50 - 255))
  } else {
    const s = (t - 0.5) / 0.5
    r = 255
    g = Math.round(235 + s * (50 - 235))
    b = Math.round(50 + s * (30 - 50))
  }
  return `rgb(${r},${g},${b})`
}

const stationDataCache = {}

function ChoroplethLayer({ dateStart, dateEnd, visible, onLoadingChange }) {
  const map = useMap()
  const groupRef = useRef(null)
  const cancelRef = useRef(false)

  // One-time setup: custom pane sitting below Leaflet's markerPane (z 600)
  useEffect(() => {
    if (!map.getPane('choroplethPane')) {
      map.createPane('choroplethPane')
      map.getPane('choroplethPane').style.zIndex = 250
    }

    const group = L.layerGroup().addTo(map)
    groupRef.current = group

    return () => {
      group.clearLayers()
      map.removeLayer(group)
    }
  }, [map])

  // Toggle visibility by hiding the pane element — no unmount, no refetch
  useEffect(() => {
    const pane = map.getPane('choroplethPane')
    if (pane) pane.style.display = visible ? '' : 'none'
  }, [visible, map])

  // Re-fetch only when the date range changes
  useEffect(() => {
    const key = `${dateStart}__${dateEnd}`
    cancelRef.current = false

    function renderStations(stations) {
      const group = groupRef.current
      if (!group) return
      group.clearLayers()
      if (!stations.length) return

      const temps = stations.map(s => s.avgTemp)
      const minTemp = Math.min(...temps)
      const maxTemp = Math.max(...temps)

      stations.forEach(({ label, coords, avgTemp }) => {
        L.circle(coords, {
          pane: 'choroplethPane',
          radius: 35000,
          fillColor: tempToColor(avgTemp, minTemp, maxTemp),
          fillOpacity: 0.55,
          color: '#fff',
          weight: 1,
          interactive: true,
        })
          .bindPopup(
            `<strong>${label}</strong><br/>
             Avg max: <strong>${avgTemp}°C</strong><br/>
             <span style="font-size:11px;color:#888">${dateStart} → ${dateEnd}</span>`
          )
          .addTo(group)
      })
    }

    async function load() {
      if (stationDataCache[key]) {
        renderStations(stationDataCache[key])
        return
      }

      onLoadingChange?.(true)

      const results = await Promise.all(
        NSW_STATIONS.map(async station => {
          const avgTemp = await fetchAvgTemp(station.location, station.state, dateStart, dateEnd)
          return avgTemp !== null ? { ...station, avgTemp } : null
        })
      )

      if (cancelRef.current) return

      const stations = results.filter(Boolean)
      stationDataCache[key] = stations
      renderStations(stations)
      onLoadingChange?.(false)
    }

    load()
    return () => { cancelRef.current = true }
  }, [dateStart, dateEnd])

  return null
}

export default ChoroplethLayer
