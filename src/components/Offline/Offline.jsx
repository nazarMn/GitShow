import React, { useState, useEffect } from "react";
import "./Offline.css";

const TicTacToe = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState("X"); // Гравець завжди X
  const [winner, setWinner] = useState(null);
  const [stats, setStats] = useState({ wins: 0, losses: 0, draws: 0 });
  const [error, setError] = useState("");
  const [isGameOver, setIsGameOver] = useState(false); 

  // Визначення онлайн-статусу
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Перевірка переможця
  const checkWinner = (newBoard) => {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (newBoard[a] && newBoard[a] === newBoard[b] && newBoard[a] === newBoard[c]) {
        return newBoard[a];
      }
    }
    return newBoard.includes(null) ? null : "Draw";
  };

  // Minimax algorithm to calculate the best move for AI
  const minimax = (board, depth, isMaximizing) => {
    const winner = checkWinner(board);
    if (winner === "X") return -10;  // Player X wins
    if (winner === "O") return 10;   // AI (O) wins
    if (winner === "Draw") return 0; // It's a draw

    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "O";  // AI move
          best = Math.max(best, minimax(board, depth + 1, false));
          board[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "X";  // Player move
          best = Math.min(best, minimax(board, depth + 1, true));
          board[i] = null;
        }
      }
      return best;
    }
  };

  // Function to get the best move for AI
  const getBestMove = (board) => {
    let bestVal = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === null) {
        board[i] = "O";  // AI move
        const moveVal = minimax(board, 0, false);
        board[i] = null;
        if (moveVal > bestVal) {
          bestMove = i;
          bestVal = moveVal;
        }
      }
    }
    return bestMove;
  };

  // Хід комп'ютера з затримкою
  const aiMove = () => {
    if (player === "O" && !isGameOver) {
      setTimeout(() => {
        const bestMove = getBestMove(board);
        handleClick(bestMove);
      }, 1000); 
    }
  };

  // Обробка кліку по клітинці
  const handleClick = (index) => {
    if (board[index] || winner || isGameOver) return; // Перевірка на завершення гри
    try {
      const newBoard = [...board];
      newBoard[index] = player;
      const gameResult = checkWinner(newBoard);
      setBoard(newBoard);
      setWinner(gameResult);
      if (gameResult) {
        if (gameResult === "X") setStats((prev) => ({ ...prev, wins: prev.wins + 1 }));
        if (gameResult === "O") setStats((prev) => ({ ...prev, losses: prev.losses + 1 }));
        if (gameResult === "Draw") setStats((prev) => ({ ...prev, draws: prev.draws + 1 }));
        setIsGameOver(true); // Гра завершена
      }
      if (!gameResult) setPlayer(player === "X" ? "O" : "X");
    } catch (err) {
      setError("An error occurred while making a move. Please try again.");
    }
  };

  // Скидання гри
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setPlayer("X");
    setWinner(null);
    setError("");
    setIsGameOver(false); // Скидаємо статус завершення гри
  };

  useEffect(() => {
    if (player === "O" && !isGameOver) {
      aiMove(); // Запускаємо хід комп'ютера, якщо це його черга
    }
  }, [player, isGameOver]);

  return (
    <div className="game-container">
      <div className="error-container">
        <h2 className="error-message">Error 500: No Internet</h2>
      </div>
      {error && <h2 className="error-message">{error}</h2>}
      <h1 className="game-title">Tic Tac Toe</h1>
      <div className="stats">
        <p>Wins: {stats.wins} | Losses: {stats.losses} | Draws: {stats.draws}</p>
      </div>
      <div className="board">
        {board.map((cell, index) => (
          <button key={index} onClick={() => handleClick(index)} className="cell">
            {cell}
          </button>
        ))}
      </div>
      {winner && <h2 className="winner-message">{winner === "Draw" ? "It's a draw!" : `Winner: ${winner}`}</h2>}
      <button onClick={resetGame} className="restart-btn">Restart</button>
    </div>
  );
};

export default TicTacToe;
