import { useState, useEffect, useRef } from 'react';
import { useTimezoneStore } from '../store/timezoneStore';
import { POPULAR_TIMEZONES } from '../utils/timezoneData';
import { parseTime } from '../utils/timezoneUtils';
import DateSelector from './DateSelector';

export default function TimezoneInput() {
  const { sourceTime, sourceTimezone, setSourceTime, setSourceTimezone, useMilitaryTime } = useTimezoneStore();
  const [timeInput, setTimeInput] = useState(sourceTime);
  const [error, setError] = useState<string | null>(null);
  const debounceTimerRef = useRef<number | null>(null);
  const isUserTypingRef = useRef(false);

  // Format time for display based on military time setting
  const formatTimeForDisplay = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);

    if (useMilitaryTime) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      // Convert to 12hr format
      const period = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  };

  // Update local input when store changes or military time toggle changes
  // But only if the user is not actively typing
  useEffect(() => {
    if (!isUserTypingRef.current) {
      setTimeInput(formatTimeForDisplay(sourceTime));
    }
  }, [sourceTime, useMilitaryTime]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    isUserTypingRef.current = true;
    setTimeInput(value);
    setError(null);

    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Only try to parse after user stops typing for 800ms
    if (value.length > 0) {
      debounceTimerRef.current = setTimeout(() => {
        try {
          const { time } = parseTime(value);
          setSourceTime(time);
          isUserTypingRef.current = false;
        } catch (err) {
          // Show error if input looks complete
          if (value.length > 2) {
            setError(err instanceof Error ? err.message : 'Invalid time format');
          }
          isUserTypingRef.current = false;
        }
      }, 800);
    } else {
      isUserTypingRef.current = false;
    }
  };

  const handleTimeBlur = () => {
    // Clear debounce timer and parse immediately on blur
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    isUserTypingRef.current = false;

    // Reformat to standard format on blur
    try {
      const { time } = parseTime(timeInput);
      setSourceTime(time);
      setTimeInput(formatTimeForDisplay(time));
      setError(null);
    } catch (err) {
      // Keep showing error
    }
  };

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSourceTimezone(e.target.value);
  };

  const handleSetNow = () => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    isUserTypingRef.current = false;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    setSourceTime(timeString);
    setTimeInput(formatTimeForDisplay(timeString));
    setError(null);
  };

  const handleQuickTime = (timeStr: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    isUserTypingRef.current = false;

    setSourceTime(timeStr);
    setTimeInput(formatTimeForDisplay(timeStr));
    setError(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <label className="text-base font-bold text-gray-900">
          What time is it in...
        </label>
      </div>

      {/* Quick Guam time buttons */}
      {sourceTimezone === 'Pacific/Guam' && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => handleQuickTime('08:00')}
            className="px-3 py-2 text-xs font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-all shadow-sm border border-cyan-200 whitespace-nowrap"
          >
            Start of Day (8am)
          </button>
          <button
            onClick={() => handleQuickTime('12:00')}
            className="px-3 py-2 text-xs font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-all shadow-sm border border-cyan-200 whitespace-nowrap"
          >
            Lunch (12pm)
          </button>
          <button
            onClick={() => handleQuickTime('17:00')}
            className="px-3 py-2 text-xs font-semibold text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg transition-all shadow-sm border border-cyan-200 whitespace-nowrap"
          >
            End of Day (5pm)
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
        {/* Time input */}
        <div className="sm:col-span-1">
          <div className="relative">
            <input
              type="text"
              value={timeInput}
              onChange={handleTimeChange}
              onBlur={handleTimeBlur}
              placeholder="e.g., 3pm, 15:00, now"
              className="w-full h-12 px-4 pr-20 text-lg font-semibold bg-white text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all shadow-sm"
              aria-label="Time"
              autoComplete="off"
            />
            <button
              onClick={handleSetNow}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-sm font-bold text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-all shadow-sm"
            >
              Now
            </button>
          </div>
          {error && (
            <p className="mt-1 text-xs text-red-600">{error}</p>
          )}
        </div>

        {/* Date selector */}
        <div className="sm:col-span-1">
          <DateSelector />
        </div>

        {/* Timezone selector */}
        <div className="sm:col-span-1">
          <select
            value={sourceTimezone}
            onChange={handleTimezoneChange}
            className="w-full h-12 px-4 text-lg font-semibold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all bg-white cursor-pointer shadow-sm"
            aria-label="Source timezone"
          >
            <optgroup label="Popular">
              {POPULAR_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label} ({tz.offset})
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      <p className="text-xs text-gray-500">
        Try: "3pm", "15:00", "3:30 PM", or "now"
      </p>
    </div>
  );
}
