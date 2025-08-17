import { Routes, Route, useNavigate } from 'react-router-dom';
import DeployGame from './DeployGame';
import Rules from './Rules';
import Welcome from './screens/Welcome';

export default function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/" element={<Welcome onStart={() => navigate('/rules')} />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/game" element={<DeployGame />} />
    </Routes>
  );
}
