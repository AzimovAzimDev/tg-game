import { Routes, Route } from 'react-router-dom';
import DeployGame from './DeployGame';
import Home from './Home';
import Rules from './Rules';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/game" element={<DeployGame />} />
    </Routes>
  );
}
