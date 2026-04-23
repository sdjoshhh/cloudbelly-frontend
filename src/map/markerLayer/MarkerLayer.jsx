import { useState, useEffect, memo, useMemo } from 'react'
import { Marker, Popup, useMapEvents } from 'react-leaflet'
import { useHousingEvents } from '../../hooks/useHousingEvents';

const PlaceMarker = memo(({ position, label, count, avgPrice, onMarkerClick }) => (
  <Marker
    position={position}
    eventHandlers={{
      click: () => onMarkerClick({ label, count, avgPrice })
    }}
  >
    <Popup>
      <strong>{label}</strong>
      <br />
      {count} Sales, Average Price ${avgPrice.toLocaleString()}
    </Popup>
  </Marker>
))

function MarkerLayer({ onLoadingChange, onMarkerClick }) {
  const [zoom, setZoom] = useState(5);
  const { suburbSummaries, citySummary, loading } = useHousingEvents();

  useMapEvents({
    zoomend: (e) => setZoom(e.target.getZoom()),
  });

  const markers = zoom >= 6
    ? suburbSummaries
    : citySummary
      ? [citySummary]
      : [];

  useMemo(() => {
    onLoadingChange(loading);
  }, [loading, onLoadingChange]);

  const renderedMarkers = useMemo(
    () => markers.map((m) => (
      <PlaceMarker key={m.id} {...m} onMarkerClick={onMarkerClick} />
    )),
    [markers, onMarkerClick]
  );

  return <>{renderedMarkers}</>;
}

export default MarkerLayer
