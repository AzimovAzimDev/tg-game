import React from 'react'

export default function SoundToggle({ muted, onToggle }:{ muted:boolean; onToggle:()=>void }){
  return <button className="button secondary" onClick={onToggle}>{muted?'🔇':'🔊'}</button>
}