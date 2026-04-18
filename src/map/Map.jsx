import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import './Map.css'
import MarkerLayer from './markerLayer/MarkerLayer'
import ChoroplethLayer from './temperature/ChloroplethLayer'
import TemperatureLegend from './temperature/TemperatureLegend'
import ChartSingle from '../chart/ChartSingle'
import { FaTemperatureHalf } from "react-icons/fa6";

const today = new Date()
const thirtyDaysAgo = new Date(today)
thirtyDaysAgo.setDate(today.getDate() - 30)

function toDateString(d) {
  return d.toISOString().split('T')[0]
}

function InvalidateSize() {
  const map = useMap()
  useEffect(() => {
    setTimeout(() => map.invalidateSize(), 100)
  }, [map])
  return null
}

function Map() {
  const [markersLoading, setMarkersLoading] = useState(true)
  const [tempLoading, setTempLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [choroplethVisible, setChoroplethVisible] = useState(false)
  const [dateStart, setDateStart] = useState(toDateString(thirtyDaysAgo))
  const [dateEnd, setDateEnd] = useState(toDateString(today))

  const countryBounds = [
    [-40.0, 120.0],
    [-15.0, 170.0],
  ]

  return (
    <>
      <div className="map-container">
        {markersLoading && (
          <div className="map-loading">
            <div className="map-loading-box">
              <div className="map-spinner" />
              <p>Loading...</p>
            </div>
          </div>
        )}

        <div className="map-info">
          {selected ? (
            <div className="text">
              <strong>{selected.label}</strong>
              <p>{selected.count} Sales</p>
              <p>Average Price: ${selected.avgPrice.toLocaleString()}</p>
              <ChartSingle suburb={selected.label} state="NSW" />
            </div>
          ) : (
            <div className="text">
              <strong>Welcome to our interactive map!</strong>
              <br />
              <p>Click a marker to see property data</p>
            </div>
          )}

          {choroplethVisible && (
            <div className="date-inputs">
              <label>
                From
                <input
                  type="date"
                  value={dateStart}
                  max={dateEnd}
                  onChange={e => setDateStart(e.target.value)}
                />
              </label>
              <label>
                To
                <input
                  type="date"
                  value={dateEnd}
                  min={dateStart}
                  onChange={e => setDateEnd(e.target.value)}
                />
              </label>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button
          className={`map-mode-toggle ${choroplethVisible ? 'active' : ''}`}
          onClick={() => setChoroplethVisible(v => !v)}
          disabled={tempLoading}
          title="Toggle temperature overlay"
        >
          <FaTemperatureHalf />
        </button>

        <MapContainer
          center={[-32.0, 147.0]}
          minZoom={4}
          zoom={6}
          className="map"
          maxBounds={countryBounds}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <InvalidateSize />

          <MarkerLayer onLoadingChange={setMarkersLoading} onMarkerClick={setSelected} />

          <ChoroplethLayer
            dateStart={dateStart}
            dateEnd={dateEnd}
            visible={choroplethVisible}
            onLoadingChange={setTempLoading}
          />
        </MapContainer>

        {choroplethVisible && <TemperatureLegend min={15} max={45} />}
      </div>
    </>
  )
}

export default Map
