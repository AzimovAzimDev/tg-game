import React from 'react'

function applyTheme(params: any) {
  const r = document.documentElement
  if (!params) return
  const map: Record<string,string|undefined> = {
    '--bg': params.bg_color,
    '--text': params.text_color,
    '--hint': params.hint_color,
    '--accent': params.button_color,
    '--danger': params.destructive_text_color,
  }
  for (const [k,v] of Object.entries(map)) if (v) r.style.setProperty(k, v)
}

export const ThemeContext = React.createContext({})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const wa = (window as any).Telegram?.WebApp
    if (wa?.themeParams) applyTheme(wa.themeParams)
    const onChange = () => applyTheme(wa.themeParams)
    wa?.onEvent?.('themeChanged', onChange)
    return () => wa?.offEvent?.('themeChanged', onChange)
  }, [])
  return <>{children}</>
}