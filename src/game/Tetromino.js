import { TETROMINOS, COLORS, PLAYFIELD_WIDTH } from '../config/constants.js';

export default class Tetromino {
  constructor(type) {
    this.type = type;
    this.shape = TETROMINOS[type];
    this.color = COLORS[type];
    this.x = type === 'I' || type === 'O' 
      ? Math.floor((PLAYFIELD_WIDTH - this.shape[0].length) / 2)
      : Math.floor((PLAYFIELD_WIDTH - this.shape[0].length) / 2) - 1;
    this.y = type === 'I' ? 19 : 20;
    this.rotation = 0;
  }

  rotate(direction) {
    const newShape = Array(this.shape.length).fill()
      .map(() => Array(this.shape[0].length).fill(0));

    if (direction === 1) { // clockwise
      for (let y = 0; y < this.shape.length; y++) {
        for (let x = 0; x < this.shape[0].length; x++) {
          newShape[x][this.shape.length - 1 - y] = this.shape[y][x];
        }
      }
    } else { // counter-clockwise
      for (let y = 0; y < this.shape.length; y++) {
        for (let x = 0; x < this.shape[0].length; x++) {
          newShape[this.shape[0].length - 1 - x][y] = this.shape[y][x];
        }
      }
    }

    this.shape = newShape;
  }

  getGhostPosition(board) {
    let ghostY = 0;
    while (!this.checkCollision(board, 0, ghostY)) {
      ghostY++;
    }
    return this.y + ghostY - 1;
  }

  checkCollision(board, offsetX = 0, offsetY = 0) {
    const newX = this.x + offsetX;
    const newY = this.y + offsetY;

    for (let y = 0; y < this.shape.length; y++) {
      for (let x = 0; x < this.shape[y].length; x++) {
        if (this.shape[y][x]) {
          const boardX = newX + x;
          const boardY = newY + y;
          
          if (
            boardX < 0 || 
            boardX >= board[0].length || 
            boardY >= board.length ||
            (boardY >= 0 && board[boardY][boardX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }
}