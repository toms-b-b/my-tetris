export const PLAYFIELD_WIDTH = 10;
export const PLAYFIELD_HEIGHT = 40;
export const VISIBLE_HEIGHT = 20;
export const VISIBLE_NEXT_PIECES = 6;
export const PREVIEW_CELL_SCALE = 0.8;
export const MIN_CELL_SIZE = 20; // Minimum cell size to maintain playability
export const GHOST_OPACITY = 0.3;

export const COLORS = {
  I: '#00f0f0', // Cyan
  O: '#f0f000', // Yellow
  T: '#a000f0', // Purple
  S: '#00f000', // Green
  Z: '#f00000', // Red
  J: '#0000f0', // Blue
  L: '#f0a000', // Orange
  ghost: '#ffffff',
  background: '#000000',
  grid: '#333333',
};

export const TETROMINOS = {
  I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
  J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
};

export const SPAWN_POSITIONS = {
  I: { row: 21, col: 3 }, // Spawns in middle columns (3-6)
  O: { row: 21, col: 4 }, // Spawns in middle columns (4-5)
  J: { row: 21, col: 3 }, // Spawns in left-middle columns
  L: { row: 21, col: 3 }, // Spawns in left-middle columns
  S: { row: 21, col: 3 }, // Spawns in left-middle columns
  T: { row: 21, col: 3 }, // Spawns in left-middle columns
  Z: { row: 21, col: 3 }  // Spawns in left-middle columns
};

export const LEVEL_SPEEDS = {
  1: 1000,
  2: 793,
  3: 618,
  4: 473,
  5: 355,
  6: 262,
  7: 190,
  8: 135,
  9: 94,
  10: 64,
  11: 43,
  12: 28,
  13: 18,
  14: 11,
  15: 7,
};

export const SCORING = {
  SINGLE: 100,
  DOUBLE: 300,
  TRIPLE: 500,
  TETRIS: 800,
  SOFT_DROP: 1,
  HARD_DROP: 2,
};

export const LOCK_DELAY = 500; // 0.5 seconds