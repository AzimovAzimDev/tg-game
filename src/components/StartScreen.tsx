import React from 'react'
import { strings, Lang } from '@/i18n/strings'
import { STEPS } from '@/game/constants'

export default function StartScreen({ lang, onStart }: { lang: Lang; onStart: ()=>void }) {
  React.useEffect(()=>{
    const wa = (window as any).Telegram?.WebApp
    wa?.MainButton?.setText(strings.play[lang])
    wa?.MainButton?.show()
    const cb = () => onStart()
    wa?.MainButton?.onClick(cb)
    return () => wa?.MainButton?.offClick(cb)
  },[lang, onStart])
  return (
    <div className="center">
      <div className="card" style={{maxWidth:520, width:'100%'}}>
        <h1 style={{marginTop:0}}>{strings.title[lang]}</h1>
        <p><strong>{strings.rulesTitle[lang]}</strong></p>
        <ol className="checklist">
          {STEPS.map((s,i)=>(<li key={s.key} className="check-item">{i+1}. {s.label}</li>))}
        </ol>
        <div className="row" style={{marginTop:12}}>
          <button className="button" onClick={onStart}>{strings.play[lang]}</button>
        </div>
      </div>
    </div>
  )
}