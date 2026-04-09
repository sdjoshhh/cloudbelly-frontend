import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './Map.css'
import MarkerLayer from './markerLayer/MarkerLayer'

function Map() {
  const countryBounds = [
    [-44.0, 112.0],
    [-10.0, 154.0]
  ]
  return (
    <div className="map-container">
      <MapContainer
        center={[-25.2744, 133.7751]}
        zoom={5}
        className="map"
        maxBounds={countryBounds} 
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerLayer />
      </MapContainer>
    </div>
  )
}

export default Map
