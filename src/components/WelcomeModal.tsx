import { useCallback } from "react";
import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";
import styles from "../screens/Welcome.module.css";
import Button from "../ui/Button";

export type WelcomeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
};

export default function WelcomeModal({ isOpen, onClose, onStart }: WelcomeModalProps) {
  const { t } = useTranslation();
  const user = WebApp.initDataUnsafe?.user;
  const navigate = useNavigate();

  const handleStart = useCallback(() => {
    try {
      WebApp.HapticFeedback?.impactOccurred?.("light");
    } catch {
      // ignore haptic errors
    }
    onStart();
    onClose();
  }, [onClose, onStart]);

  const goLeaders = useCallback(() => {
    try {
      WebApp.HapticFeedback?.impactOccurred?.("light");
    } catch {
      // ignore haptic errors
    }
    navigate('/leaders');
    onClose();
  }, [navigate, onClose]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel={t('welcome.ariaLabel')}>
      {/* Window dots header is provided by Modal by default */}
      <div className={styles.card} style={{ width: "100%", background: "transparent", border: "none", boxShadow: "none", padding: 0 }}>
        {/* We intentionally avoid duplicating windowDots here because Modal already renders them */}
        {user && (
          <p className={styles.user}>
            {t('welcome.greeting', { firstName: user.first_name, lastName: user.last_name ?? "" })}
          </p>
        )}

        <h1 id="wm-title" className={styles.title}>
          {t('welcome.title')}
        </h1>

        <p
          id="wm-desc"
          className={styles.body}
          dangerouslySetInnerHTML={{ __html: t('welcome.description') }}
        />

        <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
          <Button onClick={handleStart} aria-label={t('welcome.startButtonAria')}>{t('welcome.startButton')}</Button>
          <Button variant="gray" onClick={goLeaders} aria-label={t('welcome.resultsButtonAria')}>{t('welcome.resultsButton')}</Button>
        </div>
      </div>
    </Modal>
  );
}
