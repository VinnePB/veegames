// ==============================
// Bloco 3 — Inimigos
// ==============================

// --- Configuração dos inimigos ---
const ENEMY_ROWS = 4;
const ENEMY_COLS = 8;
const ENEMY_W = canvas.width * 0.06;
const ENEMY_H = ENEMY_W * 0.8; // proporção visual ajustada
const ENEMY_PADDING_X = 20;
const ENEMY_PADDING_Y = 22;
const ENEMY_OFFSET_X = 60;
const ENEMY_OFFSET_Y = 60;

let enemyDir = 1;
let enemySpeed = 2.4;
let enemyShootChance = 0.007;

const ENEMY_BULLET_SPEED = 2.5;

// --- Criar inimigos iniciais ---
function createEnemies() {
  enemies.length = 0; // usa o array global declarado no Bloco 2
  const rows = ENEMY_ROWS;
  const cols = ENEMY_COLS;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      enemies.push({
        x: ENEMY_OFFSET_X + c * (ENEMY_W + ENEMY_PADDING_X),
        y: ENEMY_OFFSET_Y + r * (ENEMY_H + ENEMY_PADDING_Y),
        w: ENEMY_W,
        h: ENEMY_H,
        hp: 1,
        alive: true,
        scale: 1,
        type: Math.random() < 0.2 ? "tank" : "normal",
        shootTimer: 0
      });
    }
  }
}

