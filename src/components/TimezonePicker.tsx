import { Fragment, useState } from 'react';
import { Combobox, Transition } from '@headlessui/react';
import { searchTimezones, TIMEZONE_GROUPS } from '../utils/timezoneData';
import { getTimezoneInfo } from '../utils/timezoneUtils';
import { useTimezoneStore } from '../store/timezoneStore';

interface TimezonePickerProps {
  onClose: () => void;
}

export default function TimezonePicker({ onClose }: TimezonePickerProps) {
  const [query, setQuery] = useState('');
  const { addTimezone, activeTimezones } = useTimezoneStore();

  // Get filtered timezones based on search query
  const filteredTimezones = query === ''
    ? []
    : searchTimezones(query);

  // Get all timezones grouped by region (for when no search query)
  const groupedTimezones = query === '' ? TIMEZONE_GROUPS : [];

  const handleSelect = (timezoneValue: string | null) => {
    if (!timezoneValue) return;

    // Check if timezone is already added
    const exists = activeTimezones.some(tz => tz.timezone === timezoneValue);

    if (!exists) {
      const tzInfo = getTimezoneInfo(timezoneValue);
      addTimezone(tzInfo);
    }

    onClose();
  };

  return (
    <div className="w-full max-w-md">
      <Combobox onChange={handleSelect}>
        <div className="relative">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Combobox.Input
              className="w-full pl-12 pr-4 py-3.5 text-base font-medium rounded-xl outline-none transition-all shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-ocean-400 focus:border-ocean-400 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Search cities, countries, or timezones..."
              onChange={(event) => setQuery(event.target.value)}
              autoFocus
            />
          </div>
          {query && filteredTimezones.length > 0 && (
            <div className="absolute right-4 top-3.5 text-xs font-medium px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
              {filteredTimezones.length} found
            </div>
          )}

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute z-10 mt-2 w-full max-h-80 overflow-auto rounded-xl shadow-xl py-1 bg-white dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600">
              {query === '' && groupedTimezones.length > 0 && (
                <div className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Type to search timezones...
                </div>
              )}

              {filteredTimezones.length === 0 && query !== '' ? (
                <div className="px-4 py-6 text-center">
                  <div className="text-3xl mb-2">🔍</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No timezones found for "{query}"
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Try searching for a city or country
                  </p>
                </div>
              ) : (
                filteredTimezones.map((timezone, index) => (
                  <Combobox.Option
                    key={timezone.value}
                    value={timezone.value}
                    className={({ active }) =>
                      `cursor-pointer select-none px-4 py-3 transition-colors ${
                        active ? 'bg-ocean-50 dark:bg-ocean-900/30' : ''
                      }`
                    }
                  >
                    {({ active }) => (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                            active ? 'bg-ocean-100 dark:bg-ocean-800' : 'bg-gray-100 dark:bg-gray-600'
                          }`}>
                            🌍
                          </div>
                          <span className="font-semibold text-gray-900 dark:text-white">{timezone.label}</span>
                        </div>
                        <span className={`text-sm font-mono px-2 py-1 rounded ${
                          active 
                            ? 'bg-ocean-100 dark:bg-ocean-800 text-ocean-700 dark:text-ocean-300' 
                            : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                        }`}>
                          {timezone.offset}
                        </span>
                      </div>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>

      {/* Cancel button */}
      <button
        onClick={onClose}
        className="mt-4 w-full btn-secondary py-3"
      >
        Cancel
      </button>
    </div>
  );
}
