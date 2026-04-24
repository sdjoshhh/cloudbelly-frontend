import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import './Map.css'
import MarkerLayer from './markerLayer/MarkerLayer'
import ChoroplethLayer from './weather/ChloroplethLayer'
import OverlayLegend from './weather/OverlayLegend'
import ChartSingle from '../chart/ChartSingle'
import { WEATHER_MODES } from '../services/weatherApi'
import { ELEC_MODES } from '../services/elecPriceApi'
import ElecChoroplethLayer from './electricity/ElecChloroplethLayer'
import ElecOverlayLegend from './electricity/ElecOverlayLegend'

const DATE_START = '2026-01-02'
const DATE_END = '2026-01-05'

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
  const [elecVisible, setElecVisible] = useState(false)

  const countryBounds = [[-40.0, 120.0], [-15.0, 170.0]]

  useEffect(() => {
      document.title = "Map - Housefly";
      // Lock scroll when component mounts
      document.body.classList.add('no-scroll');
  
      // Unlock scroll when component unmounts
      return () => {
        document.body.classList.remove('no-scroll');
      };
    }, []);

  const toggleOverlay = key =>
    setActiveOverlays(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })

  return (
    <div className="map-container">
      {markersLoading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-[1001]">
          <div className="bg-white px-8 py-6 rounded-xl flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-4 border-gray-200 border-t-gray-500 rounded-full animate-spin" />
            <p className="text-sm text-gray-700">Loading...</p>
          </div>
        </div>
      )}

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
      </div>

      <div className="absolute top-4 right-7 z-[1000] flex flex-col gap-2">
        {Object.values(WEATHER_MODES).map(mode => (
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
        {ELEC_MODES.map(m => (
          <button
            key={m.key}
            onClick={() => setElecVisible(prev => !prev)}
            title={m.title}
            className={`w-[8vh] h-[8vh] rounded-full shadow-md flex items-center justify-center text-base transition-colors
              ${elecVisible
                ? 'bg-blue-600 text-white'
                : 'bg-white/80 text-black hover:bg-gray-600 hover:text-white'
              }`}
          >
            {m.icon}
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

        {Object.values(WEATHER_MODES).map(mode => (
          <ChoroplethLayer
            key={mode.type}
            type={mode.type}
            dateStart={DATE_START}
            dateEnd={DATE_END}
            visible={activeOverlays.has(mode.type)}
            onLoadingChange={setOverlayLoading}
            colourRamp={mode.colourRamp}
            popupLabel={mode.popupLabel}
            unit={mode.unit}
          />
        ))}
        <ElecChoroplethLayer
          visible={elecVisible}
          onLoadingChange={setOverlayLoading}
        />
      </MapContainer>

      {Object.values(WEATHER_MODES)
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
      {elecVisible && (
        <ElecOverlayLegend
          offset={Object.values(WEATHER_MODES).filter(m => activeOverlays.has(m.type)).length}
        />
      )}
    </div>
  )
}

export default Map
