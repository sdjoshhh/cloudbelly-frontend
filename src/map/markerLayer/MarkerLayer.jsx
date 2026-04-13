import { useState, useEffect, memo, useMemo } from 'react'
import { Marker, Popup } from 'react-leaflet'

const SUBURBS = [
  "Blacktown", "Parramatta", "Chatswood", "Bondi", "Manly",
  "Newtown", "Randwick", "Surry Hills", "Castle Hill", "Homebush"
]

const geocodeCache = {}

async function geocodePlace(name) {
  if (geocodeCache[name]) return geocodeCache[name]
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(name + ', NSW, Australia')}&format=json&limit=1`
  const res = await fetch(url, { headers: { 'Accept-Language': 'en', 'User-Agent': 'PropertyApp/1.0' } })
  const data = await res.json()
  if (!data.length) return null
  const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)]
  geocodeCache[name] = coords
  return coords
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

let cachedMarkers = null
let fetchPromise = null

function getMarkers() {
  if (cachedMarkers) return Promise.resolve(cachedMarkers)
  if (fetchPromise) return fetchPromise

  fetchPromise = Promise.all(
    SUBURBS.map(s =>
      fetch(`https://tvfiek3hzi.execute-api.us-east-1.amazonaws.com/dev/api/v1/events?suburb=${encodeURIComponent(s)}&state=NSW`)
        .then(r => r.json())
    )
  ).then(async results => {
    const markers = []
    for (let i = 0; i < SUBURBS.length; i++) {
      const suburb = SUBURBS[i]
      const events = results[i].events ?? []
      if (!events.length) continue
      const total = events.reduce((sum, e) => sum + e.attributes.price, 0)
      if (i > 0) await sleep(1000)
      const coords = await geocodePlace(suburb)
      if (!coords) continue
      markers.push({
        id: suburb,
        position: coords,
        label: suburb,
        count: events.length,
        avgPrice: Math.round(total / events.length),
      })
    }
    cachedMarkers = markers
    return markers
  })

  return fetchPromise
}

const PlaceMarker = memo(({ position, label, count, avgPrice }) => (
  <Marker position={position}>
    <Popup>
      <strong>{label}</strong><br />
      {count} sales · avg ${avgPrice.toLocaleString()}
    </Popup>
  </Marker>
))

function MarkerLayer({ onLoadingChange }) {
  const [markers, setMarkers] = useState(cachedMarkers ?? [])

  useEffect(() => {
    if (cachedMarkers) {
      onLoadingChange(false)
      return
    }
    onLoadingChange(true)
    getMarkers().then(m => {
      setMarkers(m)
      onLoadingChange(false)
    })
  }, [])

  const renderedMarkers = useMemo(
    () => markers.map(m => <PlaceMarker key={m.id} {...m} />),
    [markers]
  )

  return <>{renderedMarkers}</>
}

export default MarkerLayer
