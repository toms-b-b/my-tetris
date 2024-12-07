import { 
  MIN_CELL_SIZE,
  COLORS, 
  PLAYFIELD_HEIGHT,
  PLAYFIELD_WIDTH,
  VISIBLE_HEIGHT,
  VISIBLE_NEXT_PIECES,
  GHOST_OPACITY,
  TETROMINOS 
} from '../config/constants.js';

export default class Renderer {
  constructor() {
    this.gameCanvas = document.getElementById('gameCanvas');
    this.holdCanvas = document.getElementById('holdCanvas');
    this.nextCanvas = document.getElementById('nextCanvas');
    
    this.gameCtx = this.gameCanvas.getContext('2d');
    this.holdCtx = this.holdCanvas.getContext('2d');
    this.nextCtx = this.nextCanvas.getContext('2d');
    
    this.cellSize = this.calculateCellSize();
    this.previewCellSize = this.cellSize * 0.8; // Scale down preview pieces
    
    this.initializeCanvases();
    window.addEventListener('resize', () => this.handleResize());
  }

  calculateCellSize() {
    const maxWidth = 0.6 * (window.innerWidth) - 40;
    const maxHeight = window.innerHeight - 40;
    
    const cellByWidth = Math.floor(maxWidth / PLAYFIELD_WIDTH);
    const cellByHeight = Math.floor(maxHeight / VISIBLE_HEIGHT);
    
    return Math.max(MIN_CELL_SIZE, Math.min(cellByWidth, cellByHeight));
  }

  handleResize() {
    this.cellSize = this.calculateCellSize();
    this.previewCellSize = this.cellSize * 1;
    this.initializeCanvases();
  }

  initializeCanvases() {
    // Main game canvas
    this.gameCanvas.width = this.cellSize * PLAYFIELD_WIDTH;
    this.gameCanvas.height = this.cellSize * VISIBLE_HEIGHT;
  
    // Hold piece canvas (4x4 grid)
    const holdContainer = document.querySelector('.hold-piece');
    if (holdContainer) {
      this.holdCanvas.width = holdContainer.offsetWidth;
      this.holdCanvas.height = holdContainer.offsetHeight;
    }
  
    // Next pieces canvas
    const nextContainer = document.querySelector('.next-pieces');
    if (nextContainer) {
      this.nextCanvas.width = nextContainer.offsetWidth;
      this.nextCanvas.height = nextContainer.offsetHeight;
    }
  }

  render(gameState) {
    this.clearCanvas(this.gameCtx);
    this.clearCanvas(this.holdCtx);
    this.clearCanvas(this.nextCtx);
    
    this.drawBoard(gameState.board);
    this.drawGhostPiece(gameState.ghostPiece);
    this.drawCurrentPiece(gameState.currentPiece);
    this.drawHoldPiece(gameState.holdPiece);
    this.drawNextPieces(gameState.bag.slice(0, VISIBLE_NEXT_PIECES));
    this.updateScore(gameState);
    
    if (gameState.gameOver) {
      this.drawGameOver();
    } else if (gameState.paused) {
      this.drawPaused();
    }
  }

