// ==============================
// Bloco 2 — Estado do Jogo e Jogador
// ==============================

// --- Estado do jogo ---
let gameStarted = false;
let gamePaused = false;
let gameOver = false;

// --- Controles ---
let leftPressed = false;
let rightPressed = false;
let spacePressed = false;

// --- Jogador ---
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 70,
  w: 50,
  h: 30,
  speed: 6,
  lives: 3,
  vibrateTimer: 0,
  shieldTimer: 0,
  shieldColor: "rgba(180, 240, 255, 0.85)",
  doubleShotTimer: 0,
  doubleShotLevel: 0
};

// --- Listas globais ---
const bullets = [];
const enemyBullets = [];
const bossBullets = [];
const powerUps = [];
const explosions = [];
const enemies = [];

// --- Controle de tiro ---
let bulletCooldown = 0;

// --- Boss ---
let boss = null;

// --- Pontuação e progresso ---
let score = 0;
let highScore = parseInt(localStorage.getItem("highScore") || "0", 10);
let kills = 0;
let hits = 0;
let wave = 1;
let startTime = 0;
let elapsedTime = 0;

// --- Constantes globais ---
const KILL_SCORE = 10;
const POWERUP_SIZE = 24;

// ==============================
// Controles da tela de Game Over
// ==============================

document.getElementById("continueButton").addEventListener("click", () => {
  ostTakenCare.pause();
  ostTakenCare.currentTime = 0;
  restartGame();
});

document.getElementById("exitButton").addEventListener("click", () => {
  ostTakenCare.pause();
  ostTakenCare.currentTime = 0;

  if (loopId) {
    cancelAnimationFrame(loopId);
    loopId = null;
  }

  gameStarted = false;
  gamePaused = false;
  gameOver = false;

  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("gameCanvas").style.display = "none";
  document.getElementById("info").style.display = "none";
  document.getElementById("menu").style.display = "block";

  stopAllMusic();
  currentTrack = ostMenu;
  currentTrack.loop = true;
  currentTrack.play().catch(()=>{});
});

// ==============================
// Música inicial ao carregar a página
// ==============================
window.addEventListener("load", () => {
  stopAllMusic();
  currentTrack = ostMenu;
  currentTrack.loop = true;
  currentTrack.play().catch(()=>{});
});

