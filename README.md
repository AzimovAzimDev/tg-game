# Bug Hunt Mini-Game

A Telegram mini-game where players hunt and squash bugs within a time limit.

## Technology Stack

- **Game canvas**: HTML5 Canvas + Three.js
- **UI & Stats overlay**: React.js
- **Language**: TypeScript
- **Telegram integration**: Telegram Web App JavaScript API
- **Build tools**: Vite + pnpm

## Project Structure

- `/src/game/` – Three.js + canvas logic
- `/src/ui/` – React components for UI overlay
- `/public/` – Static assets (textures, sprites)

## Entry Points

- `index.html` loads the main entry point script
- `src/main.tsx` imports and initializes both the game and UI components
- `src/game/game.ts` initializes Three.js scene
- `src/ui/ui.tsx` mounts React into a fixed DOM container

## Development

### Prerequisites

- Node.js (v14 or later)
- pnpm package manager
- TypeScript
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
4. The game will load showing a start screen with a "Start Game" button

### TypeScript Configuration

The project uses TypeScript with "soft" settings to allow for gradual type adoption:

- Non-strict type checking
- JavaScript files are allowed
- Implicit any types are permitted
- React JSX support is enabled

The TypeScript configuration is split into two files:
- `tsconfig.json` - Main TypeScript configuration
- `tsconfig.node.json` - Configuration for Vite and Node.js environment

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

## File Icon System

The game includes a system for spawning and managing file icons:

1. **Icon Types**:
   - Folders (blue)
   - Documents (white)
   - Terminal windows (dark gray)
   - IDE/code editors (purple)
   - Each icon type has a unique texture and color

2. **Icon Layout**:
   - Random distribution within defined world boundaries
   - Icons are positioned slightly above the desktop plane
   - Each icon has a slight tilt and random rotation for visual variety

3. **Dynamic Recycling**:
   - Icons that move beyond the visible area are recycled
   - Recycled icons are repositioned to new random locations
   - This creates an infinite scrolling effect as the player moves

## Bug Entities & Movement

The game features a bug hunting system with the following components:

1. **Bug Model**:
   - 2D/3D sprite with a reddish texture
   - Bugs hover slightly above the desktop plane
   - Visual rotation to face movement direction

2. **Spawn Logic**:
   - Interval timer creates new bugs every 1.5 seconds
   - Bugs spawn at random file icon positions
   - Maximum number of bugs is limited to prevent overwhelming the player
   - Spawning only occurs when the game is active

3. **Movement Behavior**:
   - Each bug targets the nearest undamaged file icon
   - Bugs move toward their target at varying speeds
   - Random jitter is added to movement for unpredictability
   - When a bug reaches an icon, it "damages" it (turns it red)
   - After damaging an icon, the bug finds a new target

4. **Despawn Mechanics**:
   - Bugs can be clicked/tapped to "squash" them
   - Squashed bugs are removed from the game and increase the player's score
   - Bugs that move beyond the world boundaries are automatically removed
   - All bugs are cleared when the game ends

### Next Steps for Development

1. Implement score tracking and game progression
2. Add sound effects and visual feedback
3. Integrate with Telegram Mini Apps API for sharing scores and leaderboards

## How to Play

The Bug Hunt game is a fast-paced bug squashing challenge. Here's how to play:

1. **Starting the Game**:
   - When you first load the game, you'll see a start screen with a "Start Game" button
   - Click the "Start Game" button to begin playing
   - The timer will start counting down from 60 seconds

2. **Gameplay**:
   - Bugs will appear randomly on the screen, moving toward file icons
   - Click/tap on the bugs to squash them and earn points
   - Each squashed bug adds 1 point to your score
   - If a bug reaches a file icon, it will "damage" the icon (turn it red)
   - Try to squash as many bugs as possible before the time runs out

3. **Game End**:
   - The game ends when the 60-second timer reaches zero
   - Your final score will be displayed on the game over screen
   - Click "Play Again" to start a new game

4. **Objective**:
   - Achieve the highest score possible by squashing as many bugs as you can
   - Protect the file icons from being damaged by bugs

## Telegram Integration

The game uses the Telegram Web App JavaScript API for integration with the Telegram platform. This includes:

- Haptic feedback when starting the game
- Potential for sharing scores and achievements
- Integration with Telegram's authentication and user data

## License

[Add your license information here]
