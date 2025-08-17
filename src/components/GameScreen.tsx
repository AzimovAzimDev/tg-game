import React from 'react'
import Checklist from '@/components/Checklist'
import TaskGrid from '@/components/TaskGrid'
import ScoreHUD from '@/components/ScoreHUD'
import TimerDangerBar from '@/components/TimerDangerBar'
import EffectsOverlay from '@/components/EffectsOverlay'
import { DEFAULT_CONFIG } from '@/game/config'
import { STEPS, type TaskType } from '@/game/constants'
import type { GameState, SpawnedTask } from '@/game/types'
import { mulberry32, seedFromStrings } from '@/utils/prng'
import { crc32 } from '@/utils/checksum'
import { sound } from '@/game/sound/SoundManager'

export default function GameScreen({ lang, onFinish }: { lang: 'en'|'ru'; onFinish: (payload:any)=>void }) {
  const cfg = DEFAULT_CONFIG
  const wa = (window as any).Telegram?.WebApp

  const seed = React.useMemo(()=>{
    const base = JSON.stringify(wa?.initDataUnsafe||{})
    return seedFromStrings(base, String(Date.now()))
  },[])
  const rnd = React.useMemo(()=>mulberry32(seed),[seed])

  const [state, setState] = React.useState<GameState>(()=>({
    timeLeftMs: cfg.sessionMs,
    score: 0,
    combo: 1,
    currentStepIndex: 0,
    completedDeploys: 0,
    mistakesCount: 0,
    lastTapAcceptedAt: 0,
    tasks: [],
    nextSpawnAt: 0,
  }))
  const [flash, setFlash] = React.useState<'none'|'ok'|'err'>('none')

  React.useEffect(()=>{ wa?.enableClosingConfirmation?.() },[])

  React.useEffect(()=>{
    let raf = 0
    let last = performance.now()

    function loop(){
      const now = performance.now()
      let dt = now - last
      last = now
      if (dt > 80) dt = 80 // clamp

      setState(prev => {
        let s = { ...prev }
        // Timer
        s.timeLeftMs = Math.max(0, s.timeLeftMs - dt)

        // Despawn expired
        const nowMs = cfg.sessionMs - s.timeLeftMs
        s.tasks = s.tasks.filter(t => t.expiresAtMs > nowMs)

        // Spawn
        if (nowMs >= s.nextSpawnAt && s.tasks.length < cfg.maxOnScreen) {
          const type = pickTaskType(rnd)
          const pos = pickFreeCell(rnd, cfg.gridCols, cfg.gridRows, s.tasks)
          const life = 3_000 + Math.floor(rnd()*1_000)
          const id = Math.floor(rnd()*1e9)
          s.tasks = [...s.tasks, { id, type, cellX: pos.x, cellY: pos.y, createdAtMs: nowMs, expiresAtMs: nowMs + life }]
          s.nextSpawnAt = nowMs + lerp(cfg.spawnIntervalMinMs, cfg.spawnIntervalMaxMs, rnd())
        }

        if (s.timeLeftMs <= 0) {
          // Finish
          const success = s.completedDeploys > 0
          const payload = makePayload({ state: s, cfg, seed, lang })
          onFinish(payload)
        }
        return s
      })

      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return ()=>cancelAnimationFrame(raf)
  },[])

  function handleTap(id: number){
    const now = performance.now()
    if (now - state.lastTapAcceptedAt < cfg.tapMinIntervalMs) return // anti-spam

    setState(prev => {
      const t = prev.tasks.find(x=>x.id===id)
      if (!t) return prev
      const need: TaskType = STEPS[prev.currentStepIndex].key
      const ok = t.type === need

      const tasks = prev.tasks.filter(x=>x.id!==id)
      let { score, combo, currentStepIndex, completedDeploys, mistakesCount } = prev

      if (ok) {
        combo = Math.min(cfg.comboCap, +(combo + cfg.comboIncrement).toFixed(1))
        score += Math.floor(cfg.pointsPerStep * combo)
        currentStepIndex++
        if (currentStepIndex >= STEPS.length) {
          currentStepIndex = 0
          completedDeploys++
          const bonus = Math.ceil((prev.timeLeftMs/1000) * cfg.timeBonusFactor)
          score += bonus
          // success effects
          setFlash('ok'); setTimeout(()=>setFlash('none'), 120)
          try { wa?.HapticFeedback?.notificationOccurred('success') } catch {}
          sound.play('success')
        } else {
          setFlash('ok'); setTimeout(()=>setFlash('none'), 80)
          try { wa?.HapticFeedback?.impactOccurred('light') } catch {}
          sound.play('tap')
        }
      } else {
        // mistake
        mistakesCount++
        const timeLeftMs = Math.max(0, prev.timeLeftMs - cfg.penaltyMs)
        combo = 1
        currentStepIndex = 0
        setFlash('err'); setTimeout(()=>setFlash('none'), 140)
        try { wa?.HapticFeedback?.notificationOccurred('error') } catch {}
        sound.play('error')
        return { ...prev, tasks, score, combo, currentStepIndex, completedDeploys, mistakesCount, lastTapAcceptedAt: now, timeLeftMs }
      }

      return { ...prev, tasks, score, combo, currentStepIndex, completedDeploys, mistakesCount, lastTapAcceptedAt: now }
    })
  }

  React.useEffect(()=>{
    const onFirst = () => sound.ensureLoaded()
    window.addEventListener('pointerdown', onFirst, { once: true })
    return () => window.removeEventListener('pointerdown', onFirst)
  },[])

  return (
    <div style={{position:'relative', height:'100%'}}>
      <div className="hud">
        <div className="box" style={{minWidth:140}}>
          <TimerDangerBar totalMs={cfg.sessionMs} leftMs={state.timeLeftMs} />
        </div>
        <div className="box"><Checklist current={state.currentStepIndex} /></div>
        <div className="box"><ScoreHUD score={state.score} combo={state.combo} /></div>
      </div>

      <div className="center" style={{paddingTop:72}}>
        <TaskGrid cols={cfg.gridCols} rows={cfg.gridRows} tasks={state.tasks} onTap={handleTap} />
      </div>

      <EffectsOverlay flash={flash} />
    </div>
  )
}

function lerp(a:number,b:number,t:number){ return a + (b-a)*t }

function pickTaskType(rnd: ()=>number): TaskType {
  const arr: TaskType[] = ['install','fix','merge','push']
  return arr[Math.floor(rnd()*arr.length)]
}

function pickFreeCell(rnd:()=>number, cols:number, rows:number, tasks: SpawnedTask[]) {
  const taken = new Set(tasks.map(t=>`${t.cellX},${t.cellY}`))
  const order: {x:number,y:number}[] = []
  for (let y=0;y<rows;y++) for (let x=0;x<cols;x++) order.push({x,y})
  // shuffle a little
  for (let i=order.length-1;i>0;i--){ const j = Math.floor(rnd()* (i+1)); [order[i],order[j]]=[order[j],order[i]] }
  return order.find(p=>!taken.has(`${p.x},${p.y}`)) || { x: 0, y: 0 }
}

function makePayload({ state, cfg, seed, lang }: { state: GameState; cfg:any; seed:number; lang:string }){
  const wa = (window as any).Telegram?.WebApp
  const base = {
    score: state.score,
    success: state.completedDeploys>0,
    durationMs: cfg.sessionMs,
    completedDeploys: state.completedDeploys,
    mistakes: state.mistakesCount,
    seed: seed.toString(16),
    clientVersion: '1.0.0',
    ts: Date.now(),
    userId: wa?.initDataUnsafe?.user?.id ?? 0,
    username: wa?.initDataUnsafe?.user?.username ?? 'unknown',
    lang,
  }
  const checksum = crc32(`${base.score}|${base.mistakes}|${base.durationMs}|${base.completedDeploys}|${base.seed}|${base.clientVersion}|${base.ts}`)
  return { ...base, checksum }
}