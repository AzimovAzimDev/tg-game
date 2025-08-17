export default function TelegramBridgeMock(): TelegramWebApp {
  const listeners: Record<string, Set<() => void>> = {}
  const mk = {
    initData: '',
    initDataUnsafe: { user: { id: 1, username: 'dev', language_code: 'en' } },
    colorScheme: 'dark',
    themeParams: { bg_color: '#0b0f12', text_color: '#e6f1ff', button_color: '#22d3ee', destructive_text_color: '#ef4444' },
    isExpanded: true,
    platform: 'macos',
    version: '0',
    ready() {},
    expand() {},
    enableClosingConfirmation() {},
    onEvent(e: string, cb: () => void) { (listeners[e] ??= new Set()).add(cb) },
    offEvent(e: string, cb: () => void) { listeners[e]?.delete(cb) },
    HapticFeedback: { impactOccurred() {}, notificationOccurred() {} },
    MainButton: { setText() {}, show() {}, hide() {}, onClick() {}, offClick() {} },
    BackButton: { show() {}, hide() {}, onClick() {}, offClick() {} },
    sendData(data: string) { console.log('[MOCK sendData]', data) },
  }
  return mk as unknown as TelegramWebApp
}