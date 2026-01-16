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
    if (selected.getTime() === tomorrow.getTime()) return 'Tmrw';
    if (selected.getTime() === yesterday.getTime()) return 'Yest';

    return selected.toLocaleDateString('en-US', {
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
        className="w-full h-12 sm:h-14 px-3 sm:px-4 text-sm sm:text-base font-display font-semibold rounded-xl outline-none transition-all shadow-sm flex items-center justify-between border-2 hover:border-ocean-400 focus:ring-2 focus:ring-ocean-400 focus:border-ocean-400 active:scale-[0.98]"
        style={{ backgroundColor: 'var(--card-bg)', color: 'var(--card-text-primary)', borderColor: 'var(--card-border)' }}
        aria-label="Select date"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base">📅</span>
          <span className="truncate">{getDisplayText()}</span>
        </div>
        <svg
          className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: 'var(--card-text-muted)' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-xl z-[9999] overflow-hidden border-2 animate-scale-in"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
        >
          <button
            onClick={handleToday}
            className={`w-full px-4 py-3.5 text-left text-base font-semibold transition-colors flex items-center gap-3 active:scale-[0.98] ${
              !sourceDate 
                ? 'bg-ocean-50 dark:bg-ocean-900/30 text-ocean-700 dark:text-ocean-300' 
                : ''
            }`}
            style={sourceDate ? { color: 'var(--card-text-primary)' } : undefined}
          >
            <span className="text-lg">📅</span>
            Today
          </button>
          <button
            onClick={handleTomorrow}
            className="w-full px-4 py-3.5 text-left text-base font-semibold transition-colors flex items-center gap-3 active:scale-[0.98]"
            style={{ color: 'var(--card-text-primary)' }}
          >
            <span className="text-lg">📆</span>
            Tomorrow
          </button>
          <button
            onClick={handleYesterday}
            className="w-full px-4 py-3.5 text-left text-base font-semibold transition-colors flex items-center gap-3 active:scale-[0.98]"
            style={{ color: 'var(--card-text-primary)' }}
          >
            <span className="text-lg">🗓️</span>
            Yesterday
          </button>
          <div style={{ borderTopWidth: '1px', borderTopColor: 'var(--card-border)' }} />
          <label className="block px-4 py-3 transition-colors cursor-pointer">
            <span className="block text-sm font-semibold mb-2" style={{ color: 'var(--card-text-muted)' }}>Custom date</span>
            <input
              type="date"
              onChange={handleCustomDate}
              className="w-full px-3 py-2.5 text-base font-medium rounded-lg focus:ring-2 focus:ring-ocean-400 focus:border-ocean-400 outline-none cursor-pointer border"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--card-text-primary)', borderColor: 'var(--card-border)' }}
            />
          </label>
        </div>
      )}
    </div>
  );
}
