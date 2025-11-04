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
  vibrateTimer: 0,        // vibração ao ser atingido
  shieldTimer: 0,         // escudo temporário
  shieldColor: "rgba(180, 240, 255, 0.85)",
  doubleShotTimer: 0,     // duração do upgrade
  doubleShotLevel: 0      // 0 = normal, 1 = tiros duplos, 2 = duplos + foguetes
};

// --- Listas globais ---
const bullets = [];        // tiros do player
const enemyBullets = [];   // tiros dos inimigos
const bossBullets = [];    // tiros do chefe
const powerUps = [];       // power-ups em tela
const explosions = [];     // explosões em tela
const enemies = [];        // inimigos ativos

// --- Controle de tiro ---
let bulletCooldown = 0; // frames até poder atirar novamente

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

// --- Constantes globais  ---
const KILL_SCORE = 10; // pontos por inimigo normal
const POWERUP_SIZE = 24;

// ==============================
// Controles da tela de Game Over
// ==============================

// Botão Continuar → reinicia o jogo
document.getElementById("continueButton").addEventListener("click", () => {
  ostTakenCare.pause();
  ostTakenCare.currentTime = 0;
  restartGame(); // função já existente no loop
});

// Botão Sair → volta ao menu
document.getElementById("exitButton").addEventListener("click", () => {
  // parar música da tela de morte
  ostTakenCare.pause();
  ostTakenCare.currentTime = 0;

  // cancelar loop do jogo
  if (loopId) {
    cancelAnimationFrame(loopId);
    loopId = null;
  }

  // resetar estado
  gameStarted = false;
  gamePaused = false;
  gameOver = false;

  // esconder telas de jogo e mostrar menu
  document.getElementById("gameOverScreen").style.display = "none";
  document.getElementById("gameCanvas").style.display = "none";
  document.getElementById("info").style.display = "none";
  document.getElementById("menu").style.display = "block";

  // tocar música do menu
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
