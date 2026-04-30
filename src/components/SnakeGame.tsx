import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef(direction);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOccupied = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOccupied) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling behavior for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' || e.key === 'Enter') {
         if (gameOver) {
           resetGame();
         } else {
           setIsPaused(prev => !prev);
         }
         return;
      }

      if (gameOver || isPaused) return;

      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        directionRef.current = direction; // Update ref to match current accepted direction before move
        const head = prevSnake[0];
        const newHead = {
          x: head.x + direction.x,
          y: head.y + direction.y,
        };

        // Wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Self collision
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, isPaused, score, generateFood]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-fuchsia-500/5 pointer-events-none"></div>
      
      <div className="flex justify-between w-full mb-4 px-2 items-center z-10">
        <h2 className="text-xl font-mono text-cyan-400 tracking-widest uppercase drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">CYBER_SNAKE</h2>
        <div className="text-lg font-mono text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]">
          SCORE: {score.toString().padStart(4, '0')}
        </div>
      </div>

      <div 
        className="relative bg-black/60 border-2 border-cyan-500/50 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)_inset] overflow-hidden"
        style={{
          width: `${GRID_SIZE * 20}px`,
          height: `${GRID_SIZE * 20}px`,
        }}
      >
        {/* Grid lines pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(6,182,212,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.2) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={index}
              className="absolute"
              style={{
                left: `${segment.x * 20}px`,
                top: `${segment.y * 20}px`,
                width: '20px',
                height: '20px',
              }}
            >
              <div className={`w-full h-full rounded-sm m-[1px] ${isHead ? 'bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,1)]' : 'bg-cyan-600/80 shadow-[0_0_5px_rgba(8,145,178,0.5)]'}`} />
            </div>
          );
        })}

        <div
          className="absolute"
          style={{
            left: `${food.x * 20}px`,
            top: `${food.y * 20}px`,
            width: '20px',
            height: '20px',
          }}
        >
          <div className="w-[18px] h-[18px] m-[1px] bg-fuchsia-500 rounded-full shadow-[0_0_15px_rgba(217,70,239,1)] animate-pulse" />
        </div>

        {(gameOver || isPaused) && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-sm">
            <h3 className={`text-3xl font-mono mb-4 ${gameOver ? 'text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.8)]'}`}>
              {gameOver ? 'SYSTEM FAILURE' : 'SYSTEM PAUSED'}
            </h3>
            <button
              onClick={resetGame}
              className="px-6 py-2 border border-cyan-500 text-cyan-400 font-mono uppercase tracking-wider hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all rounded"
            >
              {gameOver ? 'Reboot System' : 'Resume'}
            </button>
            <p className="text-cyan-600/60 font-mono text-xs mt-4 uppercase">
              Press {gameOver ? 'Space/Enter' : 'Space'} to {gameOver ? 'restart' : 'resume'}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex gap-4 text-xs font-mono text-cyan-700/50 uppercase">
        <span>Use Arrow Keys to Navigate</span>
        <span>Space to Pause</span>
      </div>
    </div>
  );
}
