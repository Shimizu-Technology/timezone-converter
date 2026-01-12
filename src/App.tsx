import { useState, useMemo } from 'react';
import { useTimezoneStore } from './store/timezoneStore';
import { convertTime } from './utils/timezoneUtils';
import TimezoneInput from './components/TimezoneInput';
import TimezoneCard from './components/TimezoneCard';
import TimezonePicker from './components/TimezonePicker';
import SavedSetsPills from './components/SavedSetsPills';
import SaveSetModal from './components/SaveSetModal';

function App() {
  const { sourceTime, sourceTimezone, activeTimezones, removeTimezone } = useTimezoneStore();
  const [showPicker, setShowPicker] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Convert source time to all active timezones
  const convertedTimezones = useMemo(() => {
    if (!sourceTime || activeTimezones.length === 0) {
      return [];
    }

    try {
      return activeTimezones.map((tz) =>
        convertTime(sourceTime, sourceTimezone, tz.timezone)
      );
    } catch (error) {
      console.error('Conversion error:', error);
      return [];
    }
  }, [sourceTime, sourceTimezone, activeTimezones]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Hafa Timezones
          </h1>
          <p className="text-gray-600">
            Convert time across timezones instantly
          </p>
        </div>

        {/* Main card */}
        <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
          {/* Time input */}
          <TimezoneInput />

          {/* Saved sets */}
          <SavedSetsPills onNewSet={() => setShowSaveModal(true)} />

          {/* Divider */}
          {activeTimezones.length > 0 && (
            <div className="border-t border-gray-200" />
          )}

          {/* Converted timezones */}
          {convertedTimezones.length > 0 ? (
            <div className="space-y-3">
              {convertedTimezones.map((converted) => (
                <TimezoneCard
                  key={converted.timezoneInfo.id}
                  convertedTime={converted}
                  onRemove={removeTimezone}
                />
              ))}
            </div>
          ) : activeTimezones.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No timezones added yet
              </h3>
              <p className="text-gray-600 mb-4">
                Add timezones to see time conversions
              </p>
              <button
                onClick={() => setShowPicker(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
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

          {/* Add timezone button (when timezones exist) */}
          {activeTimezones.length > 0 && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowPicker(true)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
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

              {activeTimezones.length >= 2 && (
                <button
                  onClick={() => setShowSaveModal(true)}
                  className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Save Set
                </button>
              )}
            </div>
          )}
        </div>

        {/* Timezone picker modal */}
        {showPicker && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-40 flex items-center justify-center p-4"
            onClick={() => setShowPicker(false)}
          >
            <div
              className="bg-white rounded-xl shadow-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Add Timezone
              </h2>
              <TimezonePicker onClose={() => setShowPicker(false)} />
            </div>
          </div>
        )}

        {/* Save set modal */}
        <SaveSetModal
          isOpen={showSaveModal}
          onClose={() => setShowSaveModal(false)}
        />

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 space-y-1">
          <p>
            Built in Guam 🌴 with React, TypeScript, and Luxon
          </p>
          <p className="text-xs">
            Accurate DST handling • 100+ timezones • Open source
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
