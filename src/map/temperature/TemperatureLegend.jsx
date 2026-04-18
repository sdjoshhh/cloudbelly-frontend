import { tempToColor } from './ChloroplethLayer'
import './TemperatureLegend.css'

function TemperatureLegend({ min = 15, max = 45 }) {
  const steps = 80
  const stops = Array.from({ length: steps }, (_, i) => {
    const temp = min + (i / (steps - 1)) * (max - min)
    return tempToColor(temp, min, max)
  })

  const gradient = `linear-gradient(to right, ${stops.join(',')})`

  const markers = [min, Math.round((min + max) / 2), max]

  return (
    <div className="temp-legend">
      <div className="temp-legend-title">Avg max temperature (°C)</div>
      <div className="temp-legend-bar" style={{ background: gradient }} />
      <div className="temp-legend-labels">
        {markers.map((v, i) => (
          <span key={i}>{v}°</span>
        ))}
      </div>
    </div>
  )
}

export default TemperatureLegend
