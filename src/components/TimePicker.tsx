import { useState, useRef, useEffect } from 'react';

interface TimePickerProps {
  value: string; // 24-hour format "HH:mm"
  onChange: (time: string) => void;
  useMilitaryTime: boolean;
  onClose: () => void;
}

const PRESET_TIMES = [
  { label: '🌅 Morning', time: '09:00', period: 'morning' },
  { label: '☀️ Noon', time: '12:00', period: 'noon' },
  { label: '🌆 Afternoon', time: '15:00', period: 'afternoon' },
  { label: '🌙 Evening', time: '18:00', period: 'evening' },
  { label: '🌃 Night', time: '21:00', period: 'night' },
];

export default function TimePicker({ value, onChange, useMilitaryTime, onClose }: TimePickerProps) {
  const [hours, minutes] = value.split(':').map(Number);
  const [selectedHour, setSelectedHour] = useState(hours);
  const [selectedMinute, setSelectedMinute] = useState(minutes);
  const [isPM, setIsPM] = useState(hours >= 12);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Update time when selections change
  const updateTime = (hour: number, minute: number, pm?: boolean) => {
    let hour24 = hour;
    
    if (!useMilitaryTime) {
      const actualPM = pm !== undefined ? pm : isPM;
      if (actualPM && hour !== 12) {
        hour24 = hour + 12;
      } else if (!actualPM && hour === 12) {
        hour24 = 0;
      }
    }
    
    const timeString = `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onChange(timeString);
  };

  const handleHourChange = (hour: number) => {
    setSelectedHour(hour);
    updateTime(hour, selectedMinute);
  };

  const handleMinuteChange = (minute: number) => {
    setSelectedMinute(minute);
    updateTime(selectedHour, minute);
  };

  const handlePeriodToggle = () => {
    const newIsPM = !isPM;
    setIsPM(newIsPM);
    updateTime(selectedHour, selectedMinute, newIsPM);
  };

  const handlePresetClick = (time: string) => {
    onChange(time);
    onClose();
  };

  // Generate hour options
  const hourOptions = useMilitaryTime
    ? Array.from({ length: 24 }, (_, i) => i)
    : Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i);

  // Generate minute options (in 5-minute intervals for easier selection)
  const minuteOptions = Array.from({ length: 12 }, (_, i) => i * 5);

  // Get display hour for 12-hour format
  const getDisplayHour = (hour: number) => {
    if (useMilitaryTime) return hour;
    if (hour === 0) return 12;
    if (hour > 12) return hour - 12;
    return hour;
  };

  const currentDisplayHour = getDisplayHour(selectedHour);

  return (
    <div
      ref={pickerRef}
      className="absolute top-full left-0 right-0 mt-2 rounded-2xl shadow-2xl z-[9999] overflow-hidden animate-scale-in border-2"
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
    >
      {/* Quick Presets */}
      <div className="p-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--card-text-muted)' }}>Quick Select</p>
        <div className="flex flex-wrap gap-2">
          {PRESET_TIMES.map((preset) => (
            <button
              key={preset.time}
              onClick={() => handlePresetClick(preset.time)}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all hover:scale-105 active:scale-95"
              style={{ 
                backgroundColor: 'var(--card-border)', 
                color: 'var(--card-text-primary)' 
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Selector */}
      <div className="p-4">
        <p className="text-xs font-semibold mb-3" style={{ color: 'var(--card-text-muted)' }}>Set Time</p>
        
        <div className="flex items-center justify-center gap-2">
          {/* Hours */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                const newHour = useMilitaryTime 
                  ? (selectedHour + 1) % 24 
                  : (currentDisplayHour % 12) + 1;
                handleHourChange(useMilitaryTime ? newHour : (isPM && newHour !== 12 ? newHour + 12 : newHour === 12 && !isPM ? 0 : newHour));
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              style={{ color: 'var(--card-text-muted)' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <div 
              className="w-16 h-16 flex items-center justify-center text-3xl font-bold font-display rounded-xl"
              style={{ backgroundColor: 'var(--card-border)', color: 'var(--card-text-primary)' }}
            >
              {useMilitaryTime 
                ? selectedHour.toString().padStart(2, '0')
                : currentDisplayHour.toString()
              }
            </div>
            <button
              onClick={() => {
                const newHour = useMilitaryTime 
                  ? (selectedHour - 1 + 24) % 24 
                  : ((currentDisplayHour - 2 + 12) % 12) + 1;
                handleHourChange(useMilitaryTime ? newHour : (isPM && newHour !== 12 ? newHour + 12 : newHour === 12 && !isPM ? 0 : newHour));
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              style={{ color: 'var(--card-text-muted)' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Separator */}
          <span className="text-3xl font-bold" style={{ color: 'var(--card-text-primary)' }}>:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => {
                const newMinute = (selectedMinute + 5) % 60;
                handleMinuteChange(newMinute);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              style={{ color: 'var(--card-text-muted)' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </button>
            <div 
              className="w-16 h-16 flex items-center justify-center text-3xl font-bold font-display rounded-xl"
              style={{ backgroundColor: 'var(--card-border)', color: 'var(--card-text-primary)' }}
            >
              {selectedMinute.toString().padStart(2, '0')}
            </div>
            <button
              onClick={() => {
                const newMinute = (selectedMinute - 5 + 60) % 60;
                handleMinuteChange(newMinute);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              style={{ color: 'var(--card-text-muted)' }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* AM/PM Toggle (only for 12-hour format) */}
          {!useMilitaryTime && (
            <div className="flex flex-col gap-1 ml-2">
              <button
                onClick={() => {
                  if (isPM) handlePeriodToggle();
                }}
                className={`px-3 py-2 text-sm font-bold rounded-lg transition-all ${
                  !isPM 
                    ? 'bg-ocean-500 text-white shadow-md' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                style={isPM ? { color: 'var(--card-text-muted)' } : undefined}
              >
                AM
              </button>
              <button
                onClick={() => {
                  if (!isPM) handlePeriodToggle();
                }}
                className={`px-3 py-2 text-sm font-bold rounded-lg transition-all ${
                  isPM 
                    ? 'bg-ocean-500 text-white shadow-md' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                style={!isPM ? { color: 'var(--card-text-muted)' } : undefined}
              >
                PM
              </button>
            </div>
          )}
        </div>

        {/* Common Minutes Quick Select */}
        <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--card-border)' }}>
          <p className="text-xs font-semibold mb-2" style={{ color: 'var(--card-text-muted)' }}>Minutes</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[0, 15, 30, 45].map((min) => (
              <button
                key={min}
                onClick={() => handleMinuteChange(min)}
                className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
                  selectedMinute === min 
                    ? 'bg-ocean-500 text-white shadow-md' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                style={selectedMinute !== min ? { 
                  backgroundColor: 'var(--card-border)', 
                  color: 'var(--card-text-primary)' 
                } : undefined}
              >
                :{min.toString().padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Done Button */}
      <div className="p-3 border-t" style={{ borderColor: 'var(--card-border)' }}>
        <button
          onClick={onClose}
          className="w-full py-3 text-sm font-bold text-white rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          style={{ backgroundColor: '#0d9488' }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
