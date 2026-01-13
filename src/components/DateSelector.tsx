import { useState, useRef, useEffect } from 'react';
import { useTimezoneStore } from '../store/timezoneStore';

export default function DateSelector() {
  const { sourceDate, setSourceDate } = useTimezoneStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Get display text for current selection
  const getDisplayText = () => {
    if (!sourceDate) return 'Today';

    const selected = new Date(sourceDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    selected.setHours(0, 0, 0, 0);

    if (selected.getTime() === today.getTime()) return 'Today';
    if (selected.getTime() === tomorrow.getTime()) return 'Tomorrow';
    if (selected.getTime() === yesterday.getTime()) return 'Yesterday';

    // Format as "Mon, Jan 13"
    return selected.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleToday = () => {
    setSourceDate(null);
    setIsOpen(false);
  };

  const handleTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSourceDate(tomorrow.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const handleYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setSourceDate(yesterday.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const handleCustomDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setSourceDate(value);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-4 text-lg font-semibold bg-white text-gray-900 border-2 border-gray-200 rounded-xl hover:border-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition-all shadow-sm flex items-center justify-between"
        aria-label="Select date"
      >
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{getDisplayText()}</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <button
            onClick={handleToday}
            className={`w-full px-4 py-3 text-left text-base font-semibold hover:bg-gray-50 transition-colors ${
              !sourceDate ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
            }`}
          >
            Today
          </button>
          <button
            onClick={handleTomorrow}
            className="w-full px-4 py-3 text-left text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Tomorrow
          </button>
          <button
            onClick={handleYesterday}
            className="w-full px-4 py-3 text-left text-base font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
          >
            Yesterday
          </button>
          <div className="border-t-2 border-gray-200"></div>
          <label className="block px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
            <span className="block text-sm font-semibold text-gray-700 mb-2">Custom date</span>
            <input
              type="date"
              onChange={handleCustomDate}
              className="w-full px-3 py-2 text-base font-medium border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none cursor-pointer"
            />
          </label>
        </div>
      )}
    </div>
  );
}
