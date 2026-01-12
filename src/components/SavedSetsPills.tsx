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
    event.stopPropagation(); // Prevent loading the set when deleting
    if (window.confirm('Are you sure you want to delete this saved set?')) {
      deleteSet(setId);
    }
  };

  if (savedSets.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">No saved sets yet.</span>
        <button
          onClick={onNewSet}
          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
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
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Saved Sets
      </label>

      <div className="flex flex-wrap gap-2">
        {savedSets.map((set) => (
          <button
            key={set.id}
            onClick={() => handleLoadSet(set.id)}
            className="group relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-all"
            onMouseEnter={() => setDeletingSetId(set.id)}
            onMouseLeave={() => setDeletingSetId(null)}
          >
            <span className="mr-2">{set.name}</span>
            <span className="text-xs text-gray-500">
              ({set.timezones.length})
            </span>

            {/* Delete button (appears on hover) */}
            <button
              onClick={(e) => handleDeleteSet(set.id, e)}
              className={`ml-2 p-0.5 text-gray-400 hover:text-red-600 transition-opacity ${
                deletingSetId === set.id ? 'opacity-100' : 'opacity-0'
              }`}
              aria-label="Delete set"
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
          </button>
        ))}

        {/* New set button */}
        <button
          onClick={onNewSet}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
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
