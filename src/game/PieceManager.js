import Tetromino from './Tetromino.js';

export class PieceManager {
  constructor() {
    this.currentPiece = null;
    this.holdPiece = null;
    this.ghostPiece = null;
    this.canHold = true;
    this.bag = [];
  }

  fillBag() {
    if (this.bag.length <= 7) {
      const pieces = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      const newBag = [...pieces].sort(() => Math.random() - 0.5);
      this.bag = [...this.bag, ...newBag];
    }
  }

  getNextPiece() {
    this.fillBag();
    return new Tetromino(this.bag.shift());
  }

  updateGhostPiece(board) {
    if (!this.currentPiece) return;
    
    this.ghostPiece = new Tetromino(this.currentPiece.type);
    this.ghostPiece.x = this.currentPiece.x;
    this.ghostPiece.shape = this.currentPiece.shape.map(row => [...row]);
    this.ghostPiece.y = this.currentPiece.getGhostPosition(board.grid);
  }

  holdCurrentPiece() {
    if (!this.canHold) return false;
    
    const currentType = this.currentPiece.type;
    
    if (this.holdPiece === null) {
      this.holdPiece = currentType;
      this.currentPiece = this.getNextPiece();
    } else {
      const newPiece = new Tetromino(this.holdPiece);
      this.holdPiece = currentType;
      this.currentPiece = newPiece;
    }
    
    this.canHold = false;
    return true;
  }

  resetHoldAbility() {
    this.canHold = true;
  }
}