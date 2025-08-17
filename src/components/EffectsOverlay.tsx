import React from 'react'

export default function EffectsOverlay({ flash }: { flash: 'none'|'ok'|'err' }) {
  return (
    <div className="effects" style={{
      background: flash==='none' ? 'transparent' : flash==='ok' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.12)'
    }} />
  )
}