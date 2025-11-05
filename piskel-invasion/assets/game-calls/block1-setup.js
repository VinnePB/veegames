// ==============================
// Bloco 1 — Canvas, Música e Sprites
// ==============================

// --- Canvas e contexto ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Redimensiona o canvas para ocupar toda a tela
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas(); // chama ao carregar

// --- Música (loop no index.html) ---
const music = document.getElementById("music");
if (music) music.volume = 0.6;

// --- Sprites principais ---
const imgShip = new Image();
const imgEnemy = new Image();
const imgPUHeart = new Image();
const imgPUDouble = new Image();
const imgBoss = new Image();

// Controle de assets carregados
let assetsReady = false;
let assetsCount = 0;
const totalAssets = 5;

function markAssetLoaded() {
  assetsCount++;
  if (assetsCount >= totalAssets) assetsReady = true;
}

// Carregar sprites da pasta assets/sprites
imgShip.onload = markAssetLoaded;
imgShip.onerror = markAssetLoaded;
imgShip.src = "assets/sprites/ship.png";

imgEnemy.onload = markAssetLoaded;
imgEnemy.onerror = markAssetLoaded;
imgEnemy.src = "assets/sprites/enemy.png";

imgPUHeart.onload = markAssetLoaded;
imgPUHeart.onerror = markAssetLoaded;
imgPUHeart.src = "assets/sprites/life.png";

imgPUDouble.onload = markAssetLoaded;
imgPUDouble.onerror = markAssetLoaded;
imgPUDouble.src = "assets/sprites/double.png";

imgBoss.onload = markAssetLoaded;
imgBoss.onerror = markAssetLoaded;
imgBoss.src = "assets/sprites/spr_boss.png";

// --- Músicas ---
const ostMenu = new Audio("assets/sounds/menu.mp3");
const ostAbout = new Audio("assets/sounds/about.mp3");
const ostOldOn = new Audio("piskel-invasion/assets/sounds/OldOn.mp3");
const ostTakenCare = new Audio("assets/sounds/TakenCare.mp3");
const ostWaves = [
  new Audio("assets/sounds/wave1.mp3"),
  new Audio("assets/sounds/wave2.mp3"),
  new Audio("assets/sounds/wave3.mp3"),
  new Audio("assets/sounds/wave4.mp3")
];
const ostBoss = new Audio("assets/sounds/boss.mp3");

// variável global para saber qual faixa está ativa
let currentTrack = null;

function stopAllMusic() {
  [ostMenu, ostAbout, ...ostWaves, ostBoss].forEach(m => { 
    m.pause(); 
    m.currentTime = 0; 
  });
}

function pauseAllMusic() {
  [ostMenu, ostAbout, ...ostWaves, ostBoss].forEach(m => {
    if (!m.paused) m.pause();
  });
}

