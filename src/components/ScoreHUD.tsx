import React from 'react'

export default function ScoreHUD({ score, combo }: { score: number; combo: number }) {
  return (
    <div className="row">
      <div className="box">🏆 {score}</div>
      <div className="box">x{combo.toFixed(1)}</div>
    </div>
  )
}