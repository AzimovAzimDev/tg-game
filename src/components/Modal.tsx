import { ReactNode, useEffect } from 'react';

export type ModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  ariaLabel?: string;
  closeOnBackdrop?: boolean;
};

export default function Modal({ isOpen, onClose, children, ariaLabel, closeOnBackdrop = true }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      // prevent background scroll
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const onBackdropClick = () => {
    if (closeOnBackdrop) onClose?.();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onClick={onBackdropClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#181B22',
          borderRadius: 20,
          padding: 24,
          width: '100%',
          maxWidth: 360,
          boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
