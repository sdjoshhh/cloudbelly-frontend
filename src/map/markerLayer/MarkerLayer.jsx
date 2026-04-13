import { useState, useEffect, memo, useMemo } from 'react'
import { Marker, Popup, useMapEvents } from 'react-leaflet'

const SUBURBS = [
  "Blacktown", "Parramatta", "Chatswood", "Bondi", "Manly",
  "Newtown", "Randwick", "Surry Hills", "Castle Hill", "Homebush"
]

const CITY_COORDS = [-33.8688, 151.2093] // Sydney

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

const cache = { city: null, suburb: null }
let fetchPromise = null

function getAllData() {
  if (fetchPromise) return fetchPromise

  fetchPromise = Promise.all(
    SUBURBS.map(s =>
      fetch(`https://tvfiek3hzi.execute-api.us-east-1.amazonaws.com/dev/api/v1/events?suburb=${encodeURIComponent(s)}&state=NSW`)
        .then(r => r.json())
    )
  ).then(async results => {
    // suburb markers
    const suburbMarkers = []
    let totalPrice = 0
    let totalCount = 0

    for (let i = 0; i < SUBURBS.length; i++) {
      const suburb = SUBURBS[i]
      const events = results[i].events ?? []
      if (!events.length) continue

      const suburbTotal = events.reduce((sum, e) => sum + e.attributes.price, 0)
      totalPrice += suburbTotal
      totalCount += events.length

      if (i > 0) await sleep(1000)
      const coords = await geocodePlace(suburb)
      if (!coords) continue

      suburbMarkers.push({
        id: suburb,
        position: coords,
        label: suburb,
        count: events.length,
        avgPrice: Math.round(suburbTotal / events.length),
      })
    }

    cache.suburb = suburbMarkers

    // single city marker from all suburb data
    cache.city = [{
      id: 'sydney',
      position: CITY_COORDS,
      label: 'Sydney', // hard coded to sydney rn, need to change later when we add more city stuff
      count: totalCount,
      avgPrice: totalCount > 0 ? Math.round(totalPrice / totalCount) : 0,
    }]

    return cache
  })

  return fetchPromise
}

const PlaceMarker = memo(({ position, label, count, avgPrice }) => (
  <Marker position={position}>
    <Popup>
      <strong>{label}</strong><br />
      {count} Sales, Average Price ${avgPrice.toLocaleString()}
    </Popup>
  </Marker>
))

function MarkerLayer({ onLoadingChange }) {
  const [zoom, setZoom] = useState(5)
  const [cityMarkers, setCityMarkers] = useState([])
  const [suburbMarkers, setSuburbMarkers] = useState([])

  useMapEvents({
    zoomend: (e) => setZoom(e.target.getZoom())
  })

  useEffect(() => {
    if (cache.city && cache.suburb) {
      setCityMarkers(cache.city)
      setSuburbMarkers(cache.suburb)
      onLoadingChange(false)
      return
    }
    onLoadingChange(true)
    getAllData().then(data => {
      setCityMarkers(data.city)
      setSuburbMarkers(data.suburb)
      onLoadingChange(false)
    })
  }, [])

  const markers = zoom >= 6 ? suburbMarkers : cityMarkers

  const renderedMarkers = useMemo(
    () => markers.map(m => <PlaceMarker key={m.id} {...m} />),
    [markers]
  )

  return <>{renderedMarkers}</>
}

export default MarkerLayer
