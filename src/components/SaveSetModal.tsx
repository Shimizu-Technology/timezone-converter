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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-night-800 p-6 shadow-2xl border border-sand-200 dark:border-night-600 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center shadow-glow-coral">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="font-display text-xl font-bold text-[var(--color-text-primary)]"
                    >
                      Save Timezone Set
                    </Dialog.Title>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      Quick access to your favorite timezones
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  {/* Set name input */}
                  <div>
                    <label
                      htmlFor="setName"
                      className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2"
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
                      placeholder="e.g., Work Team, Family, Clients"
                      className="w-full px-4 py-3 text-base font-medium border-2 border-sand-200 dark:border-night-600 rounded-xl focus:ring-2 focus:ring-coral-400 focus:border-coral-400 outline-none transition-all shadow-sm bg-white dark:bg-night-700 text-[var(--color-text-primary)]"
                      autoFocus
                    />
                    {error && (
                      <p className="mt-2 text-sm text-coral-600 dark:text-coral-400 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </p>
                    )}
                  </div>

                  {/* Preview of timezones */}
                  <div>
                    <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
                      Timezones in this set
                      <span className="ml-2 px-2 py-0.5 rounded-full bg-ocean-100 dark:bg-ocean-900/30 text-ocean-700 dark:text-ocean-300 text-xs">
                        {activeTimezones.length}
                      </span>
                    </label>
                    <div className="max-h-40 overflow-y-auto rounded-xl border-2 border-sand-100 dark:border-night-600 bg-sand-50 dark:bg-night-700 p-3">
                      {activeTimezones.length === 0 ? (
                        <p className="text-sm text-[var(--color-text-muted)] text-center py-2">
                          No timezones added yet
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {activeTimezones.map((tz, index) => (
                            <li
                              key={tz.id}
                              className="flex items-center gap-2 text-sm text-[var(--color-text-primary)]"
                            >
                              <span className="w-6 h-6 rounded-lg bg-ocean-100 dark:bg-ocean-900/30 flex items-center justify-center text-xs font-semibold text-ocean-700 dark:text-ocean-300">
                                {index + 1}
                              </span>
                              {tz.displayName}
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
                      className="flex-1 btn-secondary py-3"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 btn-coral py-3"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
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
