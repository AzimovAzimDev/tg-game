import { useEffect, useMemo, useState } from "react";
import WebApp from "@twa-dev/sdk";
import styles from "./Welcome.module.css";
import LanguageSelectModal from "../components/LanguageSelectModal";
import { USER_PREFERENCES } from "../config/userPreferences";
import WelcomeModal from "../components/WelcomeModal";

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
  const [showLang, setShowLang] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const cookieName = useMemo(() => USER_PREFERENCES.languageCookie, []);

  useEffect(() => {
    document.body.style.backgroundColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--tg-theme-bg_color") || "#0f1115";
  }, []);

  useEffect(() => {
    // decide which modal to show based on cookie
    const hasLang = typeof document !== "undefined" && getCookie(cookieName);
    if (hasLang) {
      setShowWelcome(true);
      setShowLang(false);
    } else {
      setShowLang(true);
      setShowWelcome(false);
    }
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
    <div className={styles.screen} role="main">
      <LanguageSelectModal
        isOpen={showLang}
        onClose={() => {
          setShowLang(false);
          // language selection triggers onClose; show welcome modal next
          setShowWelcome(true);
        }}
        cookieName={cookieName}
      />

      <WelcomeModal
        isOpen={showWelcome}
        onClose={() => setShowWelcome(false)}
        onStart={handleStart}
      />
    </div>
  );
}
