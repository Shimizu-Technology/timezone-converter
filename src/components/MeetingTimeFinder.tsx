import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { TimezoneInfo } from '../types/timezone.types';
import { getTimezoneInfo } from '../utils/timezoneUtils';

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

    // For each hour of the day in source timezone
    for (let hour = 0; hour < 24; hour++) {
      const sourceTime = DateTime.now()
        .setZone(sourceTimezone)
        .set({ hour, minute: 0, second: 0 });

      const timezones: { [key: string]: string } = {};
      let allInBusinessHours = true;

      // Check this hour in all timezones
      allTimezones.forEach(tz => {
        const convertedTime = sourceTime.setZone(tz.timezone);
        const convertedHour = convertedTime.hour;

        timezones[tz.timezone] = useMilitaryTime
          ? convertedTime.toFormat('HH:mm')
          : convertedTime.toFormat('h:mm a');

        // Check if within custom business hours
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

    overlappingHours.forEach((slot, index) => {
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

    // Close last window if still open
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

  if (targetTimezones.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">Add at least one timezone to find meeting times</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Business Hours Configuration */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Define Business Hours
        </h4>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="start-hour" className="text-sm text-gray-600 min-w-[40px]">
              Start:
            </label>
            <select
              id="start-hour"
              value={businessHoursStart}
              onChange={(e) => setBusinessHoursStart(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {useMilitaryTime ? `${i.toString().padStart(2, '0')}:00` :
                   `${i === 0 ? 12 : i > 12 ? i - 12 : i}:00 ${i < 12 ? 'AM' : 'PM'}`}
                </option>
              ))}
            </select>
          </div>
          <span className="text-gray-400 hidden sm:inline">to</span>
          <div className="flex items-center gap-2">
            <label htmlFor="end-hour" className="text-sm text-gray-600 min-w-[40px]">
              End:
            </label>
            <select
              id="end-hour"
              value={businessHoursEnd}
              onChange={(e) => setBusinessHoursEnd(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
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
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Overlapping Business Hours
        </h3>
        {meetingWindows.length > 0 ? (
          <div className="space-y-2">
            {meetingWindows.map((window, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <svg
                  className="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {formatHour(window.start)} - {formatHour(window.end + 1)}
                  </p>
                  <p className="text-xs text-gray-600">
                    in {allTimezones[0].displayName || 'source timezone'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              No overlapping business hours found. Consider asynchronous communication or
              flexible meeting times.
            </p>
          </div>
        )}
      </div>

      {/* Detailed Hour Grid */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Hour-by-Hour Breakdown
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-96 overflow-y-auto">
          {overlappingHours.map((slot) => (
            <div
              key={slot.hour}
              className={`p-2 rounded text-xs border ${
                slot.isOverlapping
                  ? 'bg-green-50 border-green-300'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="font-semibold text-gray-900 mb-1">
                {formatHour(slot.hour)}
              </div>
              {allTimezones.map((tz) => (
                <div key={tz.timezone} className="text-gray-600">
                  <span className="font-medium">
                    {tz.displayName}:
                  </span>{' '}
                  {slot.timezones[tz.timezone]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
