import { useEffect } from 'react';

export default function Leaders() {
  useEffect(() => {
    // Ensure unified background color per spec
    document.body.style.background = '#1D2129';
  }, []);

  return (
    <div style={{
      minHeight: '100svh',
      background: '#1D2129',
      color: '#e5e7eb',
      padding: 16,
      display: 'grid',
      placeItems: 'center'
    }}>
      <div style={{
        width: 'min(680px, 92vw)',
        background: '#1D2129',
        border: '1px solid #FFFFFF26',
        borderRadius: 18,
        padding: 20,
        boxShadow: '0 10px 40px rgba(0,0,0,0.45)'
      }}>
        <h1 style={{
          margin: '0 0 12px 0',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
          fontWeight: 800,
          fontSize: 'clamp(22px, 5.8vw, 28px)'
        }}>Доска лидеров</h1>
        <p style={{ color: 'rgba(229,231,235,0.75)' }}>
          Здесь будет таблица лидеров. Скоро!
        </p>
      </div>
    </div>
  );
}
