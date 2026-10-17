const CONDITIONS = {
  0: ['Clear sky', '☀'], 1: ['Mainly clear', '🌤'],
  2: ['Partly cloudy', '⛅'], 3: ['Overcast', '☁'],
  45: ['Fog', '🌫'], 48: ['Freezing fog', '🌫'],
  51: ['Light drizzle', '🌦'], 53: ['Drizzle', '🌦'], 55: ['Heavy drizzle', '🌧'],
  56: ['Light freezing drizzle', '🌧'], 57: ['Freezing drizzle', '🌧'],
  61: ['Light rain', '🌦'], 63: ['Rain', '🌧'], 65: ['Heavy rain', '🌧'],
  66: ['Light freezing rain', '🌧'], 67: ['Freezing rain', '🌧'],
  71: ['Light snow', '🌨'], 73: ['Snow', '🌨'], 75: ['Heavy snow', '❄'], 77: ['Snow grains', '❄'],
  80: ['Light showers', '🌦'], 81: ['Showers', '🌧'], 82: ['Heavy showers', '🌧'],
  85: ['Light snow showers', '🌨'], 86: ['Heavy snow showers', '🌨'],
  95: ['Thunderstorm', '⛈'], 96: ['Thunderstorm with hail', '⛈'], 99: ['Thunderstorm with heavy hail', '⛈'],
};

export function getCondition(code) {
  const [label, icon] = CONDITIONS[code] ?? ['Unknown conditions', '🌡'];
  return { label, icon };
}

export function formatDate(timestamp, timezone) {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: timezone,
  }).format(timestamp);
}

export function formatTime(timestamp, timezone) {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', timeZone: timezone,
  }).format(timestamp);
}
