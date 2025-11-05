// ==============================
// Bloco 10 — Curva de Dificuldade Infinita
// ==============================

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
    createEnemies(); // recria inimigos normais
  }

  queueFragmentToast();
}
