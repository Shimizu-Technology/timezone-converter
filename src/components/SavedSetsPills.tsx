import { useTimezoneStore } from '../store/timezoneStore';
import { useState } from 'react';

interface SavedSetsPillsProps {
  onNewSet: () => void;
}

export default function SavedSetsPills({ onNewSet }: SavedSetsPillsProps) {
  const { savedSets, loadSet, deleteSet } = useTimezoneStore();
  const [deletingSetId, setDeletingSetId] = useState<string | null>(null);

  const handleLoadSet = (setId: string) => {
    loadSet(setId);
  };

  const handleDeleteSet = (setId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this saved set?')) {
      deleteSet(setId);
    }
  };

  if (savedSets.length === 0) {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-lg">📁</span>
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--card-text-secondary)' }}>No saved sets yet</span>
        </div>
        <button
          onClick={onNewSet}
          className="inline-flex items-center px-4 py-2.5 text-sm font-bold rounded-xl transition-all text-white shadow-md hover:shadow-lg"
          style={{ backgroundColor: '#0d9488' }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Create First Set
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-coral-100 dark:bg-coral-900/40 flex items-center justify-center">
          <span className="text-lg">📁</span>
        </div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
          Saved Sets
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        {savedSets.map((set) => (
          <div
            key={set.id}
            className="group relative inline-flex items-center transition-all"
            onMouseEnter={() => setDeletingSetId(set.id)}
            onMouseLeave={() => setDeletingSetId(null)}
          >
            <button
              onClick={() => handleLoadSet(set.id)}
              className="inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-600 hover:border-ocean-400 dark:hover:border-ocean-500 hover:shadow-md"
            >
              <span className="mr-2">{set.name}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                {set.timezones.length}
              </span>
            </button>

            {/* Delete button (appears on hover) */}
            <button
              onClick={(e) => handleDeleteSet(set.id, e)}
              className={`absolute -right-2 -top-2 p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-all ${
                deletingSetId === set.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
              aria-label="Delete set"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3"
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
          </div>
        ))}

        {/* New set button */}
        <button
          onClick={onNewSet}
          className="inline-flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all bg-ocean-50 dark:bg-ocean-900/40 text-ocean-700 dark:text-ocean-200 border-2 border-ocean-200 dark:border-ocean-700 border-dashed hover:bg-ocean-100 dark:hover:bg-ocean-800/60 hover:border-solid"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          New Set
        </button>
      </div>
    </div>
  );
}
