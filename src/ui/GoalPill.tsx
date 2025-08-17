import s from "./GoalPill.module.css";

export default function GoalPill({ label }: { label: string }) {
  return (
    <div className={s.wrap}>
      <div className={s.pill} role="status" aria-live="polite">
        Цель:&nbsp;<span className={s.label}>{label}</span>
      </div>
    </div>
  );
}

