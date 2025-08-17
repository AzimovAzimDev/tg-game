import { Link } from 'react-router-dom';

export default function Rules() {
  return (
    <div style={{ padding: '1rem', maxWidth: '480px', margin: '0 auto' }}>
      <h1>Правила игры</h1>
      <ol style={{ lineHeight: 1.5 }}>
        <li>Сверху падают кнопки с задачами</li>
        <li>На экране всегда показано, что нужно найти и кликнуть</li>
        <li>Жми только нужную задачу, остальное игнорируй</li>
      </ol>
      <p style={{ color: '#f87171', fontWeight: 500 }}>
        Чем больше задеплоишь — тем больше очков. Промах — минус время
      </p>
      <Link to="/game">
        <button style={{ marginTop: '1rem' }}>Погнали 🚀</button>
      </Link>
    </div>
  );
}
