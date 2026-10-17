import React, { useEffect, useRef, useState } from 'react';
import WeatherCard from './components/WeatherCard';
import { getWeather } from './services/weather';

export default function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const activeRequest = useRef(null);
  const requestTimeout = useRef(null);

  useEffect(() => () => {
    activeRequest.current?.abort();
    clearTimeout(requestTimeout.current);
  }, []);

  async function search(event) {
    event.preventDefault();
    if (query.trim().length < 2) {
      setError('Enter at least two characters to search for a city.');
      return;
    }
    activeRequest.current?.abort();
    clearTimeout(requestTimeout.current);
    const controller = new AbortController();
    activeRequest.current = controller;
    const timeout = setTimeout(() => {
      controller.abort();
      if (activeRequest.current === controller) {
        setError('The search took too long. Please try again.');
        setIsLoading(false);
      }
    }, 15000);
    requestTimeout.current = timeout;

    setIsLoading(true);
    setError('');
    try {
      const result = await getWeather(query, { signal: controller.signal });
      if (!controller.signal.aborted) setWeather(result);
    } catch (searchError) {
      if (!controller.signal.aborted) setError(searchError.message);
    } finally {
      clearTimeout(timeout);
      if (activeRequest.current === controller && !controller.signal.aborted) setIsLoading(false);
    }
  }

  return (
    <div className={`app${weather && weather.temperature > 16 ? ' warm' : ''}`}>
      <main className="app-content">
        <header className="app-header">
          <p className="eyebrow">A little look outside</p>
          <h1>Weather, wherever.</h1>
          <p>Find out what the day feels like.</p>
        </header>
        <form className="search-box" onSubmit={search} role="search">
          <label htmlFor="city" className="sr-only">City name</label>
          <input
            id="city" name="city" type="search" placeholder="Search for a city…"
            value={query} onChange={(event) => setQuery(event.target.value)}
            maxLength={120} autoComplete="off"
            aria-describedby={error ? 'search-error' : 'search-hint'} aria-invalid={Boolean(error)}
          />
          <button type="submit" disabled={isLoading}>{isLoading ? 'Searching…' : 'Search'}</button>
        </form>
        <p id="search-hint" className="search-hint">Try Lisbon, London, or Tokyo.</p>
        {error && <p id="search-error" className="error" role="alert">{error}</p>}
        <div className="weather-result" aria-live="polite" aria-busy={isLoading}>
          {isLoading && <p className="loading" role="status">Finding your weather…</p>}
          {weather ? <WeatherCard weather={weather} /> : !isLoading && (
            <section className="empty-state" aria-labelledby="empty-heading">
              <span className="empty-icon" aria-hidden="true">⛅</span>
              <h2 id="empty-heading">Every day starts with a forecast.</h2>
              <p>Search for a city to see its current weather.</p>
            </section>
          )}
        </div>
        <footer>
          Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo</a>
          {' · '}Locations by <a href="https://www.geonames.org/" target="_blank" rel="noreferrer">GeoNames</a>
        </footer>
      </main>
    </div>
  );
}
