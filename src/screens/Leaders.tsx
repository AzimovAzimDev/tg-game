import { useEffect } from 'react';
import Leaderboard from '../components/Leaderboard';
import type { Entry } from '../components/Leaderboard';

export default function Leaders() {
  useEffect(() => {
    // Ensure unified background color per spec
    document.body.style.background = '#1D2129';
  }, []);

  const entries: Entry[] = [
    { id: '1', name: 'Marcus Bergson', initials: 'MB', score: 324 },
    { id: '2', name: 'Talan Bator', initials: 'TB', score: 301 },
    { id: '3', name: 'Avatar Aang', initials: 'AA', score: 299 },
    { id: '4', name: 'Kadin Curtis', initials: 'KC', score: 285 },
    { id: '5', name: 'Omar Calzoni', initials: 'OC', score: 273 },
    { id: '6', name: 'Mira Schleifer', initials: 'MS', score: 269 },
  ];

  return (
    <div style={{
      minHeight: '100svh',
      background: '#1D2129',
      color: '#e5e7eb',
      position: 'relative',
    }}>
        <h1 style={{ margin: 0, padding: 20 }}>Доска лидеров</h1>

      {/* Leaderboard block positioned below the title */}
      <div style={{  }}>
        <Leaderboard entries={entries} />
      </div>
    </div>
  );
}
