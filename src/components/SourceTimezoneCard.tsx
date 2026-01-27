import { useMemo } from 'react';
import { DateTime } from 'luxon';
import { getTimezoneInfo, parseTime } from '../utils/timezoneUtils';
import clsx from 'clsx';

interface SourceTimezoneCardProps {
  sourceTime: string;
  sourceTimezone: string;
  sourceDate: string | null;
  useMilitaryTime: boolean;
}

export default function SourceTimezoneCard({
  sourceTime,
  sourceTimezone,
  sourceDate,
  useMilitaryTime
}: SourceTimezoneCardProps) {
  const timezoneInfo = getTimezoneInfo(sourceTimezone);
  
  const displayData = useMemo(() => {
    if (!sourceTime) return null;

    try {
      const parsed = parseTime(sourceTime);
      const [hours, minutes] = parsed.time.split(':').map(Number);
    
    // Create DateTime in source timezone (interpret date in target zone, not system zone)
    const baseDate = sourceDate 
      ? DateTime.fromISO(sourceDate, { zone: sourceTimezone })
      : DateTime.now().setZone(sourceTimezone);
    const dt = baseDate.set({ hour: hours, minute: minutes });
    
    // Format time
    const timeFormat = useMilitaryTime ? 'HH:mm' : 'h:mm a';
    const formattedTime = dt.toFormat(timeFormat);
    
    // Format date
    const formattedDate = dt.toFormat('ccc, LLL d, yyyy');
    
    // Get hour for day/night calculation
    const hour = dt.hour;
    const isDaytime = hour >= 6 && hour < 18;
    const isMorning = hour >= 6 && hour < 12;
    const isAfternoon = hour >= 12 && hour < 18;
    const isEvening = hour >= 18 && hour < 21;
    
    const getTimeOfDayInfo = () => {
      if (isMorning) return { icon: '🌅', label: 'Morning' };
      if (isAfternoon) return { icon: '☀️', label: 'Afternoon' };
      if (isEvening) return { icon: '🌆', label: 'Evening' };
      return { icon: '🌙', label: 'Night' };
    };

    // Calculate progress through the day (include minutes for smooth movement)
    const dayProgress = ((hour * 60 + minutes) / 1440) * 100;

    return {
      time: formattedTime,
      date: formattedDate,
      hour,
      isDaytime,
      timeOfDay: getTimeOfDayInfo(),
      dayProgress
    };
    } catch {
      return null;
    }
  }, [sourceTime, sourceTimezone, sourceDate, useMilitaryTime]);

  if (!displayData) return null;

  return (
    <div
      className={clsx(
        'relative rounded-2xl transition-all duration-300 ease-out overflow-hidden',
        'shadow-md ring-2 ring-ocean-400'
      )}
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '1px', borderStyle: 'solid' }}
    >
      {/* Source indicator gradient */}
      <div className="h-1.5 bg-gradient-to-r from-ocean-400 via-teal-400 to-ocean-400" />

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Source badge icon */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0 bg-ocean-100 dark:bg-ocean-900/40">
              📍
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold bg-ocean-500 text-white shadow-sm uppercase tracking-wide">
                  Source
                </span>
              </div>
              <h3 className="font-display text-base sm:text-lg font-bold truncate" style={{ color: 'var(--card-text-primary)' }}>
                {timezoneInfo.displayName}
              </h3>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--card-text-muted)' }}>
                {displayData.timeOfDay.icon} {displayData.timeOfDay.label}
              </p>
            </div>
          </div>
          
          {/* Time display */}
          <div className="text-right flex-shrink-0">
            <div className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-ocean-600 dark:text-ocean-400">
              {displayData.time}
            </div>
          </div>
        </div>

        {/* Date row */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold bg-ocean-100 dark:bg-ocean-900/50 text-ocean-800 dark:text-ocean-200">
            <div className="w-2 h-2 rounded-full bg-ocean-500" />
            Reference time
          </div>
          <span className="text-xs sm:text-sm" style={{ color: 'var(--card-text-muted)' }}>
            {displayData.date}
          </span>
        </div>

        {/* Day progress indicator */}
        <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
            <span className="w-8 sm:w-10">12am</span>
            <div className="flex-1 h-1.5 sm:h-2 rounded-full bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
              {/* Business hours zone highlight */}
              <div 
                className="absolute h-full bg-emerald-200 dark:bg-emerald-800/50"
                style={{ left: '37.5%', width: '33.3%' }}
              />
              {/* Current time indicator */}
              <div 
                className={clsx(
                  'absolute top-1/2 -translate-y-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border-2 border-white dark:border-gray-800 shadow-md z-10',
                  'bg-ocean-500'
                )}
                style={{ left: `calc(${displayData.dayProgress}% - 4px)` }}
              />
            </div>
            <span className="w-8 sm:w-10 text-right">12pm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
