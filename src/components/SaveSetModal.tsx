import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useTimezoneStore } from '../store/timezoneStore';

interface SaveSetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SaveSetModal({ isOpen, onClose }: SaveSetModalProps) {
  const { activeTimezones, saveSet } = useTimezoneStore();
  const [setName, setSetName] = useState('');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!setName.trim()) {
      setError('Please enter a name for this set');
      return;
    }

    if (activeTimezones.length === 0) {
      setError('Add at least one timezone before saving');
      return;
    }

    saveSet(setName.trim());
    setSetName('');
    setError('');
    onClose();
  };

  const handleClose = () => {
    setSetName('');
    setError('');
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold text-gray-900 mb-4"
                >
                  Save Timezone Set
                </Dialog.Title>

                <div className="space-y-4">
                  {/* Set name input */}
                  <div>
                    <label
                      htmlFor="setName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Set Name
                    </label>
                    <input
                      type="text"
                      id="setName"
                      value={setName}
                      onChange={(e) => {
                        setSetName(e.target.value);
                        setError('');
                      }}
                      placeholder="e.g., Work Team, Family"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      autoFocus
                    />
                    {error && (
                      <p className="mt-1 text-sm text-red-600">{error}</p>
                    )}
                  </div>

                  {/* Preview of timezones */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timezones in this set ({activeTimezones.length})
                    </label>
                    <div className="max-h-40 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
                      {activeTimezones.length === 0 ? (
                        <p className="text-sm text-gray-500">
                          No timezones added yet
                        </p>
                      ) : (
                        <ul className="space-y-1">
                          {activeTimezones.map((tz) => (
                            <li
                              key={tz.id}
                              className="text-sm text-gray-700"
                            >
                              • {tz.displayName}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleClose}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Set
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
