# Deploy or Die — Telegram Mini App

TypeScript + React (Vite). No external services. Integrates with Telegram WebApp API for theming, haptics, and result submission via `WebApp.sendData`.

## Run locally

```bash
pnpm i
pnpm dev
```

The app uses a Telegram WebApp mock if `window.Telegram.WebApp` is not present.

## Build

```bash
pnpm build
pnpm preview
```

## Assets

Place small WAV/OGG SFX files in `public/sfx/`:
- `tap.wav`
- `error.wav`
- `success.wav`

## Telegram integration
- On real Telegram, the app reads `themeParams`, calls `ready()` and `expand()`.
- Results screen triggers `WebApp.sendData(JSON.stringify(ResultPayload))`.

## Config
Adjust `src/game/config.ts` for session length, spawn cadence, grid size, and scoring.

## Anti-cheat
- Uses `performance.now()` for timing.
- Frame delta clamped to 80ms.
- Tap anti-spam: 150ms.
- Seeded PRNG for spawns.
- Client checksum via CRC32.
