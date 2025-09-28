import { useEffect } from 'react';
import Leaderboard from '../components/Leaderboard';
import type { Entry } from '../components/Leaderboard';

export default function Leaders() {
  useEffect(() => {
    // Ensure unified background color per spec
    document.body.style.background = '#1D2129';
  }, []);

  // Load personal results from localStorage
  let entries: Entry[] = [];
  try {
    const raw = localStorage.getItem('myResults');
    const list = raw ? JSON.parse(raw) : [];
    if (Array.isArray(list)) {
      entries = list
        .map((r: any, idx: number) => ({
          id: String(r?.id ?? idx),
          name: String(r?.name ?? 'Я'),
          initials: String(r?.initials ?? 'Я'),
          score: Number(r?.score ?? 0),
        }))
        .filter(e => Number.isFinite(e.score))
        .sort((a, b) => b.score - a.score);
    }
  } catch {
    // ignore parsing errors
  }

  return (
    <div style={{
      minHeight: '100svh',
      background: '#1D2129',
      color: '#e5e7eb',
      position: 'relative',
    }}>
        <h1 style={{ margin: 0, padding: 20 }}>Мои результаты</h1>

      {/* Personal leaderboard block positioned below the title */}
      <div>
        {entries.length > 0 ? (
          <Leaderboard entries={entries} mode="single" winnersTitle="Мои результаты" />
        ) : (
          <div style={{ padding: 20, opacity: 0.8 }}>Пока нет результатов. Сыграйте игру, чтобы увидеть свои баллы здесь.</div>
        )}
      </div>
    </div>
  );
}
