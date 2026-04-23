import { FaCloudRain, FaThermometerHalf } from 'react-icons/fa'

export const OMEGA_API_BASE = 'https://a683sqnr5m.execute-api.ap-southeast-2.amazonaws.com'

export const COLOUR_RAMPS = {
  temperature: [[180, 0, 0], [255, 140, 0]],
  rain: [[199, 229, 255], [65, 145, 220], [8, 29, 120]],
}

export const WEATHER_MODES = {
  temperature: {
    type: 'max_temperature',
    label: 'Avg max temperature',
    unit: '°C',
    popupLabel: 'Avg max',
    colourRamp: COLOUR_RAMPS.temperature,
    min: 15,
    max: 45,
    icon: <FaThermometerHalf />,
    title: 'Toggle temperature overlay',
  },
  rain: {
    type: 'rain',
    label: 'Avg daily rainfall',
    unit: 'mm',
    popupLabel: 'Avg rainfall',
    colourRamp: COLOUR_RAMPS.rain,
    min: 0,
    max: 20,
    icon: <FaCloudRain />,
    title: 'Toggle rainfall overlay',
  },
}
