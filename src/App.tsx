import { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import DeployGame from './DeployGame';
import Rules from './screens/Rules';
import Welcome from './screens/Welcome';
import Leaders from './screens/Leaders';
import TabLayout from './components/TabLayout';
import Profile from './screens/Profile';

export default function App() {
  const navigate = useNavigate();

  useEffect(() => {
    WebApp.expand();

    const handleSafeAreaChanged = () => {
      const root = document.documentElement;
      if (WebApp.safeAreaInset) {
        root.style.setProperty('--safe-area-inset-top', `${WebApp.safeAreaInset.top}px`);
        root.style.setProperty('--safe-area-inset-right', `${WebApp.safeAreaInset.right}px`);
        root.style.setProperty('--safe-area-inset-bottom', `${WebApp.safeAreaInset.bottom}px`);
        root.style.setProperty('--safe-area-inset-left', `${WebApp.safeAreaInset.left}px`);
      }
    };

    WebApp.onEvent('safeAreaChanged', handleSafeAreaChanged);
    handleSafeAreaChanged(); // Initial call

    return () => {
      WebApp.offEvent('safeAreaChanged', handleSafeAreaChanged);
    };
  }, []);

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
