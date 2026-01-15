import { useState, useEffect, useRef } from 'react';
import { useTimezoneStore } from '../store/timezoneStore';
import { POPULAR_TIMEZONES } from '../utils/timezoneData';
import { parseTime } from '../utils/timezoneUtils';
import DateSelector from './DateSelector';
import TimePicker from './TimePicker';

export default function TimezoneInput() {
  const { sourceTime, sourceTimezone, setSourceTime, setSourceTimezone, useMilitaryTime } = useTimezoneStore();
  const [timeInput, setTimeInput] = useState(sourceTime);
  const [error, setError] = useState<string | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const debounceTimerRef = useRef<number | null>(null);
  const isUserTypingRef = useRef(false);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Format time for display based on military time setting
  const formatTimeForDisplay = (time24: string): string => {
    const [hours, minutes] = time24.split(':').map(Number);

    if (useMilitaryTime) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    } else {
      const period = hours >= 12 ? 'PM' : 'AM';
      const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
  };

  // Update local input when store changes or military time toggle changes
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

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (value.length > 0) {
      debounceTimerRef.current = setTimeout(() => {
        try {
          const { time } = parseTime(value);
          setSourceTime(time);
          isUserTypingRef.current = false;
        } catch (err) {
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
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    isUserTypingRef.current = false;

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

  const handleTimePickerChange = (time: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    isUserTypingRef.current = false;
    
    setSourceTime(time);
    setTimeInput(formatTimeForDisplay(time));
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ backgroundColor: '#0d9488' }}>
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <label className="font-display text-lg font-bold" style={{ color: 'var(--card-text-primary)' }}>
          What time is it in...
        </label>
      </div>

      {/* Quick time buttons - always shown */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleQuickTime('09:00')}
          className="flex-1 min-w-fit px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm whitespace-nowrap border hover:opacity-80 active:scale-95"
          style={{ backgroundColor: 'var(--card-bg)', color: 'var(--card-text-primary)', borderColor: 'var(--card-border)' }}
        >
          🌅 9am
        </button>
        <button
          onClick={() => handleQuickTime('12:00')}
          className="flex-1 min-w-fit px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm whitespace-nowrap border hover:opacity-80 active:scale-95"
          style={{ backgroundColor: 'var(--card-bg)', color: 'var(--card-text-primary)', borderColor: 'var(--card-border)' }}
        >
          ☀️ 12pm
        </button>
        <button
          onClick={() => handleQuickTime('17:00')}
          className="flex-1 min-w-fit px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm whitespace-nowrap border hover:opacity-80 active:scale-95"
          style={{ backgroundColor: 'var(--card-bg)', color: 'var(--card-text-primary)', borderColor: 'var(--card-border)' }}
        >
          🌆 5pm
        </button>
        <button
          onClick={handleSetNow}
          className="flex-1 min-w-fit px-3 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm whitespace-nowrap text-white active:scale-95"
          style={{ backgroundColor: '#0d9488' }}
        >
          ⏱️ Now
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {/* Time input with clock button */}
        <div className="relative" ref={inputContainerRef}>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={timeInput}
                onChange={handleTimeChange}
                onBlur={handleTimeBlur}
                onFocus={() => setShowTimePicker(false)}
                placeholder="e.g., 3pm, 15:00"
                className="w-full h-12 sm:h-14 px-4 text-lg sm:text-xl font-display font-bold rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-ocean-400 outline-none transition-all shadow-sm border-2 placeholder:text-gray-400"
                style={{ backgroundColor: 'var(--card-bg)', color: 'var(--card-text-primary)', borderColor: 'var(--card-border)' }}
                aria-label="Time"
                autoComplete="off"
              />
            </div>
            <button
              onClick={() => setShowTimePicker(!showTimePicker)}
              className="h-12 sm:h-14 px-4 rounded-xl border-2 transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center"
              style={{ 
                backgroundColor: showTimePicker ? '#0d9488' : 'var(--card-bg)', 
                borderColor: showTimePicker ? '#0d9488' : 'var(--card-border)',
                color: showTimePicker ? 'white' : 'var(--card-text-primary)'
              }}
              aria-label="Open time picker"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          
          {/* Time Picker Dropdown */}
          {showTimePicker && (
            <TimePicker
              value={sourceTime}
              onChange={handleTimePickerChange}
              useMilitaryTime={useMilitaryTime}
              onClose={() => setShowTimePicker(false)}
            />
          )}
          
          {error && (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
        </div>

        {/* Date and Timezone row - side by side */}
        <div className="grid grid-cols-2 gap-3">
          <DateSelector />
          <select
            value={sourceTimezone}
            onChange={handleTimezoneChange}
            className="w-full h-12 sm:h-14 px-3 sm:px-4 text-sm sm:text-base font-display font-semibold rounded-xl focus:ring-2 focus:ring-ocean-400 focus:border-ocean-400 outline-none transition-all shadow-sm cursor-pointer appearance-none border-2"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--card-text-primary)', borderColor: 'var(--card-border)', backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em', paddingRight: '2rem' }}
            aria-label="Source timezone"
          >
            <optgroup label="Popular Timezones">
              {POPULAR_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      <p className="text-sm flex items-center gap-2" style={{ color: 'var(--card-text-muted)' }}>
        <span className="inline-flex items-center justify-center w-5 h-5 rounded text-xs" style={{ backgroundColor: 'var(--card-border)' }}>💡</span>
        Type a time like "3pm" or "15:00", or use the clock picker
      </p>
    </div>
  );
}
