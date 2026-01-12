# Timezone Converter

A modern, clean timezone converter built with React, TypeScript, and Luxon. Convert time across multiple timezones instantly with saved timezone sets for quick access.

![Timezone Converter](https://via.placeholder.com/800x400?text=Timezone+Converter+Screenshot)

## Features

- **Instant Conversion**: Convert time across multiple timezones in real-time
- **Natural Language Input**: Enter times as "3pm", "15:00", "3:30 PM", or "now"
- **Saved Timezone Sets**: Save frequently used timezone combinations for one-click access
- **Clean UI**: Minimalist design with generous whitespace and clear hierarchy
- **Day Boundary Indicators**: Clearly shows when date changes during conversion
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- **Local Storage**: All data persists locally in your browser

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Timezone Library**: Luxon (IANA timezone database)
- **State Management**: Zustand with localStorage persistence
- **UI Components**: Headless UI
- **Testing**: Vitest + React Testing Library

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/timezone-converter.git
cd timezone-converter
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run unit tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint

### Project Structure

```
timezone-converter/
├── src/
│   ├── components/          # React components
│   │   ├── TimezoneCard.tsx
│   │   ├── TimezoneInput.tsx
│   │   ├── TimezonePicker.tsx
│   │   ├── SavedSetsPills.tsx
│   │   └── SaveSetModal.tsx
│   ├── store/              # Zustand store
│   │   └── timezoneStore.ts
│   ├── utils/              # Utility functions
│   │   ├── timezoneUtils.ts
│   │   └── timezoneData.ts
│   ├── types/              # TypeScript types
│   │   └── timezone.types.ts
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
└── tests/                  # Test files
```

## Usage

### Converting Times

1. Enter a time in the input field (e.g., "3pm", "15:00", "now")
2. Select your source timezone from the dropdown
3. Click "Add Timezone" to add target timezones
4. View converted times instantly

### Saving Timezone Sets

1. Add 2 or more timezones
2. Click "Save Set" button
3. Give your set a name (e.g., "Work Team", "Family")
4. Click the saved set pill to quickly load those timezones

### Supported Time Formats

- **12-hour**: `3pm`, `3:30 PM`, `12am`
- **24-hour**: `15:00`, `03:30`
- **Special**: `now` (current time)

## Key Features in Detail

### Timezone Conversion Logic

The app uses Luxon's robust timezone handling built on the IANA timezone database. This ensures:
- Accurate DST (Daylight Saving Time) handling
- Support for 400+ timezones worldwide
- Automatic date boundary detection

### Saved Sets

Timezone sets are stored in browser localStorage, allowing you to:
- Save multiple timezone combinations
- One-click loading of frequently used sets
- Persist across browser sessions
- No account required

### Responsive Design

Built mobile-first with Tailwind CSS:
- Vertical layout for better mobile experience
- Touch-friendly controls
- Adaptive spacing and typography

## Testing

The project includes comprehensive unit tests for the core conversion logic:

```bash
npm test
```

Tests cover:
- Time parsing (various formats)
- Timezone conversions
- DST transitions
- Day boundary detection
- Edge cases

## Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. For production:
```bash
vercel --prod
```

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 14+, Chrome Android

## Future Enhancements

- [ ] Date picker for converting times on specific dates
- [ ] Meeting scheduler (find overlapping work hours)
- [ ] Dark mode
- [ ] URL sharing via query parameters
- [ ] Keyboard shortcuts
- [ ] Backend sync for cross-device access
- [ ] Chrome extension

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Luxon](https://moment.github.io/luxon/) - Modern JavaScript date library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Headless UI](https://headlessui.com/) - Unstyled, accessible UI components
- [Zustand](https://github.com/pmndrs/zustand) - Lightweight state management

## Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter)

Project Link: [https://github.com/yourusername/timezone-converter](https://github.com/yourusername/timezone-converter)
