import React from 'react'
import type { SpawnedTask } from '@/game/types'

export default function TaskGrid({ cols, rows, tasks, onTap }: {
  cols: number; rows: number; tasks: SpawnedTask[]; onTap: (id:number)=>void
}) {
  return (
    <div className="grid">
      <div className="grid-inner" style={{ gridTemplateColumns: `repeat(${cols},1fr)`, gridTemplateRows: `repeat(${rows},1fr)` }}>
        {Array.from({length: cols*rows}).map((_,i)=>{
          const cx = i % cols, cy = Math.floor(i/cols)
          const task = tasks.find(t => t.cellX===cx && t.cellY===cy)
          return (
            <div key={i} className="task" onClick={()=>task && onTap(task.id)}>
              {task && <div className="label">{labelFor(task.type)}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function labelFor(t: string){
  switch(t){
    case 'install': return 'Install deps 📦'
    case 'fix': return 'Fix bug 🐛'
    case 'merge': return 'Merge PR 🔀'
    case 'push': return 'Push to prod 🚀'
    default: return t
  }
}