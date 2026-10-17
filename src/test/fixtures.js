export const locationResponse = {
  results: [{ name: 'Lisbon', admin1: 'Lisbon', country: 'Portugal', latitude: 38.72, longitude: -9.14 }],
};

export const weatherResponse = {
  timezone: 'Europe/Lisbon',
  current: {
    temperature_2m: 21.6,
    apparent_temperature: 20.2,
    relative_humidity_2m: 65,
    wind_speed_10m: 12.4,
    weather_code: 2,
    time: Date.parse('2026-10-17T12:00:00Z') / 1000,
  },
};

export function jsonResponse(data, ok = true) {
  return { ok, json: async () => data };
}
