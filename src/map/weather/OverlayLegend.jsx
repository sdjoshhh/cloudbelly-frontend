import { valueToColor } from './ChloroplethLayer'

function OverlayLegend({ title, min, max, colourRamp, unit = '', offset = 0 }) {
  const steps = 80
  const stops = Array.from({ length: steps }, (_, i) => {
    const v = min + (i / (steps - 1)) * (max - min)
    return valueToColor(v, min, max, colourRamp)
  })

  const markers = [min, Math.round((min + max) / 2), max]

  return (
    <div
      className="fixed z-[1000] bg-white/90 rounded-lg shadow-md px-3.5 pt-2 pb-1.5 min-w-[220px] pointer-events-none"
      style={{ top: `${16 + offset * 80}px`, left: '79vw', transform: 'translateX(-50%)' }}
    >
      <div className="text-[11px] font-semibold text-gray-600 mb-1 text-center tracking-wide">
        {title}
      </div>
      <div
        className="h-3 rounded-full w-full"
        style={{ background: `linear-gradient(to right, ${stops.join(',')})` }}
      />
      <div className="flex justify-between mt-1 text-[11px] text-gray-500">
        {markers.map((v, i) => <span key={i}>{v}{unit}</span>)}
      </div>
    </div>
  )
}

export default OverlayLegend