  clearCanvas(ctx) {
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  drawBoard(board) {
    for (let y = PLAYFIELD_HEIGHT - VISIBLE_HEIGHT; y < PLAYFIELD_HEIGHT; y++) {
      for (let x = 0; x < PLAYFIELD_WIDTH; x++) {
        const cell = board.grid[y][x];
        if (cell) {
          this.drawCell(
            this.gameCtx,
            x * this.cellSize,
            (y - (PLAYFIELD_HEIGHT - VISIBLE_HEIGHT)) * this.cellSize,
            COLORS[cell],
            this.cellSize
          );
        }
      }
    }
    this.drawGrid();
  }

  drawGrid() {
    this.gameCtx.strokeStyle = COLORS.grid;
    this.gameCtx.lineWidth = 1;

    for (let x = 0; x <= PLAYFIELD_WIDTH; x++) {
      this.gameCtx.beginPath();
      this.gameCtx.moveTo(x * this.cellSize, 0);
      this.gameCtx.lineTo(x * this.cellSize, this.gameCanvas.height);
      this.gameCtx.stroke();
    }

    for (let y = 0; y <= VISIBLE_HEIGHT; y++) {
      this.gameCtx.beginPath();
      this.gameCtx.moveTo(0, y * this.cellSize);
      this.gameCtx.lineTo(this.gameCanvas.width, y * this.cellSize);
      this.gameCtx.stroke();
    }
  }

  drawCell(ctx, x, y, color, size) {
    const borderWidth = Math.max(1, size * 0.1);
    
    // Fill main color
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    
    // Draw lighter top/left edges
    ctx.fillStyle = this.adjustBrightness(color, 50);
    ctx.fillRect(x, y, size, borderWidth);
    ctx.fillRect(x, y, borderWidth, size);
    
    // Draw darker bottom/right edges
    ctx.fillStyle = this.adjustBrightness(color, -50);
    ctx.fillRect(x, y + size - borderWidth, size, borderWidth);
    ctx.fillRect(x + size - borderWidth, y, borderWidth, size);
  }

  adjustBrightness(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  drawCurrentPiece(piece) {
    if (!piece) return;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const drawX = (piece.x + x) * this.cellSize;
          const drawY = (piece.y - (PLAYFIELD_HEIGHT - VISIBLE_HEIGHT) + y) * this.cellSize;
          this.drawCell(this.gameCtx, drawX, drawY, COLORS[piece.type], this.cellSize);
        }
      }
    }
  }

  drawGhostPiece(ghost) {
    if (!ghost) return;
    
    const ghostColor = `${COLORS[ghost.type]}${Math.floor(GHOST_OPACITY * 255).toString(16).padStart(2, '0')}`;
    
    for (let y = 0; y < ghost.shape.length; y++) {
      for (let x = 0; x < ghost.shape[y].length; x++) {
        if (ghost.shape[y][x]) {
          const drawX = (ghost.x + x) * this.cellSize;
          const drawY = (ghost.y - (PLAYFIELD_HEIGHT - VISIBLE_HEIGHT) + y) * this.cellSize;
          this.drawCell(this.gameCtx, drawX, drawY, ghostColor, this.cellSize);
        }
      }
    }
  }

  drawHoldPiece(pieceType) {
    if (!pieceType) return;
    
    const shape = TETROMINOS[pieceType];
    const color = COLORS[pieceType];
    
    // Calculate the maximum size that fits in the canvas while maintaining aspect ratio
    const maxPieceWidth = shape[0].length * this.previewCellSize;
    const maxPieceHeight = shape.length * this.previewCellSize;
    
    // Center the piece in the canvas
    const offsetX = (this.holdCanvas.width - maxPieceWidth) / 2;
    const offsetY = (this.holdCanvas.height - maxPieceHeight) / 2;
    
    // Draw the piece
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          this.drawCell(
            this.holdCtx,
            offsetX + x * this.previewCellSize,
            offsetY + y * this.previewCellSize,
            color,
            this.previewCellSize
          );
        }
      }
    }
  }

  drawNextPieces(pieces) {
    if (!pieces.length) return;

    const totalPieces = pieces.length;
    const containerHeight = this.nextCanvas.height;
    const containerWidth = this.nextCanvas.width;
    
    // Calculate the height available for each piece including spacing
    const heightPerPiece = containerHeight / totalPieces;
    
    pieces.forEach((pieceType, index) => {
      const shape = TETROMINOS[pieceType];
      const color = COLORS[pieceType];
      
      // Calculate the maximum size that fits in the allocated space
      const maxPieceWidth = shape[0].length * this.previewCellSize;
      const maxPieceHeight = shape.length * this.previewCellSize;
      
      // Center the piece horizontally and position it vertically
      const offsetX = (containerWidth - maxPieceWidth) / 2;
      const offsetY = index * heightPerPiece + (heightPerPiece - maxPieceHeight) / 2;
      
      // Draw the piece
      for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
          if (shape[y][x]) {
            this.drawCell(
              this.nextCtx,
              offsetX + x * this.previewCellSize,
              offsetY + y * this.previewCellSize,
              color,
              this.previewCellSize
            );
          }
        }
      }
    });
  }

  updateScore(gameState) {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('lines').textContent = gameState.lines;
  }

  drawGameOver() {
    this.drawOverlay('GAME OVER');
  }

  drawPaused() {
    this.drawOverlay('PAUSED');
  }

  drawOverlay(text) {
    this.gameCtx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    this.gameCtx.fillRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
    
    this.gameCtx.fillStyle = '#fff';
    this.gameCtx.font = `${this.cellSize}px Arial`;
    this.gameCtx.textAlign = 'center';
    this.gameCtx.textBaseline = 'middle';
    this.gameCtx.fillText(
      text,
      this.gameCanvas.width / 2,
      this.gameCanvas.height / 2
    );
  }
}