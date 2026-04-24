import { SUBURBS } from "../data/suburbs";
import { geocodePlace } from "./geocodeApi";

const CITY_COORDS = [-33.8688, 151.2093]; // Sydney

const cache = {
  rawEventsBySuburb: null,
  suburbSummaries: null,
  citySummary: null,
};

let fetchPromise = null;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchEventsForSuburb(suburb, state = "NSW") {
  const res = await fetch(
    `https://gge1ls7ns8.execute-api.us-east-1.amazonaws.com/dev/api/v1/events?suburb=${encodeURIComponent(suburb)}&state=${encodeURIComponent(state)}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch events for ${suburb}`);
  }

  return res.json();
}

export async function getAllHousingData() {
  if (cache.rawEventsBySuburb && cache.suburbSummaries && cache.citySummary) {
    return {
      rawEventsBySuburb: cache.rawEventsBySuburb,
      suburbSummaries: cache.suburbSummaries,
      citySummary: cache.citySummary,
    };
  }

  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    const results = await Promise.all(
      SUBURBS.map(async (suburb) => {
        const data = await fetchEventsForSuburb(suburb);
        return { suburb, events: data.events ?? [] };
      })
    );

    const rawEventsBySuburb = {};
    const suburbSummaries = [];
    let totalCount = 0;
    let totalPrice = 0;

    for (let i = 0; i < results.length; i++) {
      const { suburb, events } = results[i];
      rawEventsBySuburb[suburb] = events;

      if (!events.length) continue;

      const suburbTotal = events.reduce(
        (sum, event) => sum + event.attributes.price,
        0
      );

      totalCount += events.length;
      totalPrice += suburbTotal;

      if (i > 0) await sleep(1000);
      const coords = await geocodePlace(suburb);
      if (!coords) continue;

      suburbSummaries.push({
        id: suburb,
        position: coords,
        label: suburb,
        count: events.length,
        avgPrice: Math.round(suburbTotal / events.length),
        events,
      });
    }

    // single city marker from all suburb data
    const citySummary = {
      id: "sydney",
      position: CITY_COORDS,
      label: "Sydney", // hard coded to sydney rn, need to change later when we add more city stuff
      count: totalCount,
      avgPrice: totalCount > 0 ? Math.round(totalPrice / totalCount) : 0,
    };

    cache.rawEventsBySuburb = rawEventsBySuburb;
    cache.suburbSummaries = suburbSummaries;
    cache.citySummary = citySummary;

    return {
      rawEventsBySuburb,
      suburbSummaries,
      citySummary,
    };
  })();

  return fetchPromise;
}

export async function getSuburbSummaries() {
  const data = await getAllHousingData();
  return data.suburbSummaries;
}

export async function getCitySummary() {
  const data = await getAllHousingData();
  return data.citySummary;
}

export async function getFeaturedEvents(limit = 4) {
  const data = await getAllHousingData();

  const allEvents = Object.entries(data.rawEventsBySuburb).flatMap(
    ([suburb, events]) =>
      events.map((event) => ({
        ...event,
        suburb,
      }))
  );

  return allEvents.slice(0, limit);
}
