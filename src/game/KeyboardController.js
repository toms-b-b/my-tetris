export class KeyboardController {
  constructor(gameController) {
    this.gameController = gameController;
    this.setupInputHandlers();
  }

  setupInputHandlers() {
    document.addEventListener('keydown', (event) => {
      if (this.gameController.gameOver) {
        if (event.code === 'Enter') {
          this.gameController.reset();
          return;
        }
        return;
      }

      if (this.gameController.isCountingDown) {
        return;
      }

      if (event.code === 'Escape' || event.code === 'F1') {
        this.gameController.togglePause();
        return;
      }
    
      if (this.gameController.paused) return;
      
      switch (event.code) {
        case 'ArrowLeft':
          this.gameController.movePiece(-1, 0);
          break;
        case 'ArrowRight':
          this.gameController.movePiece(1, 0);
          break;
        case 'ArrowDown':
          if (this.gameController.movePiece(0, 1)) {
            this.gameController.score += 1;
          }
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
      }
    });
  }
}