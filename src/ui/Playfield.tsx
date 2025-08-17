import s from "./Playfield.module.css";
import BlockCard from "./BlockCard";

type BlockVM = { id: string; x: number; y: number; label: string; icon?: string };

export default function Playfield({
  blocks,
  onTap,
}: {
  blocks: BlockVM[];
  onTap: (id: string) => void;
}) {
  return (
    <div className={s.root}>
      {blocks.map((b) => (
        <BlockCard
          key={b.id}
          x={b.x}
          y={b.y}
          label={b.label}
          onTap={() => onTap(b.id)}
        />
      ))}
    </div>
  );
}

