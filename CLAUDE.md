# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Type-check with tsc, then build with Vite
npm run preview      # Preview production build locally
npm run lint         # Run ESLint on .ts and .tsx files
```

### Testing
```bash
npm test             # Run tests with Vitest
npm run test:watch   # Run tests in watch mode
```

## Architecture Overview

**Hafa Timezones** is a client-side React timezone converter with persistent state management. All timezone calculations use Luxon (never native Date objects).

### Core Technologies
- **React 18** + **TypeScript 5.3** (strict mode)
- **Vite** for build tooling
- **Luxon** for all timezone/date operations (IANA database)
- **Zustand** with persist middleware for state + localStorage
- **Tailwind CSS** for styling
- **Headless UI** for accessible Combobox component

### State Management (Zustand)

Single store at `src/store/timezoneStore.ts` with localStorage persistence:

```typescript
TimezoneState {
  sourceTime: string              // HH:mm format (24-hour)
  sourceTimezone: string          // IANA name (e.g., "America/New_York")
  activeTimezones: TimezoneInfo[] // Currently displayed zones
  savedSets: TimezoneSet[]        // User-saved timezone groups
  useMilitaryTime: boolean        // Display preference
}
```

**Important behaviors:**
- Auto-detects user's timezone on first load via `Intl.DateTimeFormat().resolvedOptions().timeZone`
- Prevents duplicate timezones in `activeTimezones`
- Persists to localStorage key: `"timezone-converter-storage"`
- Full timezone list is reorderable via `setActiveTimezones()` (drag-drop in UI)

### Type System

Core types in `src/types/timezone.types.ts`:

```typescript
TimezoneInfo {
  id: string              // Unique instance ID
  timezone: string        // IANA timezone name
  displayName: string     // Human-readable with abbreviation
  abbreviation: string    // e.g., "EST", "PST"
}

ConvertedTime {
  timezoneInfo: TimezoneInfo
  time: string            // Formatted time string
  date: string            // Full date string
  isDifferentDay: boolean // True if crossed date boundary
  iso: string             // ISO 8601 timestamp
  hoursDifference: number // Offset from source timezone
  isBusinessHours: boolean // 9am-5pm check
}
```

### Key Utilities

**`src/utils/timezoneUtils.ts`** - All timezone conversion logic:
- `convertTime()`: Single timezone conversion using Luxon
- `parseTime()`: Flexible parser for "3pm", "15:00", "3:30 PM", "now"
- `getTimezoneInfo()`: Get abbreviation and display name
- `getCurrentTimeInTimezone()`: Get current time in any zone
- `isValidTimezone()`: Validate against IANA database

**`src/utils/timezoneData.ts`** - Timezone database:
- `POPULAR_TIMEZONES[]`: 16 most-used zones (Guam first)
- `TIMEZONE_GROUPS[]`: 100+ zones organized by 5 regions
- `searchTimezones()`: Full-text search with fuzzy matching

**`src/utils/urlState.ts`** - URL sharing:
- `encodeStateToUrl()`: Create shareable link with query params
- `decodeStateFromUrl()`: Restore state from URL on load
- Format: `?t=15:30&tz=Pacific/Guam&zones=America/New_York,Europe/London`

### Component Architecture

**App.tsx** (~415 lines) - Root component manages:
- Modal visibility (TimezonePicker, SaveSetModal, MeetingTimeFinder)
- Drag-and-drop reordering (HTML5 drag API)
- Keyboard shortcuts (via custom hook)
- Timezone conversion orchestration (useMemo for performance)

**Key components:**
- `TimezoneInput`: Time entry + source timezone selection + quick actions
- `TimezonePicker`: Searchable modal for adding timezones (Headless UI Combobox)
- `TimezoneCard`: Display converted time with business hours indicator
- `SavedSetsPills`: Manage saved timezone sets
- `MeetingTimeFinder`: Find overlapping business hours across zones

### Advanced Features

**Keyboard Shortcuts** (`src/hooks/useKeyboardShortcuts.ts`):
- `Cmd/Ctrl + K`: Add timezone
- `Cmd/Ctrl + S`: Save current set
- `Cmd/Ctrl + L`: Copy share URL
- `N`: Set time to "now"
- `Esc`: Close modals

**Meeting Time Finder** (`src/components/MeetingTimeFinder.tsx`):
- Calculates overlapping business hours (default 9am-5pm, customizable)
- Shows continuous time windows where all zones overlap
- Displays corresponding time in each timezone for suggested windows

**Drag-and-Drop**:
- Native HTML5 drag API in App.tsx
- Reorder timezones by dragging cards
- Persists order to localStorage via Zustand

**URL State Sharing**:
- Automatically encode/decode app state in URL
- Share exact time conversion scenarios via link
- Hydrates on page load from query params

## Development Guidelines

### Time Parsing and Formatting
- **Always use Luxon** for date/time operations (never `new Date()` for calculations)
- Use `parseTime()` utility to handle user input
- Format times with `formatTime()` respecting `useMilitaryTime` preference
- Validate timezones with `isValidTimezone()` before adding to state

### TypeScript Strict Mode
- All files must pass `tsc` with no errors before build
- No unused variables/parameters (enforced by tsconfig)
- Explicit return types recommended for functions
- Check `src/types/timezone.types.ts` before modifying interfaces

### State Updates
- Access state via `useTimezoneStore()` hook
- Never mutate state directly - use provided actions
- For bulk updates, use `setActiveTimezones()` instead of multiple adds/removes
- State persists automatically to localStorage via middleware

### Styling
- Use Tailwind utility classes exclusively (no custom CSS files except index.css)
- Follow existing patterns for responsive design (mobile-first)
- Maintain consistent spacing with Tailwind's scale (p-4, gap-6, etc.)

### Adding New Features
1. Define types in `src/types/timezone.types.ts`
2. Add store actions in `src/store/timezoneStore.ts` if needed
3. Create component in `src/components/`
4. Import and integrate into `App.tsx`
5. Add utilities in `src/utils/` if logic is reusable

### Common Pitfalls
- **Don't mix Luxon and native Date**: All timezone math must use Luxon's DateTime
- **Don't add duplicate timezones**: Store already prevents this in `addTimezone()`
- **Don't assume times are today**: Always specify dates when converting historical/future times
- **Don't parse times manually**: Use `parseTime()` utility for consistency
- **Don't forget business hours**: `ConvertedTime` requires `isBusinessHours` property

## Testing

- Framework: Vitest with jsdom environment
- Setup file: `src/test/setup.ts`
- Run with: `npm test` or `npm run test:watch`
- Focus tests on utility functions (timezoneUtils.ts) and conversion logic
- Component tests should verify user interactions and state changes

## Build and Deployment

- Build command: `npm run build` (runs tsc check + Vite build)
- Output directory: `dist/`
- Netlify deployment: Configured to run `npm run build`
- Build fails on TypeScript errors (strict mode) or linting warnings
- No environment variables required (client-side only)

## Project Branding

- **Name**: Hafa Timezones (Chamorro-inspired, built in Guam)
- **Primary timezone**: Pacific/Guam (featured first in popular list)
- **Tone**: Clean, minimal, focused on functionality
- All UI text is in English with no i18n currently implemented
