import { TimezoneGroup, TimezoneData } from '../types/timezone.types';
import { DateTime } from 'luxon';

/**
 * Helper function to get current offset for a timezone
 */
function getTimezoneOffset(tz: string): string {
  const dt = DateTime.now().setZone(tz);
  const offset = dt.offset;
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';
  return `GMT${sign}${hours}${minutes > 0 ? `:${minutes}` : ''}`;
}

/**
 * Popular timezones that should appear at the top of the list
 */
export const POPULAR_TIMEZONES: TimezoneData[] = [
  {
    value: 'America/New_York',
    label: 'New York',
    offset: getTimezoneOffset('America/New_York'),
    searchTerms: ['eastern', 'est', 'edt', 'us', 'usa']
  },
  {
    value: 'America/Los_Angeles',
    label: 'Los Angeles',
    offset: getTimezoneOffset('America/Los_Angeles'),
    searchTerms: ['pacific', 'pst', 'pdt', 'california', 'us', 'usa']
  },
  {
    value: 'America/Chicago',
    label: 'Chicago',
    offset: getTimezoneOffset('America/Chicago'),
    searchTerms: ['central', 'cst', 'cdt', 'us', 'usa']
  },
  {
    value: 'Europe/London',
    label: 'London',
    offset: getTimezoneOffset('Europe/London'),
    searchTerms: ['gmt', 'bst', 'uk', 'britain']
  },
  {
    value: 'Europe/Paris',
    label: 'Paris',
    offset: getTimezoneOffset('Europe/Paris'),
    searchTerms: ['cet', 'cest', 'france']
  },
  {
    value: 'Asia/Tokyo',
    label: 'Tokyo',
    offset: getTimezoneOffset('Asia/Tokyo'),
    searchTerms: ['jst', 'japan']
  },
  {
    value: 'Asia/Shanghai',
    label: 'Shanghai',
    offset: getTimezoneOffset('Asia/Shanghai'),
    searchTerms: ['china', 'beijing', 'cst']
  },
  {
    value: 'Australia/Sydney',
    label: 'Sydney',
    offset: getTimezoneOffset('Australia/Sydney'),
    searchTerms: ['aest', 'aedt', 'australia']
  }
];

/**
 * All timezones grouped by region
 */
