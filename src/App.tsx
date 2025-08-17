import { Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { t } = useTranslation();
  return (
    <>
      <nav>
        <Link to="/">{t('home')}</Link> | <Link to="/about">{t('about')}</Link>
      </nav>
      <Routes>
        <Route path="/" element={<h1>{t('hello')}</h1>} />
        <Route path="/about" element={<h1>About</h1>} />
      </Routes>
    </>
  );
}
