import { Routes, Route, useNavigate } from 'react-router-dom';
import Rules from './screens/Rules';
import Welcome from './screens/Welcome';
import Game from './screens/Game';

export default function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Welcome onStart={() => navigate('/rules')} />} />
      <Route path="/rules" element={<Rules onStart={() => navigate('/game')} />} />
      <Route path="/game" element={<Game />} />
    </Routes>
  );
}
