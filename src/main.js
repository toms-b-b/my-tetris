import GameController from './game/GameController.js';
import Renderer from './game/Renderer.js';

// Copyright notice
const copyrightElement = document.createElement('div');
copyrightElement.style.position = 'absolute';
copyrightElement.style.fontSize = '1rem';
copyrightElement.style.color = 'white';
copyrightElement.style.textAlign = 'center';
copyrightElement.style.width = '60%'; // Width of the box
copyrightElement.style.top = '50%';
copyrightElement.style.left = '50%';
copyrightElement.style.transform = 'translate(-50%, -50%)';
copyrightElement.style.background = 'rgba(0, 0, 0, 0.9)'; // Semi-transparent black background
copyrightElement.style.padding = '20px'; // Padding inside the box
copyrightElement.style.borderRadius = '15px'; // Rounded corners
copyrightElement.textContent = 'Tetris © 1985~1970 Tetris Holding. Tetris logos, Tetris theme song and Tetriminos are trademarks of Tetris Holding. ' +
  'The Tetris trade dress is owned by Tetris Holding. Licensed to The Tetris Company. Tetris Game Design by Alexey Pajitnov. ' +
  'Tetris Logo Design by Roger Dean. All Rights Reserved.';
document.body.appendChild(copyrightElement);

setTimeout(() => {
  copyrightElement.remove();

  // Start countdown
  let countdown = 3;
  const countdownElement = document.createElement('div');
  countdownElement.style.position = 'absolute';
  countdownElement.style.fontSize = '60px';
  countdownElement.style.color = 'white';
  countdownElement.style.textAlign = 'center';
  countdownElement.style.width = '100%';
  countdownElement.style.top = '50%';
  countdownElement.style.transform = 'translateY(-50%)';
  document.body.appendChild(countdownElement);

  const countdownInterval = setInterval(() => {
    if (countdown > 0) {
      countdownElement.textContent = countdown;
      countdown--;
    } else {
      clearInterval(countdownInterval);
      countdownElement.remove();
      startGame();
    }
  }, 1000);
}, 5000);

// Start the game
function startGame() {
  const renderer = new Renderer();
  const game = new GameController(renderer);
  
  // Start background music
  const bgMusic = document.getElementById('bgMusic');
  bgMusic.volume = 0.5;
  bgMusic.play();
}