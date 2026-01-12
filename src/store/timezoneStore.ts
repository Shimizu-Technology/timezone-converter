import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TimezoneInfo, TimezoneSet } from '../types/timezone.types';

interface TimezoneState {
  // Current conversion state
  sourceTime: string;
  sourceTimezone: string;
  activeTimezones: TimezoneInfo[];

  // Saved sets
  savedSets: TimezoneSet[];

  // Actions for source time/timezone
  setSourceTime: (time: string) => void;
  setSourceTimezone: (timezone: string) => void;

  // Actions for active timezones
  addTimezone: (timezone: TimezoneInfo) => void;
  removeTimezone: (id: string) => void;
  clearActiveTimezones: () => void;
  setActiveTimezones: (timezones: TimezoneInfo[]) => void;

  // Actions for saved sets
  saveSet: (name: string) => void;
  loadSet: (setId: string) => void;
  deleteSet: (setId: string) => void;
  renameSet: (setId: string, newName: string) => void;
}

// Initial state
const initialState = {
  sourceTime: '12:00',
  sourceTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York',
  activeTimezones: [],
  savedSets: []
};

export const useTimezoneStore = create<TimezoneState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Set source time
      setSourceTime: (time: string) =>
        set({ sourceTime: time }),

      // Set source timezone
      setSourceTimezone: (timezone: string) =>
        set({ sourceTimezone: timezone }),

      // Add a new timezone to active timezones
      addTimezone: (timezone: TimezoneInfo) =>
        set((state) => {
          // Check if timezone already exists
          const exists = state.activeTimezones.some(
            (tz) => tz.timezone === timezone.timezone
          );

          if (exists) {
            return state; // Don't add duplicates
          }

          return {
            activeTimezones: [...state.activeTimezones, timezone]
          };
        }),

      // Remove a timezone from active timezones
      removeTimezone: (id: string) =>
        set((state) => ({
          activeTimezones: state.activeTimezones.filter((tz) => tz.id !== id)
        })),

      // Clear all active timezones
      clearActiveTimezones: () =>
        set({ activeTimezones: [] }),

      // Set active timezones (replace all)
      setActiveTimezones: (timezones: TimezoneInfo[]) =>
        set({ activeTimezones: timezones }),

      // Save current active timezones as a set
      saveSet: (name: string) => {
        const state = get();
        const newSet: TimezoneSet = {
          id: `set-${Date.now()}`,
          name,
          timezones: state.activeTimezones,
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          savedSets: [...state.savedSets, newSet]
        }));
      },

      // Load a saved set (replace active timezones)
      loadSet: (setId: string) => {
        const state = get();
        const savedSet = state.savedSets.find((set) => set.id === setId);

        if (savedSet) {
          set({ activeTimezones: [...savedSet.timezones] });
        }
      },

      // Delete a saved set
      deleteSet: (setId: string) =>
        set((state) => ({
          savedSets: state.savedSets.filter((set) => set.id !== setId)
        })),

      // Rename a saved set
      renameSet: (setId: string, newName: string) =>
        set((state) => ({
          savedSets: state.savedSets.map((set) =>
            set.id === setId ? { ...set, name: newName } : set
          )
        }))
    }),
    {
      name: 'timezone-converter-storage', // LocalStorage key
      version: 1,
      // Only persist certain fields
      partialize: (state) => ({
        sourceTime: state.sourceTime,
        sourceTimezone: state.sourceTimezone,
        activeTimezones: state.activeTimezones,
        savedSets: state.savedSets
      })
    }
  )
);
