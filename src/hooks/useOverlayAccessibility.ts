import { useEffect } from 'react';
import { lockScroll, unlockScroll } from '../utils/scrollLock';

interface UseOverlayAccessibilityOptions {
  isOpen: boolean;
  onClose: () => void;
  preventScroll?: boolean;
}

export const useOverlayAccessibility = ({
  isOpen,
  onClose,
  preventScroll = true
}: UseOverlayAccessibilityOptions) => {
  useEffect(() => {
    if (!isOpen) return;

    if (preventScroll) {
      lockScroll();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (preventScroll) {
        unlockScroll();
      }
    };
  }, [isOpen, onClose, preventScroll]);
};
