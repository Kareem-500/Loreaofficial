let lockCount = 0;
let originalPaddingRight = '';

export const lockScroll = () => {
  if (typeof document === 'undefined') return;

  if (lockCount === 0) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    originalPaddingRight = document.body.style.paddingRight || '';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
};

export const unlockScroll = () => {
  if (typeof document === 'undefined') return;

  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    document.body.style.overflow = '';
    document.body.style.paddingRight = originalPaddingRight;
  }
};
