import { useEffect, useState } from "react";
import { getAllHousingData } from "../services/housingEventsApi";

export function useHousingEvents() {
  const [data, setData] = useState({
    rawEventsBySuburb: {},
    suburbSummaries: [],
    citySummary: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const result = await getAllHousingData();
        if (!cancelled) {
          setData(result);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load housing data");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { ...data, loading, error };
}
