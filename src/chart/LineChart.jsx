import { useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const COLORS = [
  '#378ADD',
  '#E24B4A',
  '#1D9E75',
  '#EF9F27',
  '#7F77DD',
  '#D4537E',
  '#639922',
  '#D85A30',
]

const cache = {}

function getData({ suburb, state }) {
  const key = `${formatSuburb(suburb)}-${state}`
  if (cache[key]) return cache[key]
  const url = `https://tvfiek3hzi.execute-api.us-east-1.amazonaws.com/dev/api/v1/analytics/price-trend?suburb=${formatSuburb(suburb)}&state=${state}`
  cache[key] = fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Failed to fetch data for ${suburb}`)
    return r.json()
  })
  return cache[key]
}

function formatSuburb(suburb) {
  return suburb
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function movingAverage(data, window = 5) {
  return data.map((_, i) => {
    const half = Math.floor(window / 2)
    const start = Math.max(0, i - half)
    const end = Math.min(data.length, i + half + 1)
    const slice = data.slice(start, end).filter((v) => v !== null)
    if (!slice.length) return null
    return Math.round(slice.reduce((a, b) => a + b, 0) / slice.length)
  })
}

function parseData(ds) {
  const raw = Array.isArray(ds.data) ? ds.data : []
  return movingAverage(
    raw.map((v) => {
      const n = Number(String(v).replace(/,/g, ''))
      return Number.isFinite(n) ? n : null
    }),
    5
  )
}

function formatPrice(value) {
  const v = Number(value)
  if (!Number.isFinite(v)) return '$0'
  if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M'
  if (v >= 1e3) return '$' + (v / 1e3).toFixed(0) + 'k'
  return '$' + v
}

export default function LineChart({
  suburbs = [],
  state = 'NSW',
  onMarkerClick,
}) {
  suburbs = suburbs.map((s) => (typeof s === 'string' ? { suburb: s, state } : s))
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState([])
  const [legendItems, setLegendItems] = useState([])

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
      const datasets = []
      let labels = []

      results.forEach((result, idx) => {
        const { suburb, state = 'NSW' } = suburbs[idx]
        const color = COLORS[idx % COLORS.length]

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
          datasets.push({
            label: `${suburb}, ${state}`,
            data: parseData(ds),
            borderColor: color,
            backgroundColor: color + '14',
            pointRadius: 0,
            pointHoverRadius: 5,
            borderWidth: 1.5,
            tension: 0.2,
            fill: false,
          })
        })
      })

      setErrors(errs)
      setLegendItems(
        datasets.map((ds) => ({ label: ds.label, color: ds.borderColor }))
      )

      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }

      const ctx = canvasRef.current?.getContext('2d')
      if (!ctx) return

      const chartData = { labels, datasets }

      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          onClick: (evt, elements) => {
            if (elements.length > 0 && onMarkerClick) {
              const { datasetIndex, index } = elements[0]
              onMarkerClick({
                suburb: chartData.datasets[datasetIndex]?.label,
                label: chartData.labels[index],
                value: chartData.datasets[datasetIndex]?.data[index],
              })
            }
          },
          scales: {
            x: {
              ticks: { maxTicksLimit: 12, maxRotation: 45 },
            },
            y: {
              type: 'linear',
              beginAtZero: false,
              ticks: { callback: formatPrice },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  ctx.dataset.label + ': $' + Number(ctx.parsed.y || 0).toLocaleString(),
              },
            },
          },
        },
      })

      setLoading(false)
    })

    return () => {
      cancelled = true
      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
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

      {legendItems.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 20px', marginBottom: 10 }}>
          {legendItems.map(({ label, color }) => (
            <span
              key={label}
              style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}
            >
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  background: color,
                  flexShrink: 0,
                }}
              />
              {label}
            </span>
          ))}
        </div>
      )}

      <div style={{ height: '15vw', minHeight: 180, width: '100%', padding: '0.4vh' }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
