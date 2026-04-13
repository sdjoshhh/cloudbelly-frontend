import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import './Map.css'
import MarkerLayer from './markerLayer/MarkerLayer'

function InvalidateSize() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100)
  }, [map])
  return null
}

function Map() {
  const [loading, setLoading] = useState(true)

  const countryBounds = [
    [-44.0, 112.0],
    [-10.0, 154.0]
  ]

  return (
    <div className="map-container">
      {loading && (
        <div className="map-loading">
          <div className="map-loading-box">
            <div className="map-spinner" />
            <p>Loading...</p>
          </div>
        </div>
      )}
      <div className='map-info'>
        <div className='text'>
          <strong>Welcome to our interactive map!</strong><br />
          <a>Lorem ipsum dolors umbridge or whatever it was i can't remember that shit</a>
        </div>
        
      </div>
      <MapContainer
        center={[-25.2744, 133.7751]}
        minZoom={4}
        zoom={5}
        className="map"
        maxBounds={countryBounds}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <InvalidateSize />
        <MarkerLayer onLoadingChange={setLoading} />
      </MapContainer>
    </div>
  )
}

export default Map
