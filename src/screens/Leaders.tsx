import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Leaderboard from '../components/Leaderboard';
import type { Entry } from '../components/Leaderboard';

export default function Leaders() {
  const { t } = useTranslation();

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
          name: String(r?.name ?? t('game.me')),
          score: Number(r?.score ?? 0),
          ts: r?.ts,
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
        <h1 style={{ margin: 0, padding: 20 }}>{t('leaders.myResults')}</h1>

        <div style={{ padding: '0 20px 20px', opacity: 0.8 }}>{t('leaders.disclaimer')}</div>

      {/* Personal leaderboard block positioned below the title */}
      <div>
        {entries.length > 0 ? (
          <Leaderboard entries={entries} mode="single" winnersTitle={t('leaders.myResults')} />
        ) : (
          <div style={{ padding: 20, opacity: 0.8 }}>{t('leaders.noResults')}</div>
        )}
      </div>
    </div>
  );
}
