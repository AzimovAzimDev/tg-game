import React from 'react'
import { STEPS } from '@/game/constants'

export default function Checklist({ current }: { current: number }) {
  return (
    <div className="checklist">
      {STEPS.map((s,i)=> (
        <div key={s.key} className={`check-item ${i===current?'active':''}`}>{i+1}. {s.label}</div>
      ))}
    </div>
  )
}