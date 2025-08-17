import React from 'react'
import Mock from './TelegramBridgeMock'

type Ctx = { webapp: TelegramWebApp; mock: boolean }

const C = React.createContext<Ctx>({ webapp: ({} as any), mock: false })

export function TelegramBridgeProvider({ children }: { children: React.ReactNode }) {
  const [ctx] = React.useState<Ctx>(() => {
    const real = window.Telegram?.WebApp
    if (real) return { webapp: real, mock: false }
    const mock = Mock()
    return { webapp: mock, mock: true }
  })
  return <C.Provider value={ctx}>{children}</C.Provider>
}

export function useTelegramBridge() { return React.useContext(C) }