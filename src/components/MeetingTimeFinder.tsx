import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { TimezoneInfo } from '../types/timezone.types';
import { getTimezoneInfo } from '../utils/timezoneUtils';
import clsx from 'clsx';

interface MeetingTimeFinderProps {
  sourceTimezone: string;
  targetTimezones: TimezoneInfo[];
  useMilitaryTime?: boolean;
}

interface TimeSlot {
  hour: number;
  isOverlapping: boolean;
  timezones: { [key: string]: string };
}

export default function MeetingTimeFinder({
  sourceTimezone,
  targetTimezones,
  useMilitaryTime = false
}: MeetingTimeFinderProps) {
  // Business hours customization
  const [businessHoursStart, setBusinessHoursStart] = useState(9);
  const [businessHoursEnd, setBusinessHoursEnd] = useState(17);

  // Get proper source timezone info
  const sourceTimezoneInfo = getTimezoneInfo(sourceTimezone);

  const allTimezones = [
    { timezone: sourceTimezone, displayName: sourceTimezoneInfo.displayName },
    ...targetTimezones
  ];

  // Calculate overlapping business hours
  const overlappingHours = useMemo(() => {
    const slots: TimeSlot[] = [];

    for (let hour = 0; hour < 24; hour++) {
      const sourceTime = DateTime.now()
        .setZone(sourceTimezone)
        .set({ hour, minute: 0, second: 0 });

      const timezones: { [key: string]: string } = {};
      let allInBusinessHours = true;

      allTimezones.forEach(tz => {
        const convertedTime = sourceTime.setZone(tz.timezone);
        const convertedHour = convertedTime.hour;

        timezones[tz.timezone] = useMilitaryTime
          ? convertedTime.toFormat('HH:mm')
          : convertedTime.toFormat('h:mm a');

        if (convertedHour < businessHoursStart || convertedHour >= businessHoursEnd) {
          allInBusinessHours = false;
        }
      });

      slots.push({
        hour,
        isOverlapping: allInBusinessHours,
        timezones
      });
    }

    return slots;
  }, [sourceTimezone, targetTimezones, allTimezones, useMilitaryTime, businessHoursStart, businessHoursEnd]);

  // Find continuous overlapping time blocks
  const meetingWindows = useMemo(() => {
    const windows: { start: number; end: number }[] = [];
    let currentWindow: { start: number; end: number } | null = null;

    overlappingHours.forEach((slot) => {
      if (slot.isOverlapping) {
        if (currentWindow === null) {
          currentWindow = { start: slot.hour, end: slot.hour };
        } else {
          currentWindow.end = slot.hour;
        }
      } else {
        if (currentWindow !== null) {
          windows.push(currentWindow);
          currentWindow = null;
        }
      }
    });

    if (currentWindow !== null) {
      windows.push(currentWindow);
    }

    return windows;
  }, [overlappingHours]);

  const formatHour = (hour: number) => {
    if (useMilitaryTime) {
      return `${hour.toString().padStart(2, '0')}:00`;
    }
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const meridiem = hour < 12 ? 'AM' : 'PM';
    return `${hour12}:00 ${meridiem}`;
  };

  // Generate Google Calendar URL for a meeting window
  const generateCalendarUrl = (window: { start: number; end: number }) => {
    const today = DateTime.now().setZone(sourceTimezone);
    const startDateTime = today.set({ hour: window.start, minute: 0, second: 0 });
    const endDateTime = today.set({ hour: window.end + 1, minute: 0, second: 0 });
    
    // Format for Google Calendar (YYYYMMDDTHHMMSS)
    const formatForGCal = (dt: DateTime) => dt.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    
    // Build description with all timezone conversions
    let description = 'Meeting times across timezones:\n\n';
    allTimezones.forEach((tz) => {
      const startLocal = startDateTime.setZone(tz.timezone);
      const endLocal = endDateTime.setZone(tz.timezone);
      const startStr = useMilitaryTime ? startLocal.toFormat('HH:mm') : startLocal.toFormat('h:mm a');
      const endStr = useMilitaryTime ? endLocal.toFormat('HH:mm') : endLocal.toFormat('h:mm a');
      description += `• ${tz.displayName}: ${startStr} – ${endStr}\n`;
    });
    description += '\nCreated with Hafa Timezones';
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'Meeting',
      dates: `${formatForGCal(startDateTime)}/${formatForGCal(endDateTime)}`,
      details: description,
      ctz: sourceTimezone
    });
    
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  if (targetTimezones.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📅</div>
        <p className="text-gray-600 dark:text-gray-300">
          Add at least one timezone to find meeting times
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Business Hours Configuration */}
      <div className="p-5 rounded-xl border" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--card-text-secondary)' }}>
          <span className="w-6 h-6 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: 'var(--card-border)' }}>⚙️</span>
          Define Business Hours
        </h4>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <label htmlFor="start-hour" className="text-sm font-medium" style={{ color: 'var(--card-text-muted)' }}>
              Start:
            </label>
            <select
              id="start-hour"
              value={businessHoursStart}
              onChange={(e) => setBusinessHoursStart(Number(e.target.value))}
              className="px-4 py-2 text-sm font-semibold border-2 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-ocean-400 outline-none"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--card-text-primary)', borderColor: 'var(--card-border)' }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {useMilitaryTime ? `${i.toString().padStart(2, '0')}:00` :
                   `${i === 0 ? 12 : i > 12 ? i - 12 : i}:00 ${i < 12 ? 'AM' : 'PM'}`}
                </option>
              ))}
            </select>
          </div>
          <span className="hidden sm:inline font-bold" style={{ color: 'var(--card-text-muted)' }}>→</span>
          <div className="flex items-center gap-3">
            <label htmlFor="end-hour" className="text-sm font-medium" style={{ color: 'var(--card-text-muted)' }}>
              End:
            </label>
            <select
              id="end-hour"
              value={businessHoursEnd}
              onChange={(e) => setBusinessHoursEnd(Number(e.target.value))}
              className="px-4 py-2 text-sm font-semibold border-2 rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-ocean-400 outline-none"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--card-text-primary)', borderColor: 'var(--card-border)' }}
            >
              {Array.from({ length: 24 }, (_, i) => i + 1).map((i) => (
                <option key={i} value={i}>
                  {useMilitaryTime ? `${i.toString().padStart(2, '0')}:00` :
                   `${i === 12 ? 12 : i > 12 ? i - 12 : i}:00 ${i < 12 ? 'AM' : 'PM'}`}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Meeting Windows Summary */}
      <div>
        <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--card-text-primary)' }}>
          <span className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-lg text-white">✓</span>
          Overlapping Business Hours
        </h3>
        {meetingWindows.length > 0 ? (
          <div className="space-y-3">
            {meetingWindows.map((window, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 bg-emerald-100 dark:bg-emerald-900/40 border-2 border-emerald-400 dark:border-emerald-600 rounded-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-xl shadow-md">
                  ✓
                </div>
                <div className="flex-1">
                  <p className="font-display text-xl font-bold text-emerald-900 dark:text-emerald-100">
                    {formatHour(window.start)} – {formatHour(window.end + 1)}
                  </p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300">
                    {window.end - window.start + 1} hour{window.end - window.start > 0 ? 's' : ''} in {allTimezones[0].displayName}
                  </p>
                </div>
                <a
                  href={generateCalendarUrl(window)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 bg-white dark:bg-gray-700 text-emerald-700 dark:text-emerald-300 text-sm font-semibold rounded-lg border border-emerald-300 dark:border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition-colors"
                  title="Add to Google Calendar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Add to Calendar</span>
                  <span className="sm:hidden">📅</span>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 bg-amber-100 dark:bg-amber-900/40 border-2 border-amber-400 dark:border-amber-600 rounded-xl text-center">
            <div className="text-4xl mb-3">😔</div>
            <p className="font-semibold mb-1 text-amber-900 dark:text-amber-100">
              No overlapping business hours found
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Consider asynchronous communication or flexible meeting times
            </p>
          </div>
        )}
      </div>

      {/* Detailed Hour Grid */}
      <div>
        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--card-text-secondary)' }}>
          <span className="w-6 h-6 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: 'var(--card-border)' }}>📊</span>
          Hour-by-Hour Breakdown
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-80 overflow-y-auto p-1">
          {overlappingHours.map((slot) => (
            <div
              key={slot.hour}
              className={clsx(
                'p-3 rounded-xl text-xs border-2 transition-all',
                slot.isOverlapping
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 border-emerald-400 dark:border-emerald-600'
                  : ''
              )}
              style={!slot.isOverlapping ? { backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' } : undefined}
            >
              <div className={clsx(
                'font-display font-bold text-sm mb-2',
                slot.isOverlapping ? 'text-emerald-800 dark:text-emerald-200' : ''
              )} style={!slot.isOverlapping ? { color: 'var(--card-text-primary)' } : undefined}>
                {formatHour(slot.hour)}
              </div>
              <div className="space-y-1">
                {allTimezones.map((tz) => (
                  <div key={tz.timezone} className="flex justify-between items-center gap-2">
                    <span className="truncate text-xs" style={{ color: 'var(--card-text-muted)' }}>
                      {tz.displayName.split(' ')[0]}
                    </span>
                    <span className={clsx(
                      'font-mono text-xs px-1.5 py-0.5 rounded font-semibold',
                      slot.isOverlapping 
                        ? 'bg-emerald-300 dark:bg-emerald-700 text-emerald-900 dark:text-emerald-100' 
                        : ''
                    )} style={!slot.isOverlapping ? { backgroundColor: 'var(--card-border)', color: 'var(--card-text-secondary)' } : undefined}>
                      {slot.timezones[tz.timezone]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
