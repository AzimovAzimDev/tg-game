import { NavLink, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelectModal from './LanguageSelectModal';

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
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  padding: 0,
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
  const { t } = useTranslation();
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const tabs: ({ to?: string; label: string; iconPath: string; onClick?: () => void; })[] = [
    { to: '/', label: t('tabs.home'), iconPath: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' }, // Home
    { to: '/leaders', label: t('tabs.results'), iconPath: 'M7 17v-7h4v7H7zm6 0V7h4v10h-4zM3 17v-4h4v4H3z' }, // Leaderboard
    { to: '/profile', label: t('tabs.profile'), iconPath: 'M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z' }, // Person
    {
      label: t('tabs.language'),
      iconPath: 'M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z',
      onClick: () => setLanguageModalOpen(true),
    },
  ];
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <LanguageSelectModal isOpen={languageModalOpen} onClose={() => setLanguageModalOpen(false)} />
      <button type="button" style={fabStyle} onClick={() => navigate('/rules')} aria-label={t('tabs.startGameAria')}>
        {/* Play icon bigger */}
        <svg width="44" height="44" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>

      <nav style={barStyle} aria-label={t('tabs.bottomTabsAria')}>
        {/* Left two tabs */}
        {tabs.slice(0, 2).map((t) => (
          <NavLink
            key={t.label}
            to={t.to!}
            end={t.to === '/'}
            style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}
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
        {tabs.slice(2).map((t) => {
          if (t.to) {
            return (
              <NavLink
                key={t.label}
                to={t.to}
                end={t.to === '/'}
                style={({ isActive }) => ({ ...linkStyle, ...(isActive ? activeStyle : {}) })}
              >
                {({ isActive }) => (
                  <>
                    <SvgIcon path={t.iconPath} filled={isActive} />
                    <span>{t.label}</span>
                  </>
                )}
              </NavLink>
            );
          }
          return (
            <button
              key={t.label}
              type="button"
              style={linkStyle}
              onClick={t.onClick}
            >
              <SvgIcon path={t.iconPath} filled={false} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
