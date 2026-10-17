const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

async function fetchJson(url, signal) {
  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Could not connect to the weather service. Check your connection and try again.');
  }
  if (!response.ok) {
    throw new Error('The weather service is unavailable right now. Please try again shortly.');
  }
  try {
    return await response.json();
  } catch {
    throw new Error('The weather service returned an unexpected response. Please try again.');
  }
}

export async function getWeather(city, { signal } = {}) {
  const query = city.trim();
  if (query.length < 2) throw new Error('Enter at least two characters to search for a city.');

  const searchUrl = new URL(GEOCODING_URL);
  searchUrl.search = new URLSearchParams({ name: query, count: '1', language: 'en', format: 'json' });
  const locations = await fetchJson(searchUrl, signal);
  const location = locations?.results?.[0];
  if (!location) throw new Error(`No city found for “${query}”. Check the spelling and try again.`);
  if (!Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) {
    throw new Error('Location data is unavailable for this city. Please try another city.');
  }

  const weatherUrl = new URL(WEATHER_URL);
  weatherUrl.search = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m',
    temperature_unit: 'celsius',
    wind_speed_unit: 'kmh',
    timezone: 'auto',
    timeformat: 'unixtime',
    forecast_days: '1',
  });
  const data = await fetchJson(weatherUrl, signal);
  const current = data?.current;
  if (!current || !['temperature_2m', 'apparent_temperature', 'relative_humidity_2m', 'weather_code', 'wind_speed_10m', 'time']
    .every((field) => Number.isFinite(current[field])) || typeof data.timezone !== 'string') {
    throw new Error('Current weather is unavailable for this city. Please try again shortly.');
  }
  return {
    city: location.name,
    region: [location.admin1, location.country].filter(Boolean).join(', '),
    temperature: current.temperature_2m,
    feelsLike: current.apparent_temperature,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    code: current.weather_code,
    updatedAt: current.time * 1000,
    timezone: data.timezone,
  };
}
