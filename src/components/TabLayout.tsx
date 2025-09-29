import React from 'react';
import { Outlet } from 'react-router-dom';
import TabBar from './TabBar';

const containerStyle: React.CSSProperties = {
  minHeight: '100svh',
  background: '#1D2129',
  color: '#e5e7eb',
  paddingBottom: 'calc(60px + var(--safe-area-inset-bottom))', // space for the tab bar
};

export default function TabLayout() {
  return (
    <div style={containerStyle}>
      <Outlet />
      {/* Always show on tabbed routes */}
      <TabBar />
    </div>
  );
}
