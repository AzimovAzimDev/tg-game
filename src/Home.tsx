import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Stats {
  gamesPlayed: number;
  bestScore: number;
  lastScore: number;
}

export default function Home() {
  const [stats, setStats] = useState<Stats>({ gamesPlayed: 0, bestScore: 0, lastScore: 0 });

  useEffect(() => {
    const raw = localStorage.getItem('deployGameStats');
    if (raw) {
      try {
        setStats(JSON.parse(raw));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Deploy or Die</h1>
      <div>
        <p>Games played: {stats.gamesPlayed}</p>
        <p>Best score: {stats.bestScore}</p>
        {stats.gamesPlayed > 0 && <p>Last score: {stats.lastScore}</p>}
      </div>
      <Link to="/game">
        <button style={{ marginTop: '1rem' }}>Start Game</button>
      </Link>
    </div>
  );
}
