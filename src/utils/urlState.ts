import { TimezoneInfo } from '../types/timezone.types';

/**
 * Encode timezone conversion state into URL query parameters
 */
export function encodeStateToUrl(
  sourceTime: string,
  sourceTimezone: string,
  activeTimezones: TimezoneInfo[],
  sourceDate?: string | null
): string {
  const params = new URLSearchParams();

  params.set('t', sourceTime);
  params.set('tz', sourceTimezone);

  // Add date if not "today"
  if (sourceDate) {
    params.set('d', sourceDate);
  }

  // Encode only timezone identifiers (not full TimezoneInfo objects)
  if (activeTimezones.length > 0) {
    const timezoneIds = activeTimezones.map(tz => tz.timezone).join(',');
    params.set('zones', timezoneIds);
  }

  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?${params.toString()}`;
}

/**
 * Decode URL query parameters into timezone conversion state
 */
export function decodeStateFromUrl(): {
  sourceTime: string | null;
  sourceTimezone: string | null;
  sourceDate: string | null;
  timezones: string[];
} {
  const params = new URLSearchParams(window.location.search);

  return {
    sourceTime: params.get('t'),
    sourceTimezone: params.get('tz'),
    sourceDate: params.get('d'),
    timezones: params.get('zones')?.split(',').filter(Boolean) || []
  };
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}
