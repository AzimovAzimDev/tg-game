// Minimal Telegram WebApp types
interface TelegramWebAppInitDataUnsafe {
  user?: { id: number; username?: string; language_code?: string };
}

interface TelegramWebAppThemeParams {
  bg_color?: string; text_color?: string; hint_color?: string; link_color?: string; button_color?: string; button_text_color?: string;
  secondary_bg_color?: string; section_bg_color?: string; section_header_text_color?: string; accent_text_color?: string; destructive_text_color?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: TelegramWebAppInitDataUnsafe;
  colorScheme: 'light' | 'dark' | string;
  themeParams: TelegramWebAppThemeParams;
  isExpanded: boolean;
  platform: string;
  version: string;
  ready(): void;
  expand(): void;
  enableClosingConfirmation(): void;
  onEvent(event: string, cb: () => void): void;
  offEvent(event: string, cb: () => void): void;
  HapticFeedback?: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | string) => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning' | string) => void;
  };
  MainButton: { setText(t: string): void; show(): void; hide(): void; onClick(cb: () => void): void; offClick(cb: () => void): void };
  BackButton: { show(): void; hide(): void; onClick(cb: () => void): void; offClick(cb: () => void): void };
  sendData(data: string): void;
}

interface TelegramWindow extends Window { Telegram?: { WebApp?: TelegramWebApp } }
declare const window: TelegramWindow;