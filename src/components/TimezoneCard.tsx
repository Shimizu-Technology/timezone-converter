import { ConvertedTime } from '../types/timezone.types';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

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
  const { timezoneInfo, time, date, isDifferentDay, hoursDifference, isBusinessHours } = convertedTime;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatHoursDifference = (hours: number) => {
    if (hours === 0) return 'Same time';
    const sign = hours > 0 ? '+' : '';
    return `${sign}${hours}h`;
  };

  const getBusinessHoursStatus = () => {
    if (isBusinessHours) return { color: 'bg-green-500', label: 'Business hours' };
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM');
    const hour24 = isPM && hour !== 12 ? hour + 12 : !isPM && hour === 12 ? 0 : hour;

    if (hour24 >= 17 && hour24 < 21) return { color: 'bg-yellow-500', label: 'Evening' };
    return { color: 'bg-gray-400', label: 'After hours' };
  };

  const businessStatus = getBusinessHoursStatus();

  return (
    <div
      className={clsx(
        'relative p-5 sm:p-6 rounded-2xl border-2 transition-all duration-300 ease-out shadow-lg hover:shadow-xl',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        isCurrent
          ? 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200'
          : 'bg-white border-gray-150 hover:border-gray-250'
      )}
    >
      {/* Remove button */}
      <button
        onClick={() => onRemove(timezoneInfo.id)}
        className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
        aria-label="Remove timezone"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Timezone info */}
      <div className="pr-10">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-xl">
            🕐
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900">
              {timezoneInfo.displayName}
            </h3>
            {/* Business hours indicator */}
            <div className="flex items-center gap-2 mt-0.5">
              <div className="flex items-center gap-1.5">
                <div className={clsx('w-2.5 h-2.5 rounded-full shadow-sm', businessStatus.color)} title={businessStatus.label} />
                <span className="text-xs font-medium text-gray-600">{businessStatus.label}</span>
              </div>
              <span className="text-xs font-semibold text-gray-500">• {formatHoursDifference(hoursDifference)}</span>
            </div>
          </div>
        </div>

        {/* Time */}
        <div className="text-4xl font-bold text-gray-900 mb-2">{time}</div>

        {/* Date with day boundary indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">{date}</span>
          {isDifferentDay && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              Next day
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
