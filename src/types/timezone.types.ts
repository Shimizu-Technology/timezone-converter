/**
 * Core TypeScript interfaces for the timezone converter application
 */

/**
 * Represents a timezone with display information
 */
export interface TimezoneInfo {
  id: string;                    // Unique identifier (e.g., "tz-1")
  timezone: string;              // IANA timezone name (e.g., "America/New_York")
  displayName: string;           // Human-readable name (e.g., "New York (EST)")
  abbreviation: string;          // Timezone abbreviation (e.g., "EST", "PST")
}

/**
 * A saved set of timezones for quick access
 */
export interface TimezoneSet {
  id: string;                    // UUID
  name: string;                  // User-defined name (e.g., "Work Team")
  timezones: TimezoneInfo[];     // Array of timezones in this set
  createdAt: string;             // ISO timestamp of when set was created
}

/**
 * Input parameters for timezone conversion
 */
export interface ConversionInput {
  sourceTime: string;            // Time in 24-hour format (e.g., "15:00") or 12-hour (e.g., "3:00 PM")
  sourceTimezone: string;        // IANA timezone name where the source time is from
  targetTimezones: TimezoneInfo[]; // Timezones to convert to
}

/**
 * Result of a timezone conversion
 */
export interface ConvertedTime {
  timezoneInfo: TimezoneInfo;    // Timezone information
  time: string;                  // Converted time (e.g., "3:00 PM")
  date: string;                  // Full date (e.g., "Wed, Jan 12, 2026")
  isDifferentDay: boolean;       // True if date changed during conversion
  iso: string;                   // ISO 8601 string for the converted time
}

/**
 * Grouped timezone data for the picker
 */
export interface TimezoneGroup {
  region: string;                // Region name (e.g., "Americas", "Europe", "Asia")
  timezones: TimezoneData[];     // Timezones in this region
}

/**
 * Raw timezone data for the picker
 */
export interface TimezoneData {
  value: string;                 // IANA timezone name
  label: string;                 // Display label
  offset: string;                // Current UTC offset (e.g., "GMT-5")
  searchTerms: string[];         // Additional search terms for filtering
}
