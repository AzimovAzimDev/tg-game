import { NavLink, useNavigate } from 'react-router-dom';
import React from 'react';

const barStyle: React.CSSProperties = {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  height: 60,
  background: '#0f1a2b',
  borderTop: '1px solid #21324f',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 72px 1fr 1fr', // preserve blank middle slot under FAB
  alignItems: 'stretch',
  zIndex: 1000,
};

const linkStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
  color: '#9ca3af', // gray for inactive
  textDecoration: 'none',
  fontSize: 12,
};

const activeStyle: React.CSSProperties = {
  color: '#ffffff', // white for active
  fontWeight: 700,
};

const iconStyle: React.CSSProperties = {
  width: 24,
  height: 24,
  display: 'inline-block',
};

const containerStyle: React.CSSProperties = {
  position: 'relative',
};

const fabStyle: React.CSSProperties = {
  position: 'fixed',
  left: '50%',
  bottom: 30, // slightly out of tab bar
  transform: 'translateX(-50%)',
  width: 60,
  height: 60,
  borderRadius: '50%',
  background: '#ef4444', // red
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  boxShadow: '0 10px 20px rgba(239,68,68,.35)',
  border: 'none',
  zIndex: 1100,
};

function SvgIcon({ path, filled }: { path: string; filled: boolean }) {
  const color = filled ? '#ffffff' : '#9ca3af';
  return (
    <svg style={iconStyle} viewBox="0 0 24 24" fill={color} aria-hidden>
      <path d={path} />
    </svg>
  );
}

export default function TabBar() {
  const tabs = [
    { to: '/', label: 'Home', iconPath: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' }, // Home
    { to: '/leaders', label: 'Leaders', iconPath: 'M7 17v-7h4v7H7zm6 0V7h4v10h-4zM3 17v-4h4v4H3z' }, // Leaderboard
    { to: '/profile', label: 'Profile', iconPath: 'M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z' }, // Person
    { to: '/settings', label: 'Settings', iconPath: 'M19.14,12.94a7.43,7.43,0,0,0,.05-.94,7.43,7.43,0,0,0-.05-.94l2.11-1.65a.5.5,0,0,0,.12-.64l-2-3.46a.5.5,0,0,0-.6-.22l-2.49,1a7.16,7.16,0,0,0-1.63-.94l-.38-2.65A.5.5,0,0,0,12.78,2H9.22a.5.5,0,0,0-.5.42L8.34,5.07a7.16,7.16,0,0,0-1.63.94l-2.49-1a.5.5,0,0,0-.6.22l-2,3.46a.5.5,0,0,0,.12.64L3.86,11.06a7.43,7.43,0,0,0-.05.94,7.43,7.43,0,0,0,.05.94L1.75,14.59a.5.5,0,0,0-.12.64l2,3.46a.5.5,0,0,0,.6.22l2.49-1a7.16,7.16,0,0,0,1.63.94l.38,2.65a.5.5,0,0,0,.5.42h3.56a.5.5,0,0,0,.5-.42l.38-2.65a7.16,7.16,0,0,0,1.63-.94l2.49,1a.5.5,0,0,0,.6-.22l2-3.46a.5.5,0,0,0-.12-.64ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z' }, // Settings
  ];
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <button type="button" style={fabStyle} onClick={() => navigate('/rules')} aria-label="Start Game">
        {/* Play icon bigger */}
        <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      <nav style={barStyle} aria-label="Bottom Tabs">
        {/* Left two tabs */}
        {tabs.slice(0, 2).map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : null) })}
          >
            {({ isActive }) => (
              <>
                <SvgIcon path={t.iconPath} filled={isActive} />
                <span>{t.label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Middle empty slot reserved for the play FAB */}
        <div aria-hidden />

        {/* Right two tabs */}
        {tabs.slice(2).map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : null) })}
          >
            {({ isActive }) => (
              <>
                <SvgIcon path={t.iconPath} filled={isActive} />
                <span>{t.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
