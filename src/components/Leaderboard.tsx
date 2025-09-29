import { useTranslation } from 'react-i18next';
import "./leaderboard.css";

export type Entry = {
  id: string;
  name: string;
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
  prizeCount = 1,
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
              score={e.score}
              ts={e.ts}
              selected={i === 0}
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
              score={e.score}
              ts={e.ts}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function LeaderboardRow({
  rank,
  name,
  score,
  ts,
  selected = false,
}: {
  rank: number;
  name: string;
  score: number;
  ts?: string;
  selected?: boolean;
}) {
  const { t } = useTranslation();
  const formattedDate = ts ? formatDate(ts) : name;

  return (
    <li className={`lb-row ${selected ? "is-selected" : ""}`}>
      <div className="lb-left">
        <div className="lb-rank">{rank}</div>
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