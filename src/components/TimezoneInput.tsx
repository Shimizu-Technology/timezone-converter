import { useState, useEffect } from 'react';
import { useTimezoneStore } from '../store/timezoneStore';
import { POPULAR_TIMEZONES } from '../utils/timezoneData';
import { parseTime } from '../utils/timezoneUtils';

export default function TimezoneInput() {
  const { sourceTime, sourceTimezone, setSourceTime, setSourceTimezone } = useTimezoneStore();
  const [timeInput, setTimeInput] = useState(sourceTime);
  const [error, setError] = useState<string | null>(null);

  // Update local input when store changes
  useEffect(() => {
    setTimeInput(sourceTime);
  }, [sourceTime]);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTimeInput(value);
    setError(null);

    try {
      // Validate time format
      const { time } = parseTime(value);
      setSourceTime(time);
    } catch (err) {
      // Show error but don't prevent typing
      if (value.length > 2) {
        setError(err instanceof Error ? err.message : 'Invalid time format');
      }
    }
  };

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSourceTimezone(e.target.value);
  };

  const handleSetNow = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    setTimeInput(timeString);
    setSourceTime(timeString);
    setError(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        What time is it in...
      </label>

      <div className="flex flex-col sm:flex-row gap-3">
        {/* Time input */}
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              value={timeInput}
              onChange={handleTimeChange}
              placeholder="e.g., 3pm, 15:00, now"
              className="w-full px-4 py-3 pr-20 text-lg bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              aria-label="Time"
              autoComplete="off"
            />
            <button
              onClick={handleSetNow}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              Now
            </button>
          </div>
          {error && (
            <p className="mt-1 text-xs text-red-600">{error}</p>
          )}
        </div>

        {/* Timezone selector */}
        <div className="sm:w-64">
          <select
            value={sourceTimezone}
            onChange={handleTimezoneChange}
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white cursor-pointer"
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
