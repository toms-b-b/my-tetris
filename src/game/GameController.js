import Board from './Board.js';
import { PieceManager } from './PieceManager.js';
import { KeyboardController } from './KeyboardController.js';
import { SCORING, LEVEL_SPEEDS, LOCK_DELAY } from '../config/constants.js';

export default class GameController {
  constructor(renderer) {
    this.board = new Board();
    this.renderer = renderer;
    this.pieceManager = new PieceManager();
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.gameOver = false;
    this.paused = false;
    this.lastMoveTime = 0;
    this.lockDelayTimer = null;
    this.dropInterval = LEVEL_SPEEDS[1];
    
    this.initializeGame();
    new KeyboardController(this);
  }

  initializeGame() {
    this.pieceManager.currentPiece = this.pieceManager.getNextPiece();
    this.pieceManager.updateGhostPiece(this.board);
    this.startGameLoop();
  }

  movePiece(dx, dy) {
    const piece = this.pieceManager.currentPiece;
    if (!piece.checkCollision(this.board.grid, dx, dy)) {
      piece.x += dx;
      piece.y += dy;
      this.pieceManager.updateGhostPiece(this.board);
      return true;
    }
    return false;
  }

  rotatePiece(direction) {
    const piece = this.pieceManager.currentPiece;
    const originalShape = piece.shape.map(row => [...row]);
    piece.rotate(direction);
    
    if (piece.checkCollision(this.board.grid)) {
      piece.shape = originalShape;
    } else {
      this.pieceManager.updateGhostPiece(this.board);
    }
  }

  hardDrop() {
    while (this.movePiece(0, 1)) {
      this.score += SCORING.HARD_DROP;
    }
    this.lockPiece();
  }

  holdPiece() {
    if (this.pieceManager.holdCurrentPiece()) {
      this.pieceManager.updateGhostPiece(this.board);
    }
  }

  lockPiece() {
    this.board.addPiece(this.pieceManager.currentPiece);
    const linesCleared = this.board.clearLines();
    this.updateScore(linesCleared);
    
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
      this.renderer.render({
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
      });
      return;
    }

    const deltaTime = timestamp - this.lastMoveTime;
    
    if (deltaTime > this.dropInterval) {
      if (!this.movePiece(0, 1)) {
        if (!this.lockDelayTimer) {
          this.lockDelayTimer = setTimeout(() => {
            this.lockPiece();
            this.lockDelayTimer = null;
          }, LOCK_DELAY);
        }
      } else {
        if (this.lockDelayTimer) {
          clearTimeout(this.lockDelayTimer);
          this.lockDelayTimer = null;
        }
      }
      this.lastMoveTime = timestamp;
    }
  }

  startGameLoop() {
    const gameLoop = (timestamp) => {
      console.log('Game loop running', { paused: this.paused });
      this.update(timestamp);
      this.renderer.render({
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
      });
      requestAnimationFrame(gameLoop);
    };
    requestAnimationFrame(gameLoop);
  }
}