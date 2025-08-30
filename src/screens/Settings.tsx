import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

export default function Settings() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = '#1D2129';
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ marginTop: 0 }}>Settings</h1>
      <p>Change app preferences.</p>

      <div style={{ display: 'flex', gap: 12 }}>
        <Button variant="gray" onClick={() => navigate('/settings/language')}>Change language</Button>
      </div>
    </div>
  );
}
