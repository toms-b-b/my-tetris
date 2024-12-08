import Board from './Board.js';
import { PieceManager } from './PieceManager.js';
import { KeyboardController } from './KeyboardController.js';
import { SCORING, LEVEL_SPEEDS, LOCK_DELAY } from '../config/constants.js';

export default class GameController {
  constructor(renderer) {
    this.renderer = renderer;
    this.keyboardController = null;
    this.reset();
    this.keyboardController = new KeyboardController(this);
  }

  reset() {
    this.board = new Board();
    this.pieceManager = new PieceManager();
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.gameOver = false;
    this.paused = false;
    this.lastMoveTime = 0;
    this.lockDelayTimer = null;
    this.dropInterval = LEVEL_SPEEDS[1];
    this.isLocking = false;
    this.gameLoopId = null;
    
    this.initializeGame();
  }

  initializeGame() {
    if (this.gameLoopId) {
      cancelAnimationFrame(this.gameLoopId);
      this.gameLoopId = null;
    }
    
    this.pieceManager.currentPiece = this.pieceManager.getNextPiece();
    this.pieceManager.updateGhostPiece(this.board);
    this.startGameLoop();
  }

  movePiece(dx, dy) {
    if (this.isLocking || this.gameOver) return false;
    
    const piece = this.pieceManager.currentPiece;
    if (!piece.checkCollision(this.board.grid, dx, dy)) {
      piece.x += dx;
      piece.y += dy;
      this.pieceManager.updateGhostPiece(this.board);
      
      if (this.lockDelayTimer) {
        clearTimeout(this.lockDelayTimer);
        this.lockDelayTimer = null;
      }
      return true;
    }
    
    if (dy > 0 && !this.lockDelayTimer && !this.isLocking) {
      this.startLockDelay();
    }
    return false;
  }

  startLockDelay() {
    if (this.lockDelayTimer || this.isLocking) return;
    
    this.isLocking = true;
    this.lockDelayTimer = setTimeout(() => {
      this.lockPiece();
      this.lockDelayTimer = null;
    }, LOCK_DELAY);
  }

  rotatePiece(direction) {
    if (this.isLocking || this.gameOver) return;
    
    const piece = this.pieceManager.currentPiece;
    const originalShape = piece.shape.map(row => [...row]);
    piece.rotate(direction);
    
    if (piece.checkCollision(this.board.grid)) {
      piece.shape = originalShape;
    } else {
      this.pieceManager.updateGhostPiece(this.board);
      
      if (this.lockDelayTimer) {
        clearTimeout(this.lockDelayTimer);
        this.lockDelayTimer = null;
        this.isLocking = false;
      }
    }
  }

  hardDrop() {
    if (this.isLocking || this.gameOver) return;
    
    if (this.lockDelayTimer) {
      clearTimeout(this.lockDelayTimer);
      this.lockDelayTimer = null;
    }
    
    let dropDistance = 0;
    while (this.movePiece(0, 1)) {
      dropDistance++;
    }
    
    this.score += dropDistance * SCORING.HARD_DROP;
    this.isLocking = true;
    this.lockPiece();
  }

  holdPiece() {
    if (this.isLocking || this.gameOver) return;
    
    if (this.pieceManager.holdCurrentPiece()) {
      if (this.lockDelayTimer) {
        clearTimeout(this.lockDelayTimer);
        this.lockDelayTimer = null;
        this.isLocking = false;
      }
      this.pieceManager.updateGhostPiece(this.board);
    }
  }

  lockPiece() {
    if (!this.isLocking) return;
    
    this.board.addPiece(this.pieceManager.currentPiece);
    const linesCleared = this.board.clearLines();
    this.updateScore(linesCleared);
    
    if (this.lockDelayTimer) {
      clearTimeout(this.lockDelayTimer);
      this.lockDelayTimer = null;
    }
    
    this.isLocking = false;
    
    this.pieceManager.currentPiece = this.pieceManager.getNextPiece();
    this.pieceManager.resetHoldAbility();
    
    if (this.pieceManager.currentPiece.checkCollision(this.board.grid)) {
      this.gameOver = true;
    }
    
    this.pieceManager.updateGhostPiece(this.board);
  }

  updateScore(linesCleared) {
    switch (linesCleared) {
      case 1:
        this.score += SCORING.SINGLE * this.level;
        break;
      case 2:
        this.score += SCORING.DOUBLE * this.level;
        break;
      case 3:
        this.score += SCORING.TRIPLE * this.level;
        break;
      case 4:
        this.score += SCORING.TETRIS * this.level;
        break;
    }
    
    this.lines += linesCleared;
    const newLevel = Math.floor(this.lines / 10) + 1;
    
    if (newLevel !== this.level) {
      this.level = newLevel;
      this.dropInterval = LEVEL_SPEEDS[this.level] || LEVEL_SPEEDS[10];
    }
  }

  togglePause() {
    this.paused = !this.paused;
  }

  update(timestamp) {
    if (this.gameOver) return;

    if (this.paused) {
      this.renderer.render(this.getGameState());
      return;
    }

    const deltaTime = timestamp - this.lastMoveTime;
    
    if (deltaTime > this.dropInterval) {
      if (!this.movePiece(0, 1)) {
        if (!this.lockDelayTimer && !this.isLocking) {
          this.startLockDelay();
        }
      }
      this.lastMoveTime = timestamp;
    }
  }

  getGameState() {
    return {
      board: this.board,
      currentPiece: this.pieceManager.currentPiece,
      ghostPiece: this.pieceManager.ghostPiece,
      holdPiece: this.pieceManager.holdPiece,
      bag: this.pieceManager.bag,
      score: this.score,
      level: this.level,
      lines: this.lines,
      gameOver: this.gameOver,
      paused: this.paused
    };
  }

  startGameLoop() {
    const gameLoop = (timestamp) => {
      this.update(timestamp);
      this.renderer.render(this.getGameState());
      this.gameLoopId = requestAnimationFrame(gameLoop);
    };
    this.gameLoopId = requestAnimationFrame(gameLoop);
  }
}