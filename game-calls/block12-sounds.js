// ==============================
// Bloco 12 — Sons
// ==============================

// --- Carregar sons ---
const sfxShoot = new Audio("assets/sounds/shoot.wav");
const sfxExplosion = new Audio("assets/sounds/explosion.wav");
const sfxPowerUp = new Audio("assets/sounds/powerup.wav");
const sfxHit = new Audio("assets/sounds/hit.wav");
const sfxBossExplosion = new Audio("assets/sounds/boss_explosion.wav");

// Ajuste de volume padrão
sfxShoot.volume = 0.4;
sfxExplosion.volume = 0.6;
sfxPowerUp.volume = 0.5;
sfxHit.volume = 0.5;
sfxBossExplosion.volume = 0.7;

// --- Funções utilitárias para tocar sons ---
function playShoot() {
  sfxShoot.currentTime = 0;
  sfxShoot.play().catch(() => {});
}

function playExplosion() {
  sfxExplosion.currentTime = 0;
  sfxExplosion.play().catch(() => {});
}

function playPowerUp() {
  sfxPowerUp.currentTime = 0;
  sfxPowerUp.play().catch(() => {});
}

function playHit() {
  sfxHit.currentTime = 0;
  sfxHit.play().catch(() => {});
}

function playBossExplosion() {
  sfxBossExplosion.currentTime = 0;
  sfxBossExplosion.play().catch(() => {});
}
