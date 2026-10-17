import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { formatDate, formatTime, getCondition } from './weather.js';

describe('weather presentation', () => {
  it('uses the searched city timezone across date boundaries', () => {
    const timestamp = Date.parse('2026-10-17T23:30:00Z');
    assert.equal(formatDate(timestamp, 'Asia/Tokyo'), 'Sunday, 18 October 2026');
    assert.equal(formatTime(timestamp, 'Asia/Tokyo'), '08:30');
    assert.equal(formatDate(timestamp, 'America/New_York'), 'Saturday, 17 October 2026');
  });

  it('describes weather codes and provides a fallback for unknown conditions', () => {
    assert.equal(getCondition(95).label, 'Thunderstorm');
    assert.equal(getCondition(999).label, 'Unknown conditions');
  });
});
