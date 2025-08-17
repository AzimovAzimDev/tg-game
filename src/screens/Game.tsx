import HeaderBar from "../ui/HeaderBar";
import GoalPill from "../ui/GoalPill";
import Playfield from "../ui/Playfield";
import "../styles/game.css";

export default function Game() {
  const state = {
    timeLeftMs: 0,
    score: 0,
    goalLabel: "",
    blocks: [] as { id: string; x: number; y: number; label: string }[],
  };

  return (
    <div className="game-screen">
      <HeaderBar timeLeftMs={state.timeLeftMs} score={state.score} />
      <GoalPill label={state.goalLabel} />
      <Playfield blocks={state.blocks} onTap={() => {}} />
    </div>
  );
}

