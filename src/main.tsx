import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { useThemeStore, getEffectiveTheme, applyTheme } from './store/themeStore'

// Force remove dark class first, then apply correct theme
document.documentElement.classList.remove('dark');

// Apply theme immediately on load
const applyCurrentTheme = () => {
  const state = useThemeStore.getState();
  applyTheme(state.theme);
};

// Subscribe to theme changes
useThemeStore.subscribe((state) => {
  applyTheme(state.theme);
});

// Apply initial theme after store is ready
setTimeout(applyCurrentTheme, 0);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
