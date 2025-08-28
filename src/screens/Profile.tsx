import { useEffect } from 'react';

export default function Profile() {
  useEffect(() => {
    document.body.style.background = '#1D2129';
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ marginTop: 0 }}>Profile</h1>
      <p>Coming soon: user stats, avatar, and account details.</p>
    </div>
  );
}
