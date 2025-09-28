import { useCallback } from "react";
import WebApp from "@twa-dev/sdk";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import styles from "../screens/Welcome.module.css";
import Button from "../ui/Button";

export type WelcomeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onStart: () => void;
};

export default function WelcomeModal({ isOpen, onClose, onStart }: WelcomeModalProps) {
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
    <Modal isOpen={isOpen} onClose={onClose} ariaLabel="Welcome">
      {/* Window dots header is provided by Modal by default */}
      <div className={styles.card} style={{ width: "100%", background: "transparent", border: "none", boxShadow: "none", padding: 0 }}>
        {/* We intentionally avoid duplicating windowDots here because Modal already renders them */}
        {user && (
          <p className={styles.user}>
            Привет, {user.first_name} {user.last_name ?? ""}!
          </p>
        )}

        <h1 id="wm-title" className={styles.title}>
          Deploy or Die
        </h1>

        <p id="wm-desc" className={styles.body}>
          Твоя задача — собрать весь цикл разработки до продакшн-деплоя.<br />
          На экране будет показан правильный порядок блоков задач — каждый из них отмечен смайликом.<br />
          Тебе нужно ловить только нужные задачи, собирать их в правильной последовательности и игнорировать лишние блоки.
        </p>

        <div style={{ display: 'grid', gap: 8, marginTop: 8 }}>
          <Button onClick={handleStart} aria-label="Начать игру">Начать</Button>
          <Button variant="gray" onClick={goLeaders} aria-label="Результаты">Результаты</Button>
        </div>
      </div>
    </Modal>
  );
}
