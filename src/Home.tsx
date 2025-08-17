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
    <div style={{ padding: '1rem', maxWidth: '480px', margin: '0 auto' }}>
      <h1>Deploy or Die</h1>
      <p>
        Твоя задача — поймать <br /> все шаги деплоя <br /> в правильном порядке, <br /> пока таймер не
        обнулился
      </p>
      <div style={{ marginTop: '1rem' }}>
        <p>Игры сыграно: {stats.gamesPlayed}</p>
        <p>Лучший счёт: {stats.bestScore}</p>
        {stats.gamesPlayed > 0 && <p>Последний счёт: {stats.lastScore}</p>}
      </div>
      <Link to="/rules">
        <button style={{ marginTop: '1.5rem' }}>Начать</button>
      </Link>
    </div>
  );
}
