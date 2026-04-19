import { FaCloudRain, FaThermometerHalf } from 'react-icons/fa'

// export const NSW_STATIONS = [
//   { location: 'sydney_(observatory_hill)',           state: 'nsw', label: 'Sydney',        coords: [-33.8688, 151.2093] },
//   { location: 'newcastle_nobbys_signal_station_aws', state: 'nsw', label: 'Newcastle',     coords: [-32.9167, 151.7500] },
//   { location: 'wollongong',                          state: 'nsw', label: 'Wollongong',    coords: [-34.4278, 150.8931] },
//   { location: 'orange_agricultural_station',         state: 'nsw', label: 'Orange',        coords: [-33.2833, 149.1000] },
//   { location: 'bathurst_agricultural_station',       state: 'nsw', label: 'Bathurst',      coords: [-33.4167, 149.5833] },
//   { location: 'dubbo_airport_aws',                   state: 'nsw', label: 'Dubbo',         coords: [-32.2167, 148.5667] },
//   { location: 'tamworth_airport_aws',                state: 'nsw', label: 'Tamworth',      coords: [-31.0833, 150.8333] },
//   { location: 'wagga_wagga_amo',                     state: 'nsw', label: 'Wagga Wagga',   coords: [-35.1667, 147.4667] },
//   { location: 'albury_airport',                      state: 'nsw', label: 'Albury',        coords: [-36.0667, 146.9500] },
//   { location: 'coffs_harbour_mo',                    state: 'nsw', label: 'Coffs Harbour', coords: [-30.3000, 153.1167] },
//   { location: 'lismore_airport',                     state: 'nsw', label: 'Lismore',       coords: [-28.8333, 153.2667] },
//   { location: 'broken_hill_airport_aws',             state: 'nsw', label: 'Broken Hill',   coords: [-31.9833, 141.4667] },
//   { location: 'griffith_airport_aws',                state: 'nsw', label: 'Griffith',      coords: [-34.2500, 146.0667] },
//   { location: 'armidale_airport',                    state: 'nsw', label: 'Armidale',      coords: [-30.5333, 151.6167] },
//   { location: 'nowra_ran_air_station_aws',           state: 'nsw', label: 'Nowra',         coords: [-34.9333, 150.5333] },
// ]

export const SUBURBS = [
  "Blacktown", "Parramatta", "Chatswood", "Bondi", "Manly",
  "Newtown", "Randwick", "Surry Hills", "Castle Hill", "Homebush"
]

export const OMEGA_API_BASE = 'https://a683sqnr5m.execute-api.ap-southeast-2.amazonaws.com'

// Simplified NSW boundary polygon [lat, lon]
export const NSW_BOUNDARY = [
  [-28.0, 141.0], [-29.0, 141.0], [-29.0, 142.0], [-30.0, 142.0],
  [-30.0, 143.0], [-31.0, 143.0], [-31.0, 144.0], [-32.0, 144.0],
  [-32.0, 145.0], [-33.0, 145.0], [-33.0, 146.0], [-34.0, 146.0],
  [-34.0, 147.0], [-35.0, 147.0], [-35.0, 148.0], [-36.0, 148.0],
  [-36.0, 149.0], [-36.5, 149.5], [-37.0, 149.5], [-37.5, 150.0],
  [-37.5, 150.5], [-36.5, 150.5], [-35.5, 151.0], [-34.5, 151.5],
  [-33.5, 152.0], [-32.5, 152.5], [-31.5, 153.0], [-30.5, 153.5],
  [-29.5, 153.5], [-28.5, 153.5], [-28.0, 153.5], [-28.0, 141.0],
]

export const COLOUR_RAMPS = {
  temperature: [[30, 144, 255], [255, 235, 50], [255, 50, 30]],
  rain:        [[255, 255, 204], [65, 182, 196], [8, 29, 88]],
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
