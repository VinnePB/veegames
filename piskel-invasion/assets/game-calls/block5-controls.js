// ==============================
// Bloco 5 — Controles + Movimento + Tiro
// ==============================

// --- Constantes de tiro ---
const BULLET_W = 4;
const BULLET_H = 12;
const BULLET_SPEED = 6;
let BULLET_COOLDOWN_FRAMES = 12; // precisa ser let para ser ajustado no Bloco 10

// --- Flags de controle ---
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;
let gamePaused = false;

// --- Teclado ---
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") leftPressed = true;
  if (e.key === "ArrowRight") rightPressed = true;
  if (e.code === "Space") spacePressed = true;

  // Enter: iniciar ou pausar
  if (e.key === "Enter") {
    if (!gameStarted) {
      startGame();
    } else if (!gameOver) {
      togglePause();
    }
  }

  // P: pause/resume
  if (e.key === "p" || e.key === "P") {
    if (gameStarted && !gameOver) {
      togglePause();
    }
  }

  // R: reiniciar (ignora se estiver digitando no input do placar)
  if ((e.key === "r" || e.key === "R") && (gamePaused || gameOver)) {
    if (gameOver) return;
    const active = document.activeElement;
    const typing = active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA");
    if (!typing) restartGame();
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") leftPressed = false;
  if (e.key === "ArrowRight") rightPressed = false;
  if (e.code === "Space") spacePressed = false;
});

// --- Toque (mobile) ---
const btnLeft = document.getElementById("btnLeft");
const btnRight = document.getElementById("btnRight");
const btnShoot = document.getElementById("btnShoot");
const btnPause = document.getElementById("btnPause");

if (btnLeft) {
  btnLeft.addEventListener("touchstart", () => leftPressed = true);
  btnLeft.addEventListener("touchend", () => leftPressed = false);
}
if (btnRight) {
  btnRight.addEventListener("touchstart", () => rightPressed = true);
  btnRight.addEventListener("touchend", () => rightPressed = false);
}
if (btnShoot) {
  btnShoot.addEventListener("touchstart", () => spacePressed = true);
  btnShoot.addEventListener("touchend", () => spacePressed = false);
}
if (btnPause) {
  btnPause.addEventListener("click", () => {
    if (gameStarted && !gameOver) togglePause();
  });
}

// --- Função de pausa ---
function togglePause() {
  gamePaused = !gamePaused;
  if (gamePaused) {
    pauseAllMusic();
  } else {
    if (currentTrack) currentTrack.play().catch(() => {});
  }
}

// --- Movimento do player ---
function movePlayer() {
  if (leftPressed) player.x -= player.speed;
  if (rightPressed) player.x += player.speed;
  player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));
}

// --- Disparo do player ---
function shootBullet() {
  if (bulletCooldown > 0) bulletCooldown--;
  if (spacePressed && bulletCooldown <= 0) {
    if (player.doubleShotLevel === 1 && player.doubleShotTimer > 0) {
      bullets.push({ x: player.x + 6, y: player.y, w: BULLET_W, h: BULLET_H });
      bullets.push({ x: player.x + player.w - BULLET_W - 6, y: player.y, w: BULLET_W, h: BULLET_H });
    } else if (player.doubleShotLevel === 2 && player.doubleShotTimer > 0) {
      bullets.push({ x: player.x + 6, y: player.y, w: BULLET_W, h: BULLET_H });
      bullets.push({ x: player.x + player.w - BULLET_W - 6, y: player.y, w: BULLET_W, h: BULLET_H });
      bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 6, h: 14, vy: -5 });
      bullets.push({ x: player.x + player.w / 2 + 2, y: player.y, w: 6, h: 14, vy: -5 });
    } else {
      bullets.push({ x: player.x + player.w / 2 - BULLET_W / 2, y: player.y, w: BULLET_W, h: BULLET_H });
    }
    bulletCooldown = BULLET_COOLDOWN_FRAMES;
    playShoot(); // 🔊 som de tiro
  }
}

// --- Movimento das balas ---
function moveBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.y += (typeof b.vy === "number" ? b.vy : -BULLET_SPEED);
    if (b.y + b.h < 0) bullets.splice(i, 1);
  }
}
