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
          <Combobox.Input
            className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Search timezones (e.g., Hartford, Tokyo, EST)..."
            onChange={(event) => setQuery(event.target.value)}
            autoFocus
          />
          {query && filteredTimezones.length > 0 && (
            <div className="absolute right-3 top-3 text-xs text-gray-500">
              {filteredTimezones.length} found
            </div>
          )}

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Combobox.Options className="absolute z-10 mt-2 w-full max-h-96 overflow-auto rounded-lg bg-white shadow-lg border border-gray-200 py-1">
              {query === '' && groupedTimezones.length > 0 && (
                <div className="px-4 py-2 text-xs font-medium text-gray-500">
                  Type to search timezones...
                </div>
              )}

              {filteredTimezones.length === 0 && query !== '' ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No timezones found for "{query}"
                </div>
              ) : (
                filteredTimezones.map((timezone) => (
                  <Combobox.Option
                    key={timezone.value}
                    value={timezone.value}
                    className={({ active }) =>
                      `cursor-pointer select-none px-4 py-3 ${
                        active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                      }`
                    }
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{timezone.label}</span>
                      <span className="text-sm text-gray-500">{timezone.offset}</span>
                    </div>
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
        className="mt-3 w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Cancel
      </button>
    </div>
  );
}
