import { useState, useMemo, useEffect } from 'react';
import { useTimezoneStore } from './store/timezoneStore';
import { convertTime, getTimezoneInfo } from './utils/timezoneUtils';
import { decodeStateFromUrl, encodeStateToUrl, copyToClipboard } from './utils/urlState';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import TimezoneInput from './components/TimezoneInput';
import TimezoneCard from './components/TimezoneCard';
import TimezonePicker from './components/TimezonePicker';
import SavedSetsPills from './components/SavedSetsPills';
import SaveSetModal from './components/SaveSetModal';
import MeetingTimeFinder from './components/MeetingTimeFinder';

function App() {
  const { sourceTime, sourceTimezone, sourceDate, activeTimezones, removeTimezone, useMilitaryTime, toggleMilitaryTime, setSourceTime, setSourceTimezone, setSourceDate, addTimezone, setActiveTimezones, savedSets } = useTimezoneStore();
  const [showPicker, setShowPicker] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showMeetingFinder, setShowMeetingFinder] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
  }, []); // Only run once on mount

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

  // Handle close modal (for keyboard shortcut)
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

    // Remove from old position
    newTimezones.splice(draggedIndex, 1);
    // Insert at new position
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

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto p-3 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
              Hafa Timezones 🌏
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Convert time across timezones instantly
            </p>
          </div>

          {/* Military time toggle */}
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
            <span className="text-sm font-medium text-gray-700">
              {useMilitaryTime ? '24hr' : '12hr'}
            </span>
            <button
              onClick={toggleMilitaryTime}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                useMilitaryTime ? 'bg-blue-500' : 'bg-gray-300'
              }`}
              aria-label="Toggle time format"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                  useMilitaryTime ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Time Input Card */}
        <div className="bg-blue-50 rounded-2xl shadow-lg border border-blue-100 p-5 sm:p-6 mb-4">
          <TimezoneInput />
        </div>

        {/* Saved Sets Card */}
        {(savedSets.length > 0 || activeTimezones.length >= 2) && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 mb-4">
            <SavedSetsPills onNewSet={() => setShowSaveModal(true)} />
          </div>
        )}

        {/* Converted Timezones Section */}
        {convertedTimezones.length > 0 ? (
          <div className="space-y-3">
            {convertedTimezones.map((converted, index) => (
              <div
                key={converted.timezoneInfo.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`cursor-grab active:cursor-grabbing transition-opacity ${
                  draggedIndex === index ? 'opacity-60' : ''
                }`}
              >
                <TimezoneCard
                  convertedTime={converted}
                  onRemove={removeTimezone}
                />
              </div>
            ))}
          </div>
        ) : activeTimezones.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12 text-center">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No timezones added yet
            </h3>
            <p className="text-gray-600 mb-6">
              Add timezones to see time conversions
            </p>
            <button
              onClick={() => setShowPicker(true)}
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
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
        ) : null}

        {/* Action Buttons */}
        {activeTimezones.length > 0 && (
          <div className="mt-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-5">
            <div className="grid grid-cols-2 sm:flex gap-2 sm:gap-3">
              <button
                onClick={() => setShowPicker(true)}
                className="col-span-2 sm:flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
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

              <button
                onClick={handleCopyUrl}
                className="px-4 py-3 text-sm font-medium bg-gray-100 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all inline-flex items-center justify-center"
              >
                {copySuccess ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:mr-2 text-green-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-green-600 font-medium hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 sm:mr-2 text-gray-700"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    <span className="text-gray-700 hidden sm:inline">Share</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setShowMeetingFinder(true)}
                className="px-4 py-3 text-sm font-medium text-white bg-purple-600 rounded-xl hover:bg-purple-700 shadow-md hover:shadow-lg transition-all inline-flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="hidden sm:inline">Find Meeting Time</span>
              </button>

              {activeTimezones.length >= 2 && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="px-4 py-3 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:border-amber-300 hover:bg-amber-100 hover:shadow-md transition-all"
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
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={() => setShowPicker(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
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
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 flex items-center justify-center p-4"
            onClick={() => setShowMeetingFinder(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Meeting Time Finder
                  </h2>
                </div>
                <button
                  onClick={() => setShowMeetingFinder(false)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
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
        <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500 space-y-1 sm:space-y-2">
          <p>
            Built in Guam 🌴 with React, TypeScript, and Luxon
          </p>
          <p className="text-xs">
            Accurate DST handling • 100+ timezones • Open source
          </p>
          <details className="text-xs">
            <summary className="cursor-pointer hover:text-gray-700 inline-flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">⌘K</kbd>
              Keyboard shortcuts
            </summary>
            <div className="mt-2 space-y-1 text-left inline-block">
              <div><kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">⌘K</kbd> Add timezone</div>
              <div><kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">⌘S</kbd> Save set</div>
              <div><kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">⌘L</kbd> Copy share URL</div>
              <div><kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">N</kbd> Set time to now</div>
              <div><kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Esc</kbd> Close modal</div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

export default App;
