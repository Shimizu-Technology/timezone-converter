import { ConvertedTime } from '../types/timezone.types';
import clsx from 'clsx';

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
  const { timezoneInfo, time, date, isDifferentDay } = convertedTime;

  return (
    <div
      className={clsx(
        'relative p-4 rounded-lg border transition-all',
        isCurrent
          ? 'bg-blue-50 border-blue-300'
          : 'bg-white border-gray-200 hover:border-gray-300'
      )}
    >
      {/* Remove button */}
      <button
        onClick={() => onRemove(timezoneInfo.id)}
        className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
        aria-label="Remove timezone"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
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
      <div className="pr-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">🕐</span>
          <h3 className="text-lg font-semibold text-gray-900">
            {timezoneInfo.displayName}
          </h3>
        </div>

        {/* Time */}
        <div className="text-3xl font-bold text-gray-900 mb-1">{time}</div>

        {/* Date with day boundary indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>{date}</span>
          {isDifferentDay && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
              Next day
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
