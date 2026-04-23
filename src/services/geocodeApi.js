const geocodeCache = {}

export async function geocodePlace(name) {
  if (geocodeCache[name]) return geocodeCache[name]

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    `${name}, NSW, Australia`
  )}&format=json&limit=1`; // this too, for when more city data is added

  const res = await fetch(url, { headers: {
    'Accept-Language': 'en',
    'User-Agent': 'PropertyApp/1.0'
    }
  });

  if (!res.ok) {
    throw new Error(`Geocoding failed for ${name}`);
  }

  const data = await res.json();
  if (!data.length) return null;

  const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  geocodeCache[name] = coords;
  return coords;
}
