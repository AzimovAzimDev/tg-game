import HeaderBar from "../ui/HeaderBar";
import GoalPill from "../ui/GoalPill";
import Playfield from "../ui/Playfield";
import "../styles/game.css";

export default function GameUI({
  state,
  onBlockTap,
}: {
  state: {
    timeLeftMs: number;
    score: number;
    scoreDelta?: { v: number; at: number };
    goalLabel: string;
    blocks: { id: string; x: number; y: number; label: string }[];
  };
  onBlockTap: (id: string) => void;
}) {
  return (
    <div className="game-screen">
      <HeaderBar
        timeLeftMs={state.timeLeftMs}
        score={state.score}
        delta={state.scoreDelta}
      />
      <GoalPill label={state.goalLabel} />
      <Playfield blocks={state.blocks} onTap={onBlockTap} />
    </div>
  );
}

