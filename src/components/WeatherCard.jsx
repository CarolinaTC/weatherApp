import React from 'react';
import { formatDate, formatTime, getCondition } from '../utils/weather';

export default function WeatherCard({ weather }) {
  const condition = getCondition(weather.code);
  return (
    <section className="weather-card" aria-labelledby="location-name">
      <p className="eyebrow">Current weather</p>
      <h2 id="location-name">{weather.city}</h2>
      <p className="region">{weather.region}</p>
      <p className="date">{formatDate(weather.updatedAt, weather.timezone)}</p>
      <div className="temperature">
        <span className="condition-icon" aria-hidden="true">{condition.icon}</span>
        <span>{Math.round(weather.temperature)}<span className="temperature-unit">°C</span></span>
      </div>
      <p className="condition">{condition.label}</p>
      <dl className="weather-details">
        <div><dt>Feels like</dt><dd>{Math.round(weather.feelsLike)}°C</dd></div>
        <div><dt>Humidity</dt><dd>{Math.round(weather.humidity)}%</dd></div>
        <div><dt>Wind</dt><dd>{Math.round(weather.windSpeed)} <span>km/h</span></dd></div>
      </dl>
      <p className="updated">Updated at {formatTime(weather.updatedAt, weather.timezone)} · Local time</p>
    </section>
  );
}
