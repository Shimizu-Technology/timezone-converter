import { useState, useMemo, useEffect } from 'react';
import { useTimezoneStore } from './store/timezoneStore';
import { useThemeStore, applyTheme } from './store/themeStore';
import { convertTime, getTimezoneInfo } from './utils/timezoneUtils';
import { decodeStateFromUrl, encodeStateToUrl, copyToClipboard } from './utils/urlState';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import TimezoneInput from './components/TimezoneInput';
import TimezoneCard from './components/TimezoneCard';
import TimezonePicker from './components/TimezonePicker';
import SavedSetsPills from './components/SavedSetsPills';
import SaveSetModal from './components/SaveSetModal';
import MeetingTimeFinder from './components/MeetingTimeFinder';
import WaveLogo from './components/WaveLogo';
import TimeOfDayLegend from './components/TimeOfDayLegend';

function App() {
  const { sourceTime, sourceTimezone, sourceDate, activeTimezones, removeTimezone, useMilitaryTime, toggleMilitaryTime, setSourceTime, setSourceTimezone, setSourceDate, addTimezone, setActiveTimezones, savedSets } = useTimezoneStore();
  const { theme, toggleTheme } = useThemeStore();
  const [showPicker, setShowPicker] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showMeetingFinder, setShowMeetingFinder] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Restore state from URL on mount
  useEffect(() => {
    const urlState = decodeStateFromUrl();

    if (urlState.sourceTime) {
      setSourceTime(urlState.sourceTime);
    }

    if (urlState.sourceTimezone) {
      setSourceTimezone(urlState.sourceTimezone);
    }

    if (urlState.sourceDate) {
      setSourceDate(urlState.sourceDate);
    }

    if (urlState.timezones.length > 0) {
      urlState.timezones.forEach(tz => {
        addTimezone(getTimezoneInfo(tz));
      });
    }
  }, []);

  // Handle share/copy URL
  const handleCopyUrl = async () => {
    const url = encodeStateToUrl(sourceTime, sourceTimezone, activeTimezones, sourceDate);
    const success = await copyToClipboard(url);

    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Handle set time to now
  const handleSetNow = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    setSourceTime(timeString);
  };

  // Handle close modal
  const handleCloseModal = () => {
    if (showPicker) setShowPicker(false);
    if (showSaveModal) setShowSaveModal(false);
    if (showMeetingFinder) setShowMeetingFinder(false);
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newTimezones = [...activeTimezones];
    const draggedItem = newTimezones[draggedIndex];
    newTimezones.splice(draggedIndex, 1);
    newTimezones.splice(index, 0, draggedItem);

    setActiveTimezones(newTimezones);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onAddTimezone: () => setShowPicker(true),
    onSaveSet: activeTimezones.length >= 2 ? () => setShowSaveModal(true) : undefined,
    onCopyUrl: activeTimezones.length > 0 ? handleCopyUrl : undefined,
    onSetNow: handleSetNow,
    onCloseModal: handleCloseModal
  });

  // Convert source time to all active timezones
  const convertedTimezones = useMemo(() => {
    if (!sourceTime || activeTimezones.length === 0) {
      return [];
    }

    try {
      return activeTimezones.map((tz) =>
        convertTime(sourceTime, sourceTimezone, tz.timezone, sourceDate || undefined, useMilitaryTime)
      );
    } catch (error) {
      console.error('Conversion error:', error);
      return [];
    }
  }, [sourceTime, sourceTimezone, sourceDate, activeTimezones, useMilitaryTime]);

  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="app-container transition-colors duration-300">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header - compact single row on mobile */}
        <header className="mb-4 sm:mb-8 animate-fade-in">
          <div className="flex items-center justify-between gap-2 sm:gap-6">
            {/* Logo and title */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <WaveLogo size={56} className="hidden sm:flex flex-shrink-0" />
              <WaveLogo size={36} className="flex sm:hidden flex-shrink-0" />
              <div className="min-w-0">
                <h1 
                  className="font-display text-lg sm:text-4xl lg:text-5xl font-bold tracking-tight"
                  style={{
                    background: 'linear-gradient(to right, #0d9488, #14b8a6, #06b6d4)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Hafa Timezones
                </h1>
                <p className="hidden sm:block text-[var(--color-text-muted)] font-body text-xs sm:text-sm mt-0.5">
                  Convert time instantly • Built in Guam 🌴
                </p>
              </div>
            </div>

            {/* Theme and format toggles - always on same row */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              {/* Time format toggle */}
              <div className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl shadow-sm" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '1px', borderStyle: 'solid' }}>
                <span className="text-[10px] sm:text-sm font-bold" style={{ color: 'var(--card-text-primary)' }}>
                  {useMilitaryTime ? '24hr' : '12hr'}
                </span>
                <button
                  onClick={toggleMilitaryTime}
                  className="relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-400 focus:ring-offset-2"
                  style={{ backgroundColor: useMilitaryTime ? '#0d9488' : '#9ca3af' }}
                  aria-label="Toggle time format"
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 sm:h-4 sm:w-4 transform rounded-full bg-white shadow-md transition-transform ${
                      useMilitaryTime ? 'translate-x-4 sm:translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 sm:p-3 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] flex items-center justify-center"
                style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '1px', borderStyle: 'solid' }}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Time Input Card - compact on mobile */}
        <div className="relative z-20 rounded-xl sm:rounded-2xl p-3 sm:p-6 mb-3 sm:mb-4 animate-fade-in-up shadow-md" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '1px', borderStyle: 'solid' }}>
          <TimezoneInput />
        </div>

        {/* Saved Sets Card - compact on mobile */}
        {(savedSets.length > 0 || activeTimezones.length >= 2) && (
          <div className="relative z-10 rounded-xl sm:rounded-2xl p-3 sm:p-6 mb-3 sm:mb-4 animate-fade-in-up shadow-md" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '1px', borderStyle: 'solid' }}>
            <SavedSetsPills onNewSet={() => setShowSaveModal(true)} />
          </div>
        )}

        {/* Converted Timezones Section */}
        {convertedTimezones.length > 0 ? (
          <div className="relative z-0 space-y-3">
            {convertedTimezones.map((converted, index) => (
              <div
                key={converted.timezoneInfo.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`cursor-grab active:cursor-grabbing transition-all ${
                  draggedIndex === index ? 'opacity-60 scale-[0.98]' : ''
                } animate-fade-in-up`}
                style={{ animationDelay: `${(index + 1) * 0.05}s` }}
              >
                <TimezoneCard
                  convertedTime={converted}
                  onRemove={removeTimezone}
                />
              </div>
            ))}
            
            {/* Time of Day Legend */}
            <div className="mt-4 pt-3 border-t" style={{ borderColor: 'var(--card-border)' }}>
              <TimeOfDayLegend />
            </div>
          </div>
        ) : activeTimezones.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl p-8 sm:p-12 text-center animate-fade-in-up relative overflow-hidden shadow-md" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '1px', borderStyle: 'solid' }}>
            {/* Decorative background */}
            <div className="absolute inset-0 bg-gradient-to-br from-ocean-50/30 to-coral-50/30 dark:from-ocean-900/20 dark:to-coral-900/20" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-ocean-200/20 dark:bg-ocean-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-coral-200/20 dark:bg-coral-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10">
              {/* Animated illustration */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 flex items-center justify-center text-7xl animate-float">
                  🌏
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full border-4 border-dashed border-ocean-300 dark:border-ocean-600 animate-spin" style={{ animationDuration: '20s' }} />
                </div>
              </div>
              
              <h3 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Start Your Time Journey
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Add timezones to see instant conversions. Perfect for coordinating with teams across the globe.
              </p>

              {/* Quick add suggestions */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <span className="text-xs text-gray-500 dark:text-gray-400">Popular:</span>
                {['America/New_York', 'Europe/London', 'Asia/Tokyo'].map((tz) => (
                  <button
                    key={tz}
                    onClick={() => addTimezone(getTimezoneInfo(tz))}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-ocean-100 dark:hover:bg-ocean-900/50 hover:text-ocean-700 dark:hover:text-ocean-300 transition-all"
                  >
                    {tz.split('/')[1].replace('_', ' ')}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowPicker(true)}
                className="btn-primary py-3 px-8 text-base"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Your First Timezone
              </button>
            </div>
          </div>
        ) : null}

        {/* Action Buttons */}
        {activeTimezones.length > 0 && (
          <div className="mt-4 rounded-2xl p-3 sm:p-5 animate-fade-in-up shadow-md" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '1px', borderStyle: 'solid' }}>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => setShowPicker(true)}
                className="flex-1 btn-primary py-3.5 sm:py-3 text-sm sm:text-base active:scale-[0.98]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Timezone
              </button>

              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={handleCopyUrl}
                  className="flex-1 btn-secondary py-3.5 sm:py-3 text-sm sm:text-base active:scale-[0.98]"
                >
                  {copySuccess ? (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2 text-ocean-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-ocean-600 dark:text-ocean-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      Share
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowMeetingFinder(true)}
                  className="flex-1 btn-coral py-3.5 sm:py-3 text-sm sm:text-base active:scale-[0.98]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="hidden xs:inline">Find </span>Meeting
                </button>
              </div>

              {activeTimezones.length >= 2 && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="px-4 py-3 text-sm font-semibold text-coral-700 dark:text-coral-300 bg-coral-50 dark:bg-coral-900/30 border border-coral-200 dark:border-coral-700 rounded-xl hover:bg-coral-100 dark:hover:bg-coral-900/50 hover:shadow-md transition-all"
                >
                  Save Set
                </button>
              )}
            </div>
          </div>
        )}

        {/* Timezone picker modal */}
        {showPicker && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowPicker(false)}
          >
            <div
              className="rounded-2xl shadow-2xl p-6 max-w-md w-full animate-scale-in"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '1px', borderStyle: 'solid' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ocean-500 to-ocean-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                  Add Timezone
                </h2>
              </div>
              <TimezonePicker onClose={() => setShowPicker(false)} />
            </div>
          </div>
        )}

        {/* Save set modal */}
        <SaveSetModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
        />

        {/* Meeting Time Finder modal */}
        {showMeetingFinder && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setShowMeetingFinder(false)}
          >
            <div
              className="rounded-2xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
              style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '1px', borderStyle: 'solid' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white">
                    Meeting Time Finder
                  </h2>
                </div>
                <button
                  onClick={() => setShowMeetingFinder(false)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <MeetingTimeFinder
                sourceTimezone={sourceTimezone}
                targetTimezones={activeTimezones}
                useMilitaryTime={useMilitaryTime}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 sm:mt-12 text-center animate-fade-in">
          <div className="rounded-2xl p-6 inline-block shadow-md" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--card-border)', borderWidth: '1px', borderStyle: 'solid' }}>
            <p className="font-semibold mb-2" style={{ color: 'var(--card-text-primary)' }}>
              Built with 💚 in Guam 🌴
            </p>
            <p className="text-sm mb-4" style={{ color: 'var(--card-text-secondary)' }}>
              React • TypeScript • Luxon • Accurate DST handling
            </p>
            <details style={{ color: 'var(--card-text-secondary)' }}>
              <summary className="cursor-pointer hover:text-ocean-600 dark:hover:text-ocean-400 inline-flex items-center gap-2 text-xs">
                <kbd className="px-2 py-1 rounded text-xs font-mono font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600">⌘K</kbd>
                Keyboard shortcuts
              </summary>
              <div className="mt-3 space-y-2 text-left inline-block text-sm" style={{ color: 'var(--card-text-secondary)' }}>
                <div className="flex items-center gap-3">
                  <kbd className="px-2 py-1 rounded text-xs font-mono font-semibold min-w-[3rem] text-center bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600">⌘K</kbd>
                  <span>Add timezone</span>
                </div>
                <div className="flex items-center gap-3">
                  <kbd className="px-2 py-1 rounded text-xs font-mono font-semibold min-w-[3rem] text-center bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600">⌘S</kbd>
                  <span>Save set</span>
                </div>
                <div className="flex items-center gap-3">
                  <kbd className="px-2 py-1 rounded text-xs font-mono font-semibold min-w-[3rem] text-center bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600">⌘L</kbd>
                  <span>Copy share URL</span>
                </div>
                <div className="flex items-center gap-3">
                  <kbd className="px-2 py-1 rounded text-xs font-mono font-semibold min-w-[3rem] text-center bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600">N</kbd>
                  <span>Set time to now</span>
                </div>
                <div className="flex items-center gap-3">
                  <kbd className="px-2 py-1 rounded text-xs font-mono font-semibold min-w-[3rem] text-center bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600">Esc</kbd>
                  <span>Close modal</span>
                </div>
              </div>
            </details>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
