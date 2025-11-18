// ==============================
// Bloco 10 — Curva de Dificuldade Infinita
// ==============================

// --- Gerar diferentes padrões de inimigos ---
function spawnWave(pattern) {
  enemies.length = 0;

  if (pattern === "line") {
    // formação clássica em linha
    createEnemies();

  } else if (pattern === "v") {
    // formação em V
    for (let i = 0; i < 6; i++) {
      enemies.push({
        x: canvas.width / 2 + (i - 3) * 40,
        y: ENEMY_OFFSET_Y + i * 30,
        w: ENEMY_W,
        h: ENEMY_H,
        hp: 1,
        alive: true,
        type: "normal",
        shootTimer: 0
      });
    }

  } else if (pattern === "spiral") {
    // inimigos surgem atrás do boss e fazem movimento circular
    for (let i = 0; i < 8; i++) {
      enemies.push({
        x: canvas.width / 2,
        y: ENEMY_OFFSET_Y,
        w: ENEMY_W,
        h: ENEMY_H,
        hp: 1,
        alive: true,
        type: "minion",
        shootTimer: 0,
        angle: i * (Math.PI / 4),
        radius: 0
      });
    }
  }
}

// --- Avançar para próxima onda ---
function nextWave() {
  // garante que o jogo não avança se já acabou
  if (gameOver) return;

  wave++;

  // limpar restos da fase anterior
  enemies.length = 0;
  enemyBullets.length = 0;
  bossBullets.length = 0;
  bullets.length = 0;
  powerUps.length = 0;
  explosions.length = 0;
  boss = null;

  // curva de dificuldade
  enemySpeed *= 1.12;
  enemyShootChance = Math.min(0.04, enemyShootChance * 1.15);

  // cooldown de tiro do player diminui progressivamente
  BULLET_COOLDOWN_FRAMES = Math.max(5, Math.floor(BULLET_COOLDOWN_FRAMES * 0.95));

  // bônus de progressão
  score += Math.floor(canvas.width * 0.03); // proporcional à tela

  // a cada 3 fases, boss aparece
  if (wave % 3 === 0) {
    spawnBoss();
    triggerWarp();
  } else {
    // alterna padrões de inimigos
    const patterns = ["line", "v", "spiral"];
    const pattern = patterns[(wave - 1) % patterns.length];
    spawnWave(pattern);
  }

  queueFragmentToast();
}
