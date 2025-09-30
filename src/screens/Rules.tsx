import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";
import { useTranslation } from "react-i18next";
import NumberedList from "../ui/NumberedList";
import Button from "../ui/Button";
import css from "./Rules.module.css";

type Props = { onStart: () => void };

export default function Rules({ onStart }: Props) {
  const { t } = useTranslation();

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
    { id: 1, text: t('rules.list.1') },
    { id: 2, text: t('rules.list.2') },
    { id: 3, text: t('rules.list.3') },
    { id: 4, text: t('rules.list.4') },
    { id: 5, text: t('rules.list.5') },
  ];

  // Ordered steps list (previously shown via alert in the game)
  const steps = Object.keys(t('steps', { returnObjects: true })).map((key, i) => ({
    id: i + 1,
    text: t(`steps.${key}`),
  }));

  const start = () => {
    try {
      WebApp.HapticFeedback?.impactOccurred?.("light");
    } catch {
      // ignore haptic errors
    }
    onStart();
  };

  return (
    <div className={css.screen} role="main" aria-labelledby="r-title">
      <Button onClick={start} aria-label={t('rules.startButtonAria')}>
        {t('rules.startButton')}
      </Button>
      <h1 id="r-title" className={css.title}>
        {t('rules.title')}
      </h1>

      <NumberedList items={list} ariaLabel={t('rules.title')} />

      <h2 className={css.title} style={{ fontSize: "1.1rem", marginTop: 16 }}>{t('rules.stepsTitle')}</h2>
      <NumberedList items={steps} ariaLabel={t('rules.stepsTitle')} />

    </div>
  );
}
