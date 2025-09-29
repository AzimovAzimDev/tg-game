import { useTranslation } from 'react-i18next';
import "./leaderboard.css";

export type Entry = {
  id: string;
  name: string;
  initials: string;
  score: number;
  ts?: string;
};

export type LeaderboardProps = {
  winnersTitle?: string;
  othersTitle?: string;
  prizeCount?: number; // how many get the prize (highlighted group)
  entries: Entry[];    // already sorted DESC by score
  mode?: 'two-sections' | 'single';
};

export default function Leaderboard({
  winnersTitle,
  othersTitle,
  prizeCount = 3,
  entries,
  mode = 'two-sections',
}: LeaderboardProps) {
  const { t } = useTranslation();
  const finalWinnersTitle = winnersTitle || t('leaderboard.winnersTitle');
  const finalOthersTitle = othersTitle || t('leaderboard.othersTitle');

  const winners = entries.slice(0, prizeCount);
  const others = entries.slice(prizeCount);

  if (mode === 'single') {
    return (
      <div className="lb-root">
        <section className="lb-section">
          <header className="lb-title lb-title--green">
            <span className="lb-title-text">{finalWinnersTitle}</span>
          </header>
          <ul className="lb-list">
            {entries.map((e, i) => (
              <LeaderboardRow
                key={e.id}
                rank={i + 1}
                name={e.name}
                initials={e.initials}
                score={e.score}
                ts={e.ts}
              />
            ))}
          </ul>
        </section>
      </div>
    );
  }

  return (
    <div className="lb-root">
      <section className="lb-section">
        <header className="lb-title lb-title--green">
          <span className="lb-title-text">{finalWinnersTitle}</span>
        </header>

        <ul className="lb-list">
          {winners.map((e, i) => (
            <LeaderboardRow
              key={e.id}
              rank={i + 1}
              name={e.name}
              initials={e.initials}
              score={e.score}
              ts={e.ts}
              selected={i === 2} // 3rd row in the PNG has a darker bg
            />
          ))}
        </ul>
      </section>

      <section className="lb-section">
        <header className="lb-title lb-title--amber">
          <span className="lb-title-text">{finalOthersTitle}</span>
        </header>

        <ul className="lb-list">
          {others.map((e, i) => (
            <LeaderboardRow
              key={e.id}
              rank={i + prizeCount + 1}
              name={e.name}
              initials={e.initials}
              score={e.score}
              ts={e.ts}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}

function LeaderboardRow({
  rank,
  name,
  initials,
  score,
  ts,
  selected = false,
}: {
  rank: number;
  name: string;
  initials: string;
  score: number;
  ts?: string;
  selected?: boolean;
}) {
  const { t } = useTranslation();
  const formattedDate = ts ? new Date(ts).toLocaleString() : name;

  return (
    <li className={`lb-row ${selected ? "is-selected" : ""}`}>
      <div className="lb-left">
        <div className="lb-rank">{rank}</div>

        <div className="lb-avatar" aria-hidden>
          <span className="lb-avatar-text">{initials}</span>
        </div>

        <div className="lb-name">{formattedDate}</div>
      </div>

      <div className="lb-right" aria-label={t('leaderboard.pointsAriaLabel', { score })}>
        <StarIcon className="lb-star" />
        <span className="lb-score">{score}</span>
      </div>
    </li>
  );
}

function StarIcon({ className }: { className?: string }) {
  // 18x18 white star with 0.7 opacity (same as Figma)
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2.5l2.93 5.94 6.56.95-4.74 4.62 1.12 6.53L12 17.77l-5.87 3.09 1.12-6.53L2.5 9.39l6.56-.95L12 2.5z" />
    </svg>
  );
}
