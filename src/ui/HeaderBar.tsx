import s from "./HeaderBar.module.css";

type Props = {
  timeLeftMs: number;
  score: number;
  delta?: { v: number; at: number };
};

export default function HeaderBar({ timeLeftMs, score, delta }: Props) {
  const sec = Math.max(0, Math.floor(timeLeftMs / 1000));
  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");
  const low = sec <= 15;

  return (
    <div className={s.bar} role="toolbar" aria-label="Информация раунда">
      <div className={`${s.badge} ${low ? s.badgeDanger : ""}`} aria-live="polite">
        <span className={s.icon}>⏱</span>
        <span className={s.text}>
          {mm}:{ss}
        </span>
      </div>

      <div className={s.spacer} />

      <div className={s.badge} aria-live="polite">
        <span className={s.icon}>★</span>
        <span className={s.text}>Очки: {score}</span>
        {delta && (
          <span
            key={delta.at}
            className={`${s.delta} ${delta.v >= 0 ? s.deltaPos : s.deltaNeg}`}
          >
            {delta.v >= 0 ? `+${delta.v}` : `${delta.v}`}
          </span>
        )}
      </div>
    </div>
  );
}

