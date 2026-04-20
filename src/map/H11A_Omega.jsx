import { FaCloudRain, FaThermometerHalf } from 'react-icons/fa'

export const SUBURBS = [
  // Sydney metro — marker suburbs
  "Blacktown", "Parramatta", "Chatswood", "Bondi", "Manly",
  "Newtown", "Randwick", "Surry Hills", "Castle Hill", "Homebush",
  // Additional Sydney surrounds
  "Penrith", "Liverpool", "Campbelltown", "Cronulla", "Hornsby",
  "Ryde", "Hurstville", "Bankstown", "Fairfield", "Auburn",
  "Baulkham Hills", "Dee Why", "Kogarah", "Leichhardt", "Marrickville",
  "Mosman", "Neutral Bay", "North Sydney", "Pymble", "Strathfield",
  // Regional NSW
  // "Newcastle", "Wollongong", "Orange", "Bathurst", "Dubbo",
  // "Tamworth", "Wagga Wagga", "Albury", "Coffs Harbour", "Lismore",
  // "Broken Hill", "Griffith", "Armidale", "Nowra", "Maitland",
  // "Cessnock", "Queanbeyan", "Bowral", "Goulburn", "Port Macquarie"
]

export const OMEGA_API_BASE = 'https://a683sqnr5m.execute-api.ap-southeast-2.amazonaws.com'

export const COLOUR_RAMPS = {
  temperature: [[30, 144, 255], [255, 235, 50], [255, 50, 30]],
  rain: [[199, 229, 255], [65, 145, 220], [8, 29, 120]],
}

export const OVERLAY_MODES = {
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
