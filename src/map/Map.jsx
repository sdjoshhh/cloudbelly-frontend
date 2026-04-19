import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import './Map.css'
import MarkerLayer from './markerLayer/MarkerLayer'
import ChoroplethLayer from './weather/ChloroplethLayer'
import OverlayLegend from './weather/OverlayLegend'
import ChartSingle from '../chart/ChartSingle'
import { OVERLAY_MODES } from './H11A_Omega'

const today = new Date()
const thirtyDaysAgo = new Date(today)
thirtyDaysAgo.setDate(today.getDate() - 30)
const toDateString = d => d.toISOString().split('T')[0]

function InvalidateSize() {
  const map = useMap()
  useEffect(() => { setTimeout(() => map.invalidateSize(), 100) }, [map])
  return null
}

function Map() {
  const [markersLoading, setMarkersLoading] = useState(true)
  const [overlayLoading, setOverlayLoading] = useState(false)
  const [selected, setSelected] = useState(null)
  const [activeOverlays, setActiveOverlays] = useState(new Set())
  const [dateStart, setDateStart] = useState(toDateString(thirtyDaysAgo))
  const [dateEnd, setDateEnd] = useState(toDateString(today))

  const countryBounds = [[-40.0, 120.0], [-15.0, 170.0]]

  const toggleOverlay = key =>
    setActiveOverlays(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  return (
    <div className="map-container">
      {/* Loading overlay */}
      {markersLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[1001]">
          <div className="bg-white px-8 py-6 rounded-xl flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-700">Loading...</p>
          </div>
        </div>
      )}

      {/* Info panel */}
      <div className="absolute top-[50vh] left-[2.5vw] w-[20vw] h-[45vh] z-[1000] bg-white/80 rounded-[1vw] shadow-md">
        <div className="p-[0.7vw] flex flex-col gap-[1vh]">
          {selected ? (
            <>
              <strong>{selected.label}</strong>
              <p>{selected.count} Sales</p>
              <p>Average Price: ${selected.avgPrice.toLocaleString()}</p>
              <ChartSingle suburb={selected.label} state="NSW" />
            </>
          ) : (
            <>
              <strong>Welcome to our interactive map!</strong>
              <p>Click a marker to see property data</p>
            </>
          )}
        </div>

        {activeOverlays.size > 0 && (
          <div className="flex flex-col gap-1.5 px-[0.7vw]">
            {['From', 'To'].map((lbl, i) => {
              const isFrom = i === 0
              return (
                <label key={lbl} className="flex flex-col text-[11px] font-semibold text-gray-800 gap-0.5">
                  {lbl}
                  <input
                    type="date"
                    value={isFrom ? dateStart : dateEnd}
                    min={isFrom ? undefined : dateStart}
                    max={isFrom ? dateEnd : undefined}
                    onChange={e => isFrom ? setDateStart(e.target.value) : setDateEnd(e.target.value)}
                    className="text-xs px-1.5 py-1 border border-gray-300 rounded-md bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-blue-600"
                  />
                </label>
              )
            })}
          </div>
        )}
      </div>

      {/* Overlay toggle buttons */}
      <div className="absolute top-4 right-7 z-[1000] flex flex-col gap-2">
        {Object.values(OVERLAY_MODES).map(mode => (
          <button
            key={mode.type}
            onClick={() => toggleOverlay(mode.type)}
            disabled={overlayLoading}
            title={mode.title}
            className={`w-[8vh] h-[8vh] rounded-full shadow-md flex items-center justify-center text-base transition-colors
              ${activeOverlays.has(mode.type)
                ? 'bg-blue-600 text-white'
                : 'bg-white/80 text-black hover:bg-gray-600 hover:text-white'
              }`}
          >
            {mode.icon}
          </button>
        ))}
      </div>

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

        {Object.values(OVERLAY_MODES).map(mode => (
          <ChoroplethLayer
            key={mode.type}
            type={mode.type}
            dateStart={dateStart}
            dateEnd={dateEnd}
            visible={activeOverlays.has(mode.type)}
            onLoadingChange={setOverlayLoading}
            colourRamp={mode.colourRamp}
            popupLabel={mode.popupLabel}
            unit={mode.unit}
          />
        ))}
      </MapContainer>

      {Object.values(OVERLAY_MODES)
        .filter(mode => activeOverlays.has(mode.type))
        .map((mode, i) => (
          <OverlayLegend
            key={mode.type}
            title={`${mode.label} (${mode.unit})`}
            min={mode.min}
            max={mode.max}
            colourRamp={mode.colourRamp}
            unit={mode.unit}
            offset={i}
          />
        ))
      }
    </div>
  )
}

export default Map
