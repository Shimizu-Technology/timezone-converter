import { ConvertedTime } from '../types/timezone.types';
import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';

interface TimezoneCardProps {
  convertedTime: ConvertedTime;
  onRemove: (id: string) => void;
  isCurrent?: boolean;
}

export default function TimezoneCard({
  convertedTime,
  onRemove,
  isCurrent = false
}: TimezoneCardProps) {
  const { timezoneInfo, time, date, isDifferentDay, hoursDifference, isBusinessHours, iso } = convertedTime;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // Get the actual hour from the ISO string for accurate day/night calculation
  const targetDateTime = DateTime.fromISO(iso);
  const hour = targetDateTime.hour;

  // Determine if it's day or night (6am-6pm is day)
  const isDaytime = hour >= 6 && hour < 18;
  const isMorning = hour >= 6 && hour < 12;
  const isAfternoon = hour >= 12 && hour < 18;
  const isEvening = hour >= 18 && hour < 21;

  const formatHoursDifference = (hours: number) => {
    if (hours === 0) return 'Same time';
    const sign = hours > 0 ? '+' : '';
    return `${sign}${hours}h`;
  };

  const getTimeOfDayInfo = () => {
    if (isMorning) return { icon: '🌅', label: 'Morning' };
    if (isAfternoon) return { icon: '☀️', label: 'Afternoon' };
    if (isEvening) return { icon: '🌆', label: 'Evening' };
    return { icon: '🌙', label: 'Night' };
  };

  const getBusinessHoursStatus = () => {
    if (isBusinessHours) {
      return { 
        dotColor: 'bg-emerald-500', 
        bgColor: 'bg-emerald-100 dark:bg-emerald-900/50',
        textColor: 'text-emerald-800 dark:text-emerald-200',
        label: 'Business hours'
      };
    }
    if (hour >= 17 && hour < 21) {
      return { 
        dotColor: 'bg-amber-500', 
        bgColor: 'bg-amber-100 dark:bg-amber-900/50',
        textColor: 'text-amber-800 dark:text-amber-200',
        label: 'Evening'
      };
    }
    return { 
      dotColor: 'bg-gray-500', 
      bgColor: 'bg-gray-200 dark:bg-gray-700',
      textColor: 'text-gray-700 dark:text-gray-300',
      label: 'After hours'
    };
  };

  const timeOfDay = getTimeOfDayInfo();
  const businessStatus = getBusinessHoursStatus();

  // Calculate progress through the day (for visual indicator)
  const dayProgress = (hour / 24) * 100;

  return (
    <div
      className={clsx(
        'relative rounded-2xl transition-all duration-300 ease-out group overflow-hidden',
        'shadow-md hover:shadow-lg',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
        isCurrent && 'ring-2 ring-ocean-400'
      )}
      style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '1px', borderStyle: 'solid' }}
    >
      {/* Day/Night gradient indicator */}
      <div 
        className={clsx(
          'h-1.5',
          isDaytime 
            ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400'
            : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500'
        )}
      />

      <div className="p-4 sm:p-5">
        {/* Remove button - positioned on gradient bar, top right */}
        <button
          onClick={() => onRemove(timezoneInfo.id)}
          className="absolute top-2 right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all z-20 bg-white/80 dark:bg-gray-800/80 text-gray-400 dark:text-gray-400 hover:bg-red-500 hover:text-white shadow-sm backdrop-blur-sm"
          aria-label="Remove timezone"
        >
          <svg className="h-2.5 w-2.5 sm:h-3 sm:w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Header with time prominently displayed */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Day/Night icon */}
            <div className={clsx(
              'w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-lg sm:text-xl flex-shrink-0',
              isDaytime 
                ? 'bg-amber-100 dark:bg-amber-900/40' 
                : 'bg-indigo-100 dark:bg-indigo-900/40'
            )}>
              {timeOfDay.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-base sm:text-lg font-bold truncate" style={{ color: 'var(--card-text-primary)' }}>
                {timezoneInfo.displayName}
              </h3>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--card-text-muted)' }}>
                {timeOfDay.label} · {formatHoursDifference(hoursDifference)}
              </p>
            </div>
          </div>
          
          {/* Time display */}
          <div className="text-right flex-shrink-0">
            <div className="font-display text-2xl sm:text-4xl font-bold tracking-tight" style={{ color: 'var(--card-text-primary)' }}>
              {time}
            </div>
          </div>
        </div>

        {/* Date and status row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Business hours badge */}
          <div className={clsx(
            'inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs font-semibold',
            businessStatus.bgColor,
            businessStatus.textColor
          )}>
            <div className={clsx('w-2 h-2 rounded-full', businessStatus.dotColor)} />
            {businessStatus.label}
          </div>

          {/* Date info */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs sm:text-sm" style={{ color: 'var(--card-text-muted)' }}>{date}</span>
            {isDifferentDay && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-coral-500 text-white shadow-sm">
                {targetDateTime > DateTime.now() ? 'Next day' : 'Prev day'}
              </span>
            )}
          </div>
        </div>

        {/* Day progress indicator */}
        <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
            <span className="w-8 sm:w-10">12am</span>
            <div className="flex-1 h-1.5 sm:h-2 rounded-full bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
              {/* Business hours zone highlight (9am-5pm = 37.5% to 70.8%) */}
              <div 
                className="absolute h-full bg-emerald-200 dark:bg-emerald-800/50"
                style={{ left: '37.5%', width: '33.3%' }}
              />
              {/* Current time indicator */}
              <div 
                className={clsx(
                  'absolute top-1/2 -translate-y-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full border-2 border-white dark:border-gray-800 shadow-md z-10',
                  isDaytime ? 'bg-amber-500' : 'bg-indigo-500'
                )}
                style={{ left: `calc(${dayProgress}% - 4px)` }}
              />
            </div>
            <span className="w-8 sm:w-10 text-right">12pm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
