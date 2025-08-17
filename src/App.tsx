import { Routes, Route, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DeployGame from './DeployGame';
import Home from './Home';

export default function App() {
  const { t } = useTranslation();
  return (
    <>
      <nav>
        <Link to="/">{t('home')}</Link> | <Link to="/game">Game</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<DeployGame />} />
      </Routes>
    </>
  );
}
