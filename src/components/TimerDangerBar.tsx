import React from 'react'

export default function TimerDangerBar({ totalMs, leftMs }: { totalMs: number; leftMs: number }) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  React.useEffect(()=>{
    const c = ref.current!; const ctx = c.getContext('2d')!
    let raf = 0
    function draw(){
      const dpr = window.devicePixelRatio || 1
      const w = c.clientWidth, h = c.clientHeight
      if (c.width!==w*dpr || c.height!==h*dpr) { c.width=w*dpr; c.height=h*dpr; ctx.scale(dpr,dpr) }
      ctx.clearRect(0,0,w,h)
      const p = Math.max(0, Math.min(1, leftMs/totalMs))
      const danger = leftMs < 10_000
      ctx.fillStyle = danger ? '#ef4444' : '#22d3ee'
      const pulse = danger ? (0.9 + 0.1*Math.sin(performance.now()/150)) : 1
      ctx.fillRect(1,1, Math.max(0,(w-2)*p*pulse), h-2)
      ctx.strokeStyle = '#1f273a'; ctx.strokeRect(0.5,0.5,w-1,h-1)
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return ()=>cancelAnimationFrame(raf)
  },[totalMs, leftMs])
  return <canvas className="timer-canvas" ref={ref} />
}