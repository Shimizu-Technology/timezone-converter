import { DateTime } from 'luxon';
import { TimezoneInfo, ConvertedTime } from '../types/timezone.types';

/**
 * Generate a unique ID for timezone info
 */
function generateId(): string {
  return `tz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format a timezone name for display
 * Converts "America/New_York" to "New York"
 */
function formatTimezoneLabel(tz: string): string {
  const parts = tz.split('/');
  const city = parts[parts.length - 1].replace(/_/g, ' ');
  return city;
}

/**
 * Get timezone information including abbreviation and display name
 */
export function getTimezoneInfo(timezone: string, id?: string): TimezoneInfo {
  const now = DateTime.now().setZone(timezone);
  const abbreviation = now.offsetNameShort || 'UTC';
  const label = formatTimezoneLabel(timezone);

  return {
    id: id || generateId(),
    timezone,
    displayName: `${label} (${abbreviation})`,
    abbreviation
  };
}

/**
 * Parse various time formats to 24-hour format (HH:mm)
 * Handles: "3pm", "3:00pm", "15:00", "3:30 PM", "now"
 */
export function parseTime(input: string): {
  time: string;
  isNow: boolean;
} {
  const lowered = input.toLowerCase().trim();

  // Handle "now"
  if (lowered === 'now' || lowered === 'current') {
    return {
      time: DateTime.now().toFormat('HH:mm'),
      isNow: true
    };
  }

  // Try to parse as is first (for "15:00" format)
  const time24Regex = /^(\d{1,2}):(\d{2})$/;
  const match24 = lowered.match(time24Regex);

  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);

    if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
      return {
        time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
        isNow: false
      };
    }
  }

  // Parse 12-hour format with am/pm
  const time12Regex = /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i;
  const match12 = lowered.match(time12Regex);

  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2] ? parseInt(match12[2], 10) : 0;
    const meridiem = match12[3]?.toLowerCase();

    // Validate hours and minutes
    if (hours < 1 || hours > 12) {
      throw new Error('Invalid hour value');
    }
    if (minutes < 0 || minutes >= 60) {
      throw new Error('Invalid minute value');
    }

    // Convert to 24-hour format
    if (meridiem === 'pm' && hours !== 12) {
      hours += 12;
    } else if (meridiem === 'am' && hours === 12) {
      hours = 0;
    } else if (!meridiem) {
      // If no meridiem specified, assume PM for hours 1-11, AM for 12
      if (hours !== 12) {
        hours += 12;
      }
    }

    return {
      time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
      isNow: false
    };
  }

  throw new Error(`Unable to parse time: "${input}". Use formats like "3pm", "15:00", or "3:30 PM"`);
}

/**
 * Format time based on military time preference
 */
export function formatTime(dateTime: any, useMilitaryTime: boolean = false): string {
  return useMilitaryTime ? dateTime.toFormat('HH:mm') : dateTime.toFormat('h:mm a');
}

/**
 * Convert a time from one timezone to another
 */
export function convertTime(
  sourceTime: string,
  sourceTimezone: string,
  targetTimezone: string,
  sourceDate?: string, // Optional: specific date in ISO format
  useMilitaryTime: boolean = false
): ConvertedTime {
  try {
    // Parse the source time
    const { time } = parseTime(sourceTime);
    const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));

    // Create DateTime in source timezone
    // If no date specified, use today
    const baseDate = sourceDate
      ? DateTime.fromISO(sourceDate, { zone: sourceTimezone })
      : DateTime.now().setZone(sourceTimezone);

    const sourceDateTime = baseDate.set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });

    // Validate the source datetime was created successfully
    if (!sourceDateTime.isValid) {
      throw new Error(`Invalid source datetime: ${sourceDateTime.invalidReason}`);
    }

    // Convert to target timezone
    const targetDateTime = sourceDateTime.setZone(targetTimezone);

    // Check if date changed during conversion
    const isDifferentDay = sourceDateTime.day !== targetDateTime.day ||
                           sourceDateTime.month !== targetDateTime.month ||
                           sourceDateTime.year !== targetDateTime.year;

    // Calculate hours difference
    const sourceOffset = sourceDateTime.offset;
    const targetOffset = targetDateTime.offset;
    const hoursDifference = (targetOffset - sourceOffset) / 60;

    // Check if business hours (9am-5pm in target timezone)
    const targetHour = targetDateTime.hour;
    const isBusinessHours = targetHour >= 9 && targetHour < 17;

    return {
      timezoneInfo: getTimezoneInfo(targetTimezone),
      time: formatTime(targetDateTime, useMilitaryTime),
      date: targetDateTime.toFormat('EEE, MMM d, yyyy'),
      isDifferentDay,
      iso: targetDateTime.toISO() || '',
      hoursDifference,
      isBusinessHours
    };
  } catch (error) {
    throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert a time to multiple timezones at once
 */
export function convertToMultipleTimezones(
  sourceTime: string,
  sourceTimezone: string,
  targetTimezones: string[],
  sourceDate?: string
): ConvertedTime[] {
  return targetTimezones.map(targetTz =>
    convertTime(sourceTime, sourceTimezone, targetTz, sourceDate)
  );
}

/**
 * Get the current time in a specific timezone
 */
export function getCurrentTimeInTimezone(timezone: string): ConvertedTime {
  const now = DateTime.now().setZone(timezone);

  // Check if business hours (9am-5pm in target timezone)
  const hour = now.hour;
  const isBusinessHours = hour >= 9 && hour < 17;

  return {
    timezoneInfo: getTimezoneInfo(timezone),
    time: now.toFormat('h:mm a'),
    date: now.toFormat('EEE, MMM d, yyyy'),
    isDifferentDay: false,
    iso: now.toISO() || '',
    hoursDifference: 0, // No conversion, so difference is 0
    isBusinessHours
  };
}

/**
 * Validate if a timezone string is valid
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    const dt = DateTime.now().setZone(timezone);
    return dt.isValid;
  } catch {
    return false;
  }
}

/**
 * Get timezone offset in hours
 */
export function getTimezoneOffsetHours(timezone: string): number {
  const dt = DateTime.now().setZone(timezone);
  return dt.offset / 60;
}

/**
 * Format a timezone offset as a string (e.g., "GMT+5", "GMT-8")
 */
export function formatTimezoneOffset(timezone: string): string {
  const dt = DateTime.now().setZone(timezone);
  const offset = dt.offset;
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';
  return `GMT${sign}${hours}${minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''}`;
}
