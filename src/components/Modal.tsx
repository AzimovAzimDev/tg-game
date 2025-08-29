import { useEffect } from 'react';
import type { ReactNode } from 'react';
import css from './Modal.module.css';

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
      className={css.backdrop}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={css.panel}
      >
        <div className={css.windowDots} aria-hidden>
          <span className={`${css.dot} ${css.red}`} />
          <span className={`${css.dot} ${css.yellow}`} />
          <span className={`${css.dot} ${css.green}`} />
        </div>
        {children}
      </div>
    </div>
  );
}
