// React UI Component for Bug Hunt Game
import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom/client';

// Telegram Web App API
const telegram = window.Telegram?.WebApp;

// Main UI Component
function GameUI() {
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(60);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [gameInstance, setGameInstance] = useState(null);

    // Listen for game events
    useEffect(() => {
        // Handle game ready event
        const handleGameReady = (event) => {
            console.log('Game is ready!');
            setGameInstance(event.detail.game);
        };

        // Handle bug squash event
        const handleBugSquash = () => {
            setScore(prevScore => prevScore + 1);
        };

        // Add event listeners
        window.addEventListener('gameReady', handleGameReady);
        window.addEventListener('bugSquash', handleBugSquash);

        return () => {
            // Remove event listeners
            window.removeEventListener('gameReady', handleGameReady);
            window.removeEventListener('bugSquash', handleBugSquash);
        };
    }, []);

    // Game timer
    useEffect(() => {
        let timer;

        if (gameStarted && !gameOver && time > 0) {
            timer = setInterval(() => {
                setTime((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
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
    }, [gameStarted, gameOver]);

    // Start game function
    const startGame = () => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setTime(60);

        // Dispatch game start event to notify the game component
        const gameStartEvent = new CustomEvent('gameStart');
        window.dispatchEvent(gameStartEvent);

        // Notify Telegram that the game has started
        if (telegram) {
            telegram.HapticFeedback.notificationOccurred('success');
        }
    };

    // Format time as MM:SS
    const formatTime = (seconds) => {
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
const root = ReactDOM.createRoot(document.getElementById('ui-container'));
root.render(
    <React.StrictMode>
        <GameUI />
    </React.StrictMode>
);
