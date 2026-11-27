import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  maskReplayNetworkRequest,
  sanitizeAnalyticsEvent,
  sanitizeAnalyticsUrl,
} from './analytics';

describe('analytics privacy and initialization', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('redacts sensitive query parameters case-insensitively and preserves other params and fragments', () => {
    expect(
      sanitizeAnalyticsUrl(
        'https://timezones.shimizu-technology.com/?Token=abc&token=def&EMAIL=a%40b.com&tz=Pacific/Guam#top'
      )
    ).toBe(
      'https://timezones.shimizu-technology.com/?Token=%5BREDACTED%5D&token=%5BREDACTED%5D&EMAIL=%5BREDACTED%5D&tz=Pacific%2FGuam#top'
    );

    expect(sanitizeAnalyticsUrl('/compare?code=123&state=xyz&auth=1&jwt=2&key=3&secret=4&view=grid')).toBe(
      '/compare?code=%5BREDACTED%5D&state=%5BREDACTED%5D&auth=%5BREDACTED%5D&jwt=%5BREDACTED%5D&key=%5BREDACTED%5D&secret=%5BREDACTED%5D&view=grid'
    );
  });

  it('returns malformed URLs unchanged', () => {
    expect(sanitizeAnalyticsUrl('http://[::1')).toBe('http://[::1');
  });

  it('sanitizes top-level URL properties and nested replay $snapshot_data URLs', () => {
    expect(sanitizeAnalyticsEvent(null)).toBeNull();

    const sanitized = sanitizeAnalyticsEvent({
      uuid: 'evt-1',
      event: '$snapshot',
      properties: {
        $current_url: 'https://timezones.shimizu-technology.com/?email=alice@example.com&tz=Guam',
        $referrer: 'https://example.com/?token=secret',
        $initial_current_url: 'https://timezones.shimizu-technology.com/?secret=1',
        $initial_referrer: 42,
        $session_entry_url: 'https://timezones.shimizu-technology.com/?jwt=abc',
        $session_entry_referrer: 'https://example.com/?key=xyz',
        untouched: 'https://example.com/?email=kept',
        $snapshot_data: [
          {
            type: 4,
            data: {
              href: 'https://timezones.shimizu-technology.com/?email=alice%40example.com&tz=Guam',
            },
          },
        ],
      },
    });

    expect(sanitized?.properties.$current_url).toBe(
      'https://timezones.shimizu-technology.com/?email=%5BREDACTED%5D&tz=Guam'
    );
    expect(sanitized?.properties.$initial_referrer).toBe(42);
    expect(sanitized?.properties.untouched).toBe('https://example.com/?email=kept');
    expect(sanitized?.properties.$snapshot_data).toEqual([
      {
        type: 4,
        data: {
          href: 'https://timezones.shimizu-technology.com/?email=%5BREDACTED%5D&tz=Guam',
        },
      },
    ]);
  });

  it('sanitizes replay network request names', () => {
    expect(
      maskReplayNetworkRequest({
        name: 'https://timezones.shimizu-technology.com/?email=alice%40example.com&tz=Guam',
      })
    ).toEqual({
      name: 'https://timezones.shimizu-technology.com/?email=%5BREDACTED%5D&tz=Guam',
    });
  });

  it('does not load PostHog when key is missing, placeholder, or in dev without override', async () => {
    vi.stubEnv('VITE_PUBLIC_POSTHOG_KEY', 'YOUR_POSTHOG_KEY');
    vi.stubEnv('PROD', true);
    const mod1 = await import('./analytics');
    expect(mod1.isAnalyticsEnabled).toBe(false);

    vi.resetModules();
    vi.stubEnv('VITE_PUBLIC_POSTHOG_KEY', 'phc_valid_key');
    vi.stubEnv('PROD', false);
    vi.stubEnv('VITE_ENABLE_ANALYTICS_IN_DEV', 'false');
    const mod2 = await import('./analytics');
    expect(mod2.isAnalyticsEnabled).toBe(false);
  });
});
