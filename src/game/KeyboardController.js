export class KeyboardController {
  constructor(gameController) {
    this.gameController = gameController;
    this.setupInputHandlers();
  }

  setupInputHandlers() {
    document.addEventListener('keydown', (event) => {
      if (this.gameController.gameOver || this.gameController.paused) return;

      switch (event.code) {
        case 'ArrowLeft':
          this.gameController.movePiece(-1, 0);
          break;
        case 'ArrowRight':
          this.gameController.movePiece(1, 0);
          break;
        case 'ArrowDown':
          this.gameController.movePiece(0, 1);
          this.gameController.score += 1; // SCORING.SOFT_DROP
          break;
        case 'ArrowUp':
        case 'KeyX':
          this.gameController.rotatePiece(1);
          break;
        case 'KeyZ':
        case 'ControlLeft':
          this.gameController.rotatePiece(-1);
          break;
        case 'Space':
          this.gameController.hardDrop();
          break;
        case 'ShiftLeft':
        case 'KeyC':
          this.gameController.holdPiece();
          break;
        case 'Escape':
        case 'F1':
          this.gameController.togglePause();
          break;
      }
    });
  }
}