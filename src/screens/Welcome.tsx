import { useEffect, useMemo, useState } from "react";
import WebApp from "@twa-dev/sdk";
import styles from "./Welcome.module.css";
import LanguageSelectModal from "../components/LanguageSelectModal";
import { USER_PREFERENCES } from "../config/userPreferences";

type Props = { onStart: () => void };

function getCookie(name: string): string | undefined {
  return document.cookie
    .split(";")
    .map((c) => c.trim())
    .filter(Boolean)
    .map((c) => c.split("="))
    .find(([k]) => k === name)?.[1];
}

export default function Welcome({ onStart }: Props) {
  const user = WebApp.initDataUnsafe?.user;

  const [showLang, setShowLang] = useState(false);
  const cookieName = useMemo(() => USER_PREFERENCES.languageCookie, []);

  useEffect(() => {
    document.body.style.backgroundColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--tg-theme-bg_color") || "#0f1115";
  }, []);

  useEffect(() => {
    // show language modal on first load if cookie not set
    const hasLang = typeof document !== "undefined" && getCookie(cookieName);
    setShowLang(!hasLang);
  }, [cookieName]);

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
      <LanguageSelectModal isOpen={showLang} onClose={() => setShowLang(false)} cookieName={cookieName} />
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
