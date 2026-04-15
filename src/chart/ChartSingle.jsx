import { useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const cache = {}

function getData({ suburb, state }) {
  const key = `${suburb}-${state}`

  if (cache[key]) return cache[key]

  const url = `https://tvfiek3hzi.execute-api.us-east-1.amazonaws.com/dev/api/v1/analytics/price-trend?suburb=${suburb}&state=${state}`

  cache[key] = fetch(url).then((r) => {
    if (!r.ok) throw new Error('Failed to fetch data')
    return r.json()
  })

  return cache[key]
}

function toChartJsData(result) {
  const labels = Array.isArray(result?.labels) ? result.labels : []

  const datasets = Array.isArray(result?.datasets)
    ? result.datasets.map((ds) => {
        const raw = Array.isArray(ds.data) ? ds.data : []

        const data = raw.map((v) => {
          const n = Number(String(v).replace(/,/g, ''))
          return Number.isFinite(n) ? n : null
        })

        return {
          label: ds.label || 'Dataset',
          data,
          borderColor: '#378ADD',
          backgroundColor: 'rgba(55,138,221,0.08)',
          pointRadius: 0,
          pointHoverRadius: 5,
          borderWidth: 1.5,
          tension: 0.2,
          fill: false,
        }
      })
    : []

  return { labels, datasets }
}

function ChartSingle({
  suburb,
  state = 'NSW',
  onLoadingChange,
  onMarkerClick,
}) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!suburb) return

    let cancelled = false

    onLoadingChange?.(true)
    setError(null)

    getData({ suburb, state })
      .then((result) => {
        if (cancelled) return

        const chartData = toChartJsData(result)

        if (chartRef.current) {
          chartRef.current.destroy()
          chartRef.current = null
        }

        const ctx = canvasRef.current?.getContext('2d')
        if (!ctx) return

        chartRef.current = new Chart(ctx, {
          type: 'line',
          data: chartData,
          options: {
            responsive: true,
            maintainAspectRatio: false,

            onClick: (evt, elements) => {
              if (elements.length > 0 && onMarkerClick) {
                const idx = elements[0].index

                onMarkerClick({
                  label: chartData.labels[idx],
                  value: chartData.datasets?.[0]?.data?.[idx],
                })
              }
            },

            scales: {
              x: {
                ticks: {
                  maxTicksLimit: 12,
                  maxRotation: 45,
                },
              },
              y: {
                type: 'linear',
                beginAtZero: false,
                ticks: {
                  callback: function (value) {
                    const v = Number(value)

                    if (!Number.isFinite(v)) return '$0'

                    if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M'
                    if (v >= 1e3) return '$' + (v / 1e3).toFixed(0) + 'k'
                    return '$' + v
                  },
                },
              },
            },

            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) =>
                    '$' + Number(ctx.parsed.y || 0).toLocaleString(),
                },
              },
            },
          },
        })

        onLoadingChange?.(false)
      })
      .catch((err) => {
        setError(err.message)
        onLoadingChange?.(false)
      })

    return () => {
      cancelled = true

      if (chartRef.current) {
        chartRef.current.destroy()
        chartRef.current = null
      }
    }
  }, [suburb, state])

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>
  }

  return (
    <div style={{ height: '15vw', width: '100%', padding: '0.4vh' }}>
      <canvas ref={canvasRef} />
    </div>
  )
}

export default ChartSingle