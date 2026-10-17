import { afterEach, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getWeather } from './weather.js';
import { jsonResponse, locationResponse, weatherResponse } from '../test/fixtures.js';

describe('weather service', () => {
  const originalFetch = globalThis.fetch;
  let calls;
  let responses;

  beforeEach(() => {
    calls = [];
    responses = [];
    globalThis.fetch = async (...args) => {
      calls.push(args);
      const response = responses.shift();
      if (response instanceof Error) throw response;
      return response;
    };
  });

  afterEach(() => { globalThis.fetch = originalFetch; });

  it('encodes city names and normalizes weather with explicit metric units', async () => {
    const controller = new AbortController();
    responses.push(jsonResponse(locationResponse), jsonResponse(weatherResponse));
    const result = await getWeather('  São Paulo & Santos  ', { signal: controller.signal });
    const searchUrl = calls[0][0];
    const forecastUrl = calls[1][0];
    assert.equal(searchUrl.protocol, 'https:');
    assert.equal(searchUrl.searchParams.get('name'), 'São Paulo & Santos');
    assert.equal(forecastUrl.searchParams.get('temperature_unit'), 'celsius');
    assert.equal(forecastUrl.searchParams.get('wind_speed_unit'), 'kmh');
    assert.ok(calls.every(([, options]) => options.signal === controller.signal));
    assert.deepEqual(result, {
      city: 'Lisbon', region: 'Lisbon, Portugal', temperature: 21.6,
      feelsLike: 20.2, humidity: 65, windSpeed: 12.4, code: 2,
      updatedAt: Date.parse('2026-10-17T12:00:00Z'), timezone: 'Europe/Lisbon',
    });
  });

  it('rejects short searches before making a request', async () => {
    await assert.rejects(getWeather(' '), /at least two characters/);
    assert.equal(calls.length, 0);
  });

  it('handles cities with no matches without fetching weather', async () => {
    responses.push(jsonResponse({}));
    await assert.rejects(getWeather('Missing city'), /No city found/);
    assert.equal(calls.length, 1);
  });

  it('handles HTTP failures', async () => {
    responses.push(jsonResponse({}, false));
    await assert.rejects(getWeather('Lisbon'), /unavailable right now/);
  });

  it('handles network failures', async () => {
    responses.push(new TypeError('Failed to fetch'));
    await assert.rejects(getWeather('Lisbon'), /Check your connection/);
  });

  it('handles invalid JSON', async () => {
    responses.push({ ok: true, json: async () => { throw new SyntaxError(); } });
    await assert.rejects(getWeather('Lisbon'), /unexpected response/);
  });

  it('rejects incomplete current weather instead of displaying invalid values', async () => {
    responses.push(jsonResponse(locationResponse), jsonResponse({ current: { temperature_2m: null } }));
    await assert.rejects(getWeather('Lisbon'), /Current weather is unavailable/);
  });

  it('preserves request cancellation', async () => {
    responses.push(new DOMException('Aborted', 'AbortError'));
    await assert.rejects(getWeather('Lisbon'), { name: 'AbortError' });
  });
});
