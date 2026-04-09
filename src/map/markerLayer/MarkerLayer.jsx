import { useState, useEffect, memo, useMemo } from 'react'
import { Marker, Popup } from 'react-leaflet'

const CITY_COORDS = {
  Sydney:    [-33.8688, 151.2093],
  Melbourne: [-37.8136, 144.9631],
  Brisbane:  [-27.4698, 153.0251],
  Perth:     [-31.9505, 115.8605],
  Adelaide:  [-34.9285, 138.6007],
}

let cachedMarkers = null
let fetchPromise = null

function fetchMarkers() {
  if (cachedMarkers) return Promise.resolve(cachedMarkers)
  if (fetchPromise) return fetchPromise

  fetchPromise = fetch('https://tvfiek3hzi.execute-api.us-east-1.amazonaws.com/dev/api/v1/events?suburb=N%2FA')
    .then(res => res.json())
    .then(data => {
      const byCity = {}
      data.events
        .filter(event => CITY_COORDS[event.locations[0]])
        .forEach(event => {
          const city = event.locations[0]
          if (!byCity[city]) byCity[city] = { count: 0, total: 0 }
          byCity[city].count += 1
          byCity[city].total += event.attributes.price
        })

      cachedMarkers = Object.entries(byCity).map(([city, { count, total }]) => ({
        id: city,
        position: CITY_COORDS[city],
        city,
        count,
        avgPrice: Math.round(total / count),
      }))

      return cachedMarkers
    })

  return fetchPromise
}

const CityMarker = memo(({ position, city, count, avgPrice }) => (
  <Marker position={position}>
    <Popup>
      <strong>{city}</strong><br />
      {count} events · avg ${avgPrice.toLocaleString()}
    </Popup>
  </Marker>
))

function MarkerLayer() {
  const [markers, setMarkers] = useState(cachedMarkers ?? [])

  useEffect(() => {
    if (cachedMarkers) return
    fetchMarkers().then(setMarkers)
  }, [])

  const renderedMarkers = useMemo(
    () => markers.map(m => <CityMarker key={m.id} {...m} />),
    [markers]
  )

  return renderedMarkers
}

export default MarkerLayer