export const TIMEZONE_GROUPS: TimezoneGroup[] = [
  {
    region: 'Americas',
    timezones: [
      {
        value: 'America/New_York',
        label: 'New York',
        offset: getTimezoneOffset('America/New_York'),
        searchTerms: ['eastern', 'est', 'edt', 'us', 'usa']
      },
      {
        value: 'America/Chicago',
        label: 'Chicago',
        offset: getTimezoneOffset('America/Chicago'),
        searchTerms: ['central', 'cst', 'cdt', 'us', 'usa']
      },
      {
        value: 'America/Denver',
        label: 'Denver',
        offset: getTimezoneOffset('America/Denver'),
        searchTerms: ['mountain', 'mst', 'mdt', 'us', 'usa']
      },
      {
        value: 'America/Los_Angeles',
        label: 'Los Angeles',
        offset: getTimezoneOffset('America/Los_Angeles'),
        searchTerms: ['pacific', 'pst', 'pdt', 'california', 'us', 'usa']
      },
      {
        value: 'America/Phoenix',
        label: 'Phoenix',
        offset: getTimezoneOffset('America/Phoenix'),
        searchTerms: ['arizona', 'mst', 'us', 'usa']
      },
      {
        value: 'America/Anchorage',
        label: 'Anchorage',
        offset: getTimezoneOffset('America/Anchorage'),
        searchTerms: ['alaska', 'akst', 'akdt', 'us', 'usa']
      },
      {
        value: 'Pacific/Honolulu',
        label: 'Honolulu',
        offset: getTimezoneOffset('Pacific/Honolulu'),
        searchTerms: ['hawaii', 'hst', 'us', 'usa']
      },
      {
        value: 'America/Toronto',
        label: 'Toronto',
        offset: getTimezoneOffset('America/Toronto'),
        searchTerms: ['canada', 'eastern', 'est', 'edt']
      },
      {
        value: 'America/Vancouver',
        label: 'Vancouver',
        offset: getTimezoneOffset('America/Vancouver'),
        searchTerms: ['canada', 'pacific', 'pst', 'pdt']
      },
      {
        value: 'America/Mexico_City',
        label: 'Mexico City',
        offset: getTimezoneOffset('America/Mexico_City'),
        searchTerms: ['mexico', 'cst', 'cdt']
      },
      {
        value: 'America/Sao_Paulo',
        label: 'São Paulo',
        offset: getTimezoneOffset('America/Sao_Paulo'),
        searchTerms: ['brazil', 'brt', 'brst']
      },
      {
        value: 'America/Argentina/Buenos_Aires',
        label: 'Buenos Aires',
        offset: getTimezoneOffset('America/Argentina/Buenos_Aires'),
        searchTerms: ['argentina', 'art']
      },
      {
        value: 'America/Lima',
        label: 'Lima',
        offset: getTimezoneOffset('America/Lima'),
        searchTerms: ['peru', 'pet']
      },
      {
        value: 'America/Bogota',
        label: 'Bogotá',
        offset: getTimezoneOffset('America/Bogota'),
        searchTerms: ['colombia', 'cot']
      }
    ]
  },
  {
    region: 'Europe',
    timezones: [
      {
        value: 'Europe/London',
        label: 'London',
        offset: getTimezoneOffset('Europe/London'),
        searchTerms: ['uk', 'britain', 'gmt', 'bst']
      },
      {
        value: 'Europe/Paris',
        label: 'Paris',
        offset: getTimezoneOffset('Europe/Paris'),
        searchTerms: ['france', 'cet', 'cest']
      },
      {
        value: 'Europe/Berlin',
        label: 'Berlin',
        offset: getTimezoneOffset('Europe/Berlin'),
        searchTerms: ['germany', 'cet', 'cest']
      },
      {
        value: 'Europe/Madrid',
        label: 'Madrid',
        offset: getTimezoneOffset('Europe/Madrid'),
        searchTerms: ['spain', 'cet', 'cest']
      },
      {
        value: 'Europe/Rome',
        label: 'Rome',
        offset: getTimezoneOffset('Europe/Rome'),
        searchTerms: ['italy', 'cet', 'cest']
      },
      {
        value: 'Europe/Amsterdam',
        label: 'Amsterdam',
        offset: getTimezoneOffset('Europe/Amsterdam'),
        searchTerms: ['netherlands', 'holland', 'cet', 'cest']
      },
      {
        value: 'Europe/Brussels',
        label: 'Brussels',
        offset: getTimezoneOffset('Europe/Brussels'),
        searchTerms: ['belgium', 'cet', 'cest']
      },
      {
        value: 'Europe/Vienna',
        label: 'Vienna',
        offset: getTimezoneOffset('Europe/Vienna'),
        searchTerms: ['austria', 'cet', 'cest']
      },
      {
        value: 'Europe/Zurich',
        label: 'Zurich',
        offset: getTimezoneOffset('Europe/Zurich'),
        searchTerms: ['switzerland', 'cet', 'cest']
      },
      {
        value: 'Europe/Stockholm',
        label: 'Stockholm',
        offset: getTimezoneOffset('Europe/Stockholm'),
        searchTerms: ['sweden', 'cet', 'cest']
      },
      {
        value: 'Europe/Copenhagen',
        label: 'Copenhagen',
        offset: getTimezoneOffset('Europe/Copenhagen'),
        searchTerms: ['denmark', 'cet', 'cest']
      },
      {
        value: 'Europe/Oslo',
        label: 'Oslo',
        offset: getTimezoneOffset('Europe/Oslo'),
        searchTerms: ['norway', 'cet', 'cest']
      },
      {
        value: 'Europe/Helsinki',
        label: 'Helsinki',
        offset: getTimezoneOffset('Europe/Helsinki'),
        searchTerms: ['finland', 'eet', 'eest']
      },
      {
        value: 'Europe/Moscow',
        label: 'Moscow',
        offset: getTimezoneOffset('Europe/Moscow'),
        searchTerms: ['russia', 'msk']
      },
      {
        value: 'Europe/Istanbul',
        label: 'Istanbul',
        offset: getTimezoneOffset('Europe/Istanbul'),
        searchTerms: ['turkey', 'trt']
      },
      {
        value: 'Europe/Athens',
        label: 'Athens',
        offset: getTimezoneOffset('Europe/Athens'),
        searchTerms: ['greece', 'eet', 'eest']
      },
      {
        value: 'Europe/Dublin',
        label: 'Dublin',
        offset: getTimezoneOffset('Europe/Dublin'),
        searchTerms: ['ireland', 'gmt', 'ist']
      },
      {
        value: 'Europe/Lisbon',
        label: 'Lisbon',
        offset: getTimezoneOffset('Europe/Lisbon'),
        searchTerms: ['portugal', 'west', 'wet']
      }
    ]
  },
  {
    region: 'Asia',
    timezones: [
      {
        value: 'Asia/Tokyo',
        label: 'Tokyo',
        offset: getTimezoneOffset('Asia/Tokyo'),
        searchTerms: ['japan', 'jst']
      },
      {
        value: 'Asia/Shanghai',
        label: 'Shanghai',
        offset: getTimezoneOffset('Asia/Shanghai'),
        searchTerms: ['china', 'beijing', 'cst']
      },
      {
        value: 'Asia/Hong_Kong',
        label: 'Hong Kong',
        offset: getTimezoneOffset('Asia/Hong_Kong'),
        searchTerms: ['hkt']
      },
      {
        value: 'Asia/Singapore',
        label: 'Singapore',
        offset: getTimezoneOffset('Asia/Singapore'),
        searchTerms: ['sgt']
      },
      {
        value: 'Asia/Seoul',
        label: 'Seoul',
        offset: getTimezoneOffset('Asia/Seoul'),
        searchTerms: ['korea', 'south korea', 'kst']
      },
      {
        value: 'Asia/Taipei',
        label: 'Taipei',
        offset: getTimezoneOffset('Asia/Taipei'),
        searchTerms: ['taiwan', 'cst']
      },
      {
        value: 'Asia/Bangkok',
        label: 'Bangkok',
        offset: getTimezoneOffset('Asia/Bangkok'),
        searchTerms: ['thailand', 'ict']
      },
      {
        value: 'Asia/Jakarta',
        label: 'Jakarta',
        offset: getTimezoneOffset('Asia/Jakarta'),
        searchTerms: ['indonesia', 'wib']
      },
      {
        value: 'Asia/Manila',
        label: 'Manila',
        offset: getTimezoneOffset('Asia/Manila'),
        searchTerms: ['philippines', 'pht']
      },
      {
        value: 'Asia/Kuala_Lumpur',
        label: 'Kuala Lumpur',
        offset: getTimezoneOffset('Asia/Kuala_Lumpur'),
        searchTerms: ['malaysia', 'myt']
      },
      {
        value: 'Asia/Dubai',
        label: 'Dubai',
        offset: getTimezoneOffset('Asia/Dubai'),
        searchTerms: ['uae', 'emirates', 'gst']
      },
      {
        value: 'Asia/Kolkata',
        label: 'Kolkata',
        offset: getTimezoneOffset('Asia/Kolkata'),
        searchTerms: ['india', 'mumbai', 'delhi', 'ist']
      },
      {
        value: 'Asia/Karachi',
        label: 'Karachi',
        offset: getTimezoneOffset('Asia/Karachi'),
        searchTerms: ['pakistan', 'pkt']
      },
      {
        value: 'Asia/Dhaka',
        label: 'Dhaka',
        offset: getTimezoneOffset('Asia/Dhaka'),
        searchTerms: ['bangladesh', 'bst']
      },
      {
        value: 'Asia/Yangon',
        label: 'Yangon',
        offset: getTimezoneOffset('Asia/Yangon'),
        searchTerms: ['myanmar', 'burma', 'mmt']
      },
      {
        value: 'Asia/Jerusalem',
        label: 'Jerusalem',
        offset: getTimezoneOffset('Asia/Jerusalem'),
        searchTerms: ['israel', 'ist']
      },
      {
        value: 'Asia/Tehran',
        label: 'Tehran',
        offset: getTimezoneOffset('Asia/Tehran'),
        searchTerms: ['iran', 'irst']
      }
    ]
  },
  {
    region: 'Pacific',
    timezones: [
      {
        value: 'Australia/Sydney',
        label: 'Sydney',
        offset: getTimezoneOffset('Australia/Sydney'),
        searchTerms: ['australia', 'aest', 'aedt']
      },
      {
        value: 'Australia/Melbourne',
        label: 'Melbourne',
        offset: getTimezoneOffset('Australia/Melbourne'),
        searchTerms: ['australia', 'aest', 'aedt']
      },
      {
        value: 'Australia/Brisbane',
        label: 'Brisbane',
        offset: getTimezoneOffset('Australia/Brisbane'),
        searchTerms: ['australia', 'aest']
      },
      {
        value: 'Australia/Perth',
        label: 'Perth',
        offset: getTimezoneOffset('Australia/Perth'),
        searchTerms: ['australia', 'awst']
      },
      {
        value: 'Pacific/Auckland',
        label: 'Auckland',
        offset: getTimezoneOffset('Pacific/Auckland'),
        searchTerms: ['new zealand', 'nzst', 'nzdt']
      },
      {
        value: 'Pacific/Fiji',
        label: 'Fiji',
        offset: getTimezoneOffset('Pacific/Fiji'),
        searchTerms: ['fjt']
      },
      {
        value: 'Pacific/Guam',
        label: 'Guam',
        offset: getTimezoneOffset('Pacific/Guam'),
        searchTerms: ['chst']
      },
      {
        value: 'Pacific/Port_Moresby',
        label: 'Port Moresby',
        offset: getTimezoneOffset('Pacific/Port_Moresby'),
        searchTerms: ['papua new guinea', 'pgt']
      }
    ]
  },
  {
    region: 'Africa',
    timezones: [
      {
        value: 'Africa/Cairo',
        label: 'Cairo',
        offset: getTimezoneOffset('Africa/Cairo'),
        searchTerms: ['egypt', 'eet']
      },
      {
        value: 'Africa/Johannesburg',
        label: 'Johannesburg',
        offset: getTimezoneOffset('Africa/Johannesburg'),
        searchTerms: ['south africa', 'sast']
      },
      {
        value: 'Africa/Lagos',
        label: 'Lagos',
        offset: getTimezoneOffset('Africa/Lagos'),
        searchTerms: ['nigeria', 'wat']
      },
      {
        value: 'Africa/Nairobi',
        label: 'Nairobi',
        offset: getTimezoneOffset('Africa/Nairobi'),
        searchTerms: ['kenya', 'eat']
      },
      {
        value: 'Africa/Casablanca',
        label: 'Casablanca',
        offset: getTimezoneOffset('Africa/Casablanca'),
        searchTerms: ['morocco', 'west']
      },
      {
        value: 'Africa/Accra',
        label: 'Accra',
        offset: getTimezoneOffset('Africa/Accra'),
        searchTerms: ['ghana', 'gmt']
      }
    ]
  }
];

/**
 * Get all timezones as a flat list
 */
export function getAllTimezones(): TimezoneData[] {
  return TIMEZONE_GROUPS.flatMap(group => group.timezones);
}

/**
 * Search timezones by query string
 */
export function searchTimezones(query: string): TimezoneData[] {
  const lowercaseQuery = query.toLowerCase().trim();

  if (!lowercaseQuery) {
    return POPULAR_TIMEZONES;
  }

  const allTimezones = getAllTimezones();

  return allTimezones.filter(tz =>
    tz.label.toLowerCase().includes(lowercaseQuery) ||
    tz.value.toLowerCase().includes(lowercaseQuery) ||
    tz.offset.toLowerCase().includes(lowercaseQuery) ||
    tz.searchTerms.some(term => term.includes(lowercaseQuery))
  );
}
