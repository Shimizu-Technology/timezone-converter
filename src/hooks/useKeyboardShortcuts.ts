import { useEffect } from 'react';

interface KeyboardShortcuts {
  onAddTimezone?: () => void;
  onSaveSet?: () => void;
  onCopyUrl?: () => void;
  onSetNow?: () => void;
  onCloseModal?: () => void;
}

/**
 * Hook to handle keyboard shortcuts
 */
export function useKeyboardShortcuts({
  onAddTimezone,
  onSaveSet,
  onCopyUrl,
  onSetNow,
  onCloseModal
}: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const target = e.target as HTMLElement;
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);

      // Cmd/Ctrl + K: Open timezone picker
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onAddTimezone?.();
        return;
      }

      // Cmd/Ctrl + S: Save set
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        onSaveSet?.();
        return;
      }

      // Cmd/Ctrl + L: Copy/share URL
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        onCopyUrl?.();
        return;
      }

      // Escape: Close modal
      if (e.key === 'Escape') {
        onCloseModal?.();
        return;
      }

      // N: Set time to now (only when not typing)
      if (!isTyping && e.key === 'n') {
        e.preventDefault();
        onSetNow?.();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onAddTimezone, onSaveSet, onCopyUrl, onSetNow, onCloseModal]);
}
