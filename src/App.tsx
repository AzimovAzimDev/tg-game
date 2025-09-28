import { Routes, Route, useNavigate } from 'react-router-dom';
import DeployGame from './DeployGame';
import Rules from './screens/Rules';
import Welcome from './screens/Welcome';
import Leaders from './screens/Leaders';
import TabLayout from './components/TabLayout';
import Profile from './screens/Profile';

export default function App() {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Tabbed routes */}
      <Route element={<TabLayout />}> 
        <Route path="/" element={<Welcome onStart={() => navigate('/rules')} />} />
        <Route path="/leaders" element={<Leaders />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Non-tabbed routes */}
      <Route path="/rules" element={<Rules onStart={() => navigate('/game')} />} />
      <Route path="/game" element={<DeployGame />} />
    </Routes>
  );
}
