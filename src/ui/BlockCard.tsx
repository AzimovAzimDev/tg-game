import s from "./BlockCard.module.css";

export default function BlockCard({
  x,
  y,
  label,
  onTap,
}: {
  x: number;
  y: number;
  label: string;
  onTap: () => void;
}) {
  return (
    <button
      className={s.card}
      style={{ transform: `translate(${x}px, ${y}px)` }}
      onClick={onTap}
      aria-label={label}
    >
      <div className={s.icon}>🪲</div>
      <div className={s.text}>{label}</div>
    </button>
  );
}

