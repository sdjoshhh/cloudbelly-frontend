import { useState, useEffect, useRef } from 'react'

const COLORS = [
  '#378ADD', '#E24B4A', '#1D9E75', '#EF9F27',
  '#7F77DD', '#D4537E', '#639922', '#D85A30',
]

const cache = {}

function getData({ suburb, state }) {
  const key = `${formatSuburb(suburb)}-${state}`
  if (cache[key]) return cache[key]
  const url = `https://gge1ls7ns8.execute-api.us-east-1.amazonaws.com/dev/api/v1/analytics/summary?suburb=${formatSuburb(suburb)}&state=${state}`
  cache[key] = fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Failed to fetch data for ${suburb}`)
    return r.json()
  })
  return cache[key]
}

function formatSuburb(suburb) {
  return suburb.toLowerCase().split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function formatPrice(v) {
  const n = Number(v)
  if (!Number.isFinite(n)) return '$0'
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'k'
  return '$' + n
}

function parseData(ds) {
  const raw = Array.isArray(ds.data) ? ds.data : []
  if (raw.length > 0 && typeof raw[0] === 'object' && raw[0] !== null && 'median' in raw[0]) {
    return raw.map(d => ({
      min: Number(d.min),
      q1: Number(d.q1),
      median: Number(d.median),
      q3: Number(d.q3),
      max: Number(d.max),
    }))
  }
  return raw.map(() => null)
}

function drawBoxPlots(canvas, labels, series) {
  const dpr = window.devicePixelRatio || 1
  const W = canvas.offsetWidth
  const H = canvas.offsetHeight
  canvas.width = W * dpr
  canvas.height = H * dpr
  const ctx = canvas.getContext('2d')
  ctx.scale(dpr, dpr)

  const PAD_LEFT = 64
  const PAD_RIGHT = 20
  const PAD_TOP = 16
  const PAD_BOTTOM = 40

  const plotW = W - PAD_LEFT - PAD_RIGHT
  const plotH = H - PAD_TOP - PAD_BOTTOM

  const allVals = []
  series.forEach(s => s.data.forEach(d => {
    if (d) allVals.push(d.min, d.max)
  }))
  if (!allVals.length) return

  const minVal = Math.min(...allVals)
  const maxVal = Math.max(...allVals)
  const range = maxVal - minVal || 1

  const toY = v => PAD_TOP + plotH - ((v - minVal) / range) * plotH

  const ticks = 5
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.font = '11px sans-serif'
  ctx.fillStyle = '#888'
  ctx.strokeStyle = '#e5e5e5'
  ctx.lineWidth = 0.5
  for (let i = 0; i <= ticks; i++) {
    const v = minVal + (range * i) / ticks
    const y = toY(v)
    ctx.beginPath()
    ctx.moveTo(PAD_LEFT, y)
    ctx.lineTo(W - PAD_RIGHT, y)
    ctx.stroke()
    ctx.fillText(formatPrice(v), PAD_LEFT - 6, y)
  }

  const nGroups = labels.length
  const groupW = plotW / nGroups
  const nSeries = series.length
  const boxW = Math.min(groupW / (nSeries + 1), 40)

  labels.forEach((label, gi) => {
    const groupCx = PAD_LEFT + gi * groupW + groupW / 2

    ctx.fillStyle = '#888'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.font = '11px sans-serif'
    ctx.fillText(label, groupCx, H - PAD_BOTTOM + 8)

    series.forEach((s, si) => {
      const d = s.data[gi]
      if (!d) return

      const offset = (si - (nSeries - 1) / 2) * (boxW * 1.4)
      const cx = groupCx + offset
      const color = s.color

      const yMin = toY(d.min)
      const yQ1 = toY(d.q1)
      const yMed = toY(d.median)
      const yQ3 = toY(d.q3)
      const yMax = toY(d.max)
      const half = boxW / 2
      const whiskerHalf = half * 0.4

      ctx.strokeStyle = color
      ctx.lineWidth = 1.5

      ctx.beginPath()
      ctx.moveTo(cx, yQ1)
      ctx.lineTo(cx, yMin)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx - whiskerHalf, yMin)
      ctx.lineTo(cx + whiskerHalf, yMin)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(cx, yQ3)
      ctx.lineTo(cx, yMax)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx - whiskerHalf, yMax)
      ctx.lineTo(cx + whiskerHalf, yMax)
      ctx.stroke()

      ctx.fillStyle = color + '28'
      ctx.strokeStyle = color
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.rect(cx - half, yQ3, boxW, yQ1 - yQ3)
      ctx.fill()
      ctx.stroke()

      ctx.strokeStyle = color
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(cx - half, yMed)
      ctx.lineTo(cx + half, yMed)
      ctx.stroke()
    })
  })
}

export default function BoxPlot({ suburbs = [], state = 'NSW', onMarkerClick }) {
  suburbs = suburbs.map(s => typeof s === 'string' ? { suburb: s, state } : s)

  const canvasRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    if (!chartData || !canvasRef.current) return
    drawBoxPlots(canvasRef.current, chartData.labels, chartData.series)
  }, [chartData])

  useEffect(() => {
    if (!chartData || !canvasRef.current) return
    const observer = new ResizeObserver(() => {
      if (canvasRef.current) drawBoxPlots(canvasRef.current, chartData.labels, chartData.series)
    })
    observer.observe(canvasRef.current)
    return () => observer.disconnect()
  }, [chartData])

  useEffect(() => {
    if (!suburbs.length) return
    let cancelled = false
    setLoading(true)
    setErrors([])

    Promise.allSettled(
      suburbs.map(({ suburb, state = 'NSW' }) => getData({ suburb, state }))
    ).then((results) => {
      if (cancelled) return

      const errs = []
      const series = []
      let labels = []

      results.forEach((result, idx) => {
        const { suburb, state = 'NSW' } = suburbs[idx]
        const color = COLORS[idx % COLORS.length]
        const label = `${suburb}, ${state}`

        if (result.status === 'rejected') {
          errs.push(`${suburb} (${state}): ${result.reason?.message ?? 'Unknown error'}`)
          return
        }

        const apiResult = result.value
        if (Array.isArray(apiResult?.labels) && apiResult.labels.length > labels.length) {
          labels = apiResult.labels
        }

        const apiDatasets = Array.isArray(apiResult?.datasets) ? apiResult.datasets : []
        apiDatasets.forEach((ds) => {
          series.push({ label, color, data: parseData(ds) })
        })
      })

      setErrors(errs)
      setChartData({ labels, series })
      setLoading(false)
    })

    return () => { cancelled = true }
  }, [JSON.stringify(suburbs)])

  return (
    <div style={{ width: '100%' }}>
      {loading && (
        <div style={{ fontSize: 13, color: '#888', marginBottom: 8 }}>Loading...</div>
      )}
      {errors.length > 0 && (
        <div style={{ color: 'red', fontSize: 13, marginBottom: 8 }}>
          {errors.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}
      <div style={{ height: '15vw', minHeight: 180, width: '100%', padding: '0.4vh' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  )
}
