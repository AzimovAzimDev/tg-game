# Bug Hunt Mini-Game

A Telegram mini-game where players hunt and squash bugs within a time limit.

## Technology Stack

- **Game canvas**: HTML5 Canvas + Three.js
- **UI & Stats overlay**: React.js
- **Telegram integration**: Telegram Web App JavaScript API
- **Build tools**: Vite + pnpm

## Project Structure

- `/src/game/` – Three.js + canvas logic
- `/src/ui/` – React components for UI overlay
- `/public/` – Static assets (textures, sprites)

## Entry Points

- `index.html` loads the main entry point script
- `src/main.jsx` imports and initializes both the game and UI components
- `src/game/game.js` initializes Three.js scene
- `src/ui/ui.jsx` mounts React into a fixed DOM container

## Development

### Prerequisites

- Node.js (v14 or later)
- pnpm package manager
- Modern web browser

### Running the Game

1. Install dependencies:
   ```
   pnpm install
   ```

2. Start the development server:
   ```
   pnpm dev
   ```

3. Open the browser at the URL shown in the terminal (usually http://localhost:5173)
4. The game should display a rotating cube (placeholder) and the React UI overlay

### Building for Production

1. Build the project:
   ```
   pnpm build
   ```

2. The built files will be in the `dist` directory
3. You can preview the production build with:
   ```
   pnpm preview
   ```

## Canvas & Scene Setup

The game uses the following setup for its 3D environment:

1. **Canvas Sizing**:
   - Full-screen canvas that automatically adjusts to the Telegram Web App window
   - Responsive design with resize listeners to update camera and renderer

2. **Scene Background**:
   - 3D desktop texture applied to a large plane in the scene
   - CSS gradient background as a fallback/complement

3. **Camera & Lighting**:
   - Orthographic camera for 2D/2.5D effect
   - Low-angle perspective for depth
   - Ambient light for overall illumination
   - Soft directional light with shadows

### Next Steps for Development

1. Implement actual bug models and animations in Three.js
2. Add game mechanics for spawning and squashing bugs
3. Implement score tracking and game progression
4. Add sound effects and visual feedback
5. Integrate with Telegram Mini Apps API for sharing scores and leaderboards

## Telegram Integration

The game uses the Telegram Web App JavaScript API for integration with the Telegram platform. This includes:

- Haptic feedback when starting the game
- Potential for sharing scores and achievements
- Integration with Telegram's authentication and user data

## License

[Add your license information here]
