import React from 'react'
import { strings, Lang } from '@/i18n/strings'

export default function ResultsScreen({ lang, result, onRestart, onSend }: { lang: Lang; result: any; onRestart: ()=>void; onSend: ()=>void }) {
  const win = result?.completedDeploys > 0
  const memelines = strings.memelines[lang]
  const meme = memelines[Math.floor(Math.random()*memelines.length)]

  React.useEffect(()=>{
    const wa = (window as any).Telegram?.WebApp
    wa?.MainButton?.setText(strings.send[lang])
    wa?.MainButton?.show()
    const cb = () => onSend()
    wa?.MainButton?.onClick(cb)
    return () => wa?.MainButton?.offClick(cb)
  },[lang, onSend])

  return (
    <div className="center">
      <div className="results card">
        <h2 style={{marginTop:0}}>{win? strings.victory[lang] : strings.tryAgain[lang]}</h2>
        <div>🏆 {strings.score[lang]}: <strong>{result?.score ?? 0}</strong></div>
        <div>✅ Deploys: <strong>{result?.completedDeploys ?? 0}</strong></div>
        <div>⚠️ {strings.mistakes[lang]}: <strong>{result?.mistakes ?? 0}</strong></div>
        <div style={{opacity:.8}}>{meme}</div>
        <div className="row" style={{marginTop:8}}>
          <button className="button" onClick={onRestart}>{strings.restart[lang]}</button>
          <button className="button secondary" onClick={onSend}>{strings.send[lang]}</button>
        </div>
        <div style={{opacity:.5, fontSize:12, marginTop:8}}>v1.0.0</div>
      </div>
    </div>
  )
}