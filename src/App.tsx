import React from 'react'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { TelegramBridgeProvider, useTelegramBridge } from '@/bridge/TelegramBridge'
import StartScreen from '@/components/StartScreen'
import GameScreen from '@/components/GameScreen'
import ResultsScreen from '@/components/ResultsScreen'
import { strings, Lang } from '@/i18n/strings'

export type Phase = 'idle' | 'ready' | 'playing' | 'results'

export default function App() {
  return (
    <TelegramBridgeProvider>
      <ThemeProvider>
        <InnerApp />
      </ThemeProvider>
    </TelegramBridgeProvider>
  )
}

function InnerApp() {
  const { webapp, mock } = useTelegramBridge()
  const [phase, setPhase] = React.useState<Phase>('idle')
  const [lang, setLang] = React.useState<Lang>('en')
  const [lastResult, setLastResult] = React.useState<any | null>(null)

  React.useEffect(() => {
    // Init Telegram
    webapp.ready()
    webapp.expand()
    setPhase('ready')
    const lc = webapp.initDataUnsafe.user?.language_code?.startsWith('ru') ? 'ru' : 'en'
    setLang(lc)
  }, [webapp])

  return (
    <div className="app">
      {phase === 'ready' && (
        <StartScreen lang={lang} onStart={() => setPhase('playing')} />
      )}
      {phase === 'playing' && (
        <GameScreen
          lang={lang}
          onFinish={(payload) => {
            setLastResult(payload)
            setPhase('results')
          }}
        />
      )}
      {phase === 'results' && (
        <ResultsScreen
          lang={lang}
          result={lastResult}
          onRestart={() => setPhase('playing')}
          onSend={() => {
            try { webapp.sendData(JSON.stringify(lastResult)) } catch {}
          }}
        />
      )}
      {mock && (
        <div className="mock-badge">DEV MOCK</div>
      )}
    </div>
  )
}