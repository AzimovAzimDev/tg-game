// React UI Component for Bug Hunt Game
import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BugHuntGame } from '../game/game';

// Telegram WebApp interface
interface TelegramWebApp {
  HapticFeedback?: {
    notificationOccurred: (type: string) => void;
  };
}

// Game Ready Event interface
interface GameReadyEvent extends Event {
  detail: {
    game: BugHuntGame;
  };
}

// Telegram Web App API
const telegram = window.Telegram?.WebApp as TelegramWebApp | undefined;

// Main UI Component
function GameUI(): JSX.Element {
    const [score, setScore] = useState<number>(0);
    const [time, setTime] = useState<number>(60);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [gameInstance, setGameInstance] = useState<BugHuntGame | null>(null);

    // Listen for game ready event
    useEffect(() => {
        const handleGameReady = (event: Event) => {
            console.log('Game is ready!');
            const gameEvent = event as GameReadyEvent;
            setGameInstance(gameEvent.detail.game);
        };

        window.addEventListener('gameReady', handleGameReady);

        return () => {
            window.removeEventListener('gameReady', handleGameReady);
        };
    }, []);

    // Game timer
    useEffect(() => {
        let timer: number | undefined;

        if (gameStarted && !gameOver && time > 0) {
            timer = window.setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime <= 1) {
                        if (timer) clearInterval(timer);
                        setGameOver(true);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);
        }

        return () => {
            if (timer) clearInterval(timer);
        };
    }, [gameStarted, gameOver, time]);

    // Start game function
    const startGame = (): void => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setTime(60);

        // Notify Telegram that the game has started
        if (telegram?.HapticFeedback) {
            telegram.HapticFeedback.notificationOccurred('success');
        }
    };

    // Format time as MM:SS
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="game-ui">
            {/* Header with score and time */}
            <div className="game-header">
                <div className="score">Score: {score}</div>
                <div className="time">Time: {formatTime(time)}</div>
            </div>

            {/* Game start screen */}
            {!gameStarted && !gameOver && (
                <div className="start-screen">
                    <h1>Bug Hunt</h1>
                    <p>Find and squash as many bugs as you can in 60 seconds!</p>
                    <button onClick={startGame}>Start Game</button>
                </div>
            )}

            {/* Game over screen */}
            {gameOver && (
                <div className="game-over-screen">
                    <h1>Game Over!</h1>
                    <p>Your score: {score}</p>
                    <button onClick={startGame}>Play Again</button>
                </div>
            )}
        </div>
    );
}

// Mount React component to the UI container
const root = ReactDOM.createRoot(document.getElementById('ui-container') as HTMLElement);
root.render(
    <React.StrictMode>
        <GameUI />
    </React.StrictMode>
);