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

const LOG_LINES = [
  "[00:00:01] INITIATING DEPLOY SEQUENCE...",
  "[00:00:02] SYSTEM CHECK... OK",
  "[00:00:03] UPLOADING DEFENSE PROTOCOLS...",
  "[00:00:05] WARNING: Enemy signal locked at 3.2 km",
  "[00:00:06] UPLOADING DEFENSE PROTOCOLS...",
  "[00:00:08] DEPLOYING AUTO-TURRETS... DONE",
  "[00:00:09] SHIELDS ONLINE... 100%",
  "[00:00:10] FINALIZING...",
  "[00:00:11] DEPLOY SUCCESSFUL ✅",
  "[00:00:12] ENEMY ADVANCE HALTED",
] as const;

function sliceWindow<T>(arr: readonly T[], endExclusive: number, size: number): T[] {
  const res: T[] = [];
  for (let i = size; i > 0; i--) {
    const idx = (endExclusive - i + arr.length) % arr.length;
    res.push(arr[idx]);
  }
  return res;
}

export default function Welcome({ onStart }: Props) {
  const [showLang, setShowLang] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [tick, setTick] = useState(0);
  const cookieName = useMemo(() => USER_PREFERENCES.languageCookie, []);

  useEffect(() => {
    // Unify page background per spec
    document.body.style.background = "#1D2129";
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

  // background console animation
  useEffect(() => {
    const id = setInterval(() => setTick((t) => (t + 1) % LOG_LINES.length), 900);
    return () => clearInterval(id);
  }, []);

  const handleStart = () => {
    try {
      WebApp.HapticFeedback?.impactOccurred?.("light");
    } catch {
      // ignore haptic errors
    }
    onStart();
  };

  const topWindow = sliceWindow(LOG_LINES, tick, 6);
  const bottomWindow = sliceWindow(
    LOG_LINES,
    (tick + Math.floor(LOG_LINES.length / 2)) % LOG_LINES.length,
    6
  );

  return (
    <div className={styles.screen} role="main">
      {/* Background console logs */}
      <div className={`${styles.bgConsole} ${styles.topLeft}`}>{topWindow.join("\n")}</div>
      <div className={`${styles.bgConsole} ${styles.bottomRight}`}>{bottomWindow.join("\n")}</div>

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
