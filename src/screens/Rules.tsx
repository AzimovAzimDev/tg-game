import { useEffect } from "react";
import NumberedList from "../ui/NumberedList";
import css from "./Rules.module.css";

interface TelegramWebApp {
  HapticFeedback?: {
    impactOccurred?: (type: string) => void;
  };
}

const tg = (
  window as unknown as { Telegram?: { WebApp?: TelegramWebApp } }
).Telegram?.WebApp;

type Props = { onStart: () => void };

export default function Rules({ onStart }: Props) {
  useEffect(() => {
    // simple asset warmup — safe after user interacted on Welcome
    const audios = [
      "/sfx/correct.mp3",
      "/sfx/wrong.mp3",
      "/sfx/heal.mp3",
      "/sfx/fanfare.mp3",
    ];
    audios.forEach((src) => {
      const a = new Audio(src);
      a.preload = "auto";
    });
  }, []);

  const list = [
    { id: 1, text: "Сверху падают кнопки с задачами" },
    { id: 2, text: "На экране всегда показано, что нужно найти и кликнуть" },
    { id: 3, text: "Жми только нужную задачу, остальное игнорируй" },
  ];

  // Ordered steps list (previously shown via alert in the game)
  const steps = [
    { id: 1, text: "Get requirements 📝" },
    { id: 2, text: "Create branch 🌿" },
    { id: 3, text: "Write code 💻" },
    { id: 4, text: "Write tests 🧪" },
    { id: 5, text: "Fix bugs 🐛" },
    { id: 6, text: "Resolve conflicts ⚔️" },
    { id: 7, text: "Get MR approvals ✅" },
    { id: 8, text: "Merge to main 🔀" },
    { id: 9, text: "Deploy to prod 🚀" },
  ];

  const start = () => {
    try {
      tg?.HapticFeedback?.impactOccurred?.("light");
    } catch {
      // ignore haptic errors
    }
    onStart();
  };

  return (
    <div className={css.screen} role="main" aria-labelledby="r-title">
      <h1 id="r-title" className={css.title}>
        {"Правила\u00A0игры"}
      </h1>

      <NumberedList items={list} />

      <h2 className={css.title} style={{ fontSize: "1.1rem", marginTop: 16 }}>Порядок кликов</h2>
      <NumberedList items={steps} />

      <div className={css.hintCard} role="note" aria-label="Подсказка">
        <div className={css.bulb} aria-hidden>💡</div>
        <div className={css.hintText}>
          Чем быстрее кликаешь — тем больше очков. Промах — минус время
        </div>
      </div>

      <button className={css.cta} onClick={start} aria-label="Начать игру">
        Погнали 🚀
      </button>
    </div>
  );
}
