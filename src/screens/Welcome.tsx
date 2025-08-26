import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import styles from "./Welcome.module.css";

type Props = { onStart: () => void };

export default function Welcome({ onStart }: Props) {
  const user = WebApp.initDataUnsafe?.user;

  useEffect(() => {
    document.body.style.backgroundColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--tg-theme-bg_color") || "#0f1115";
  }, []);

  const handleStart = () => {
    try {
      WebApp.HapticFeedback?.impactOccurred?.("light");
    } catch {
      // ignore haptic errors
    }
    onStart();
  };

  return (
    <div
      className={styles.screen}
      role="main"
      aria-labelledby="w-title"
      aria-describedby="w-desc"
    >
      <div className={styles.card}>
        <div className={styles.windowDots} aria-hidden>
          <span className={`${styles.dot} ${styles.red}`} />
          <span className={`${styles.dot} ${styles.yellow}`} />
          <span className={`${styles.dot} ${styles.green}`} />
        </div>

        {user && (
          <p className={styles.user}>
            Привет, {user.first_name} {user.last_name ?? ""}!
          </p>
        )}

        <h1 id="w-title" className={styles.title}>
          Deploy or Die
        </h1>

        <p id="w-desc" className={styles.body}>
          Твоя задача — поймать<br />
          все шаги деплоя<br />
          в правильном порядке,<br />
          пока таймер не обнулился
        </p>

        <button
          className={styles.cta}
          onClick={handleStart}
          aria-label="Начать игру"
        >
          Начать
        </button>
      </div>
    </div>
  );
}
