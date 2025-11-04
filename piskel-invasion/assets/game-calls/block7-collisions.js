// ==============================
// Bloco 7 — Colisões + Power-ups
// ==============================

function rectsCollide(ax, ay, aw, ah, bx, by, bw, bh) {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function applyDamageToPlayer(amount) {
  if (player.shieldTimer > 0) {
    player.vibrateTimer = 10;
    return;
  }
  hits++;
  player.lives -= amount;
  player.vibrateTimer = 18;
  player.shieldTimer = 150;
  playHit();

  if (player.lives <= 0) {
    gameOver = true;

    // ✅ parar todas as músicas
    stopAllMusic();
    currentTrack = null; // não queremos retomar nada no pause

    // ✅ tocar oldOn, depois TakenCare (sem mexer em currentTrack)
    ostOldOn.currentTime = 0;
    ostOldOn.play().catch(()=>{});
    ostOldOn.onended = () => {
      ostTakenCare.loop = true;
      ostTakenCare.currentTime = 0;
      ostTakenCare.play().catch(()=>{});
    };
  }
}

// - Coletar Power Up
function collectPowerUp(p) {
  if (p.type === "life") {
    player.lives++;
  } else if (p.type === "double") {
    if (player.doubleShotLevel === 0) {
      player.doubleShotLevel = 1;
      player.doubleShotTimer = 600;
    } else if (player.doubleShotLevel === 1) {
      player.doubleShotLevel = 2;
      player.doubleShotTimer = 600;
    } else {
      player.doubleShotTimer += 600;
    }
  } else if (p.type === "memory") {
    score += 15;
    queueFragmentToast();
  }
  playPowerUp();
}

function updatePlayerHitFeedback() {
  if (player.vibrateTimer > 0) player.vibrateTimer--;
}

function checkCollisions() {
  // 1) Balas do jogador vs inimigos/boss
  for (let b = bullets.length - 1; b >= 0; b--) {
    const bb = bullets[b];
    let hit = false;

    // a) Inimigos
    for (let e = 0; e < enemies.length; e++) {
      const en = enemies[e];
      if (!en || !en.alive) continue;

      if (rectsCollide(bb.x, bb.y, bb.w, bb.h, en.x, en.y, en.w, en.h)) {
        en.hp--;
        bullets.splice(b, 1);
        hit = true;

        explosions.push({
          x: en.x + en.w / 2,
          y: en.y + en.h / 2,
          alpha: 0.9,
          radius: 8 * en.scale,
        });

        if (en.hp <= 0) {
          en.alive = false;
          score += (en.type === "tank" ? KILL_SCORE * 5 : KILL_SCORE);
          kills++;
          playExplosion();

          if (Math.random() < 0.15) {
            const roll = Math.random();
            const type = roll < 0.4 ? "life" : roll < 0.8 ? "double" : "memory";
            powerUps.push({
              x: en.x + en.w / 2 - POWERUP_SIZE / 2,
              y: en.y + en.h / 2 - POWERUP_SIZE / 2,
              size: POWERUP_SIZE,
              type,
            });
          }

          if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", String(highScore));
          }
        }
        break;
      }
    }

    // b) Boss
    if (!hit && checkBossHit(bb)) {
      bullets.splice(b, 1);
    }
  }

  // ✅ hitbox reduzida do player
  const playerHitbox = {
    x: player.x + 6,
    y: player.y + 4,
    w: player.w - 12,
    h: player.h - 8
  };

  // 2) Balas dos inimigos vs player
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const eb = enemyBullets[i];
    if (rectsCollide(eb.x, eb.y, eb.w, eb.h, playerHitbox.x, playerHitbox.y, playerHitbox.w, playerHitbox.h)) {
      enemyBullets.splice(i, 1);
      const dmg = eb.w > 3 ? 2 : 1;
      applyDamageToPlayer(dmg);
    }
  }

  // 3) Balas do boss vs player
  for (let i = bossBullets.length - 1; i >= 0; i--) {
    const b = bossBullets[i];
    if (rectsCollide(b.x, b.y, b.w, b.h, playerHitbox.x, playerHitbox.y, playerHitbox.w, playerHitbox.h)) {
      bossBullets.splice(i, 1);
      const dmg = b.vx !== 0 ? 3 : 1;
      applyDamageToPlayer(dmg);
    }
  }

  // 4) Player coleta power-ups
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const p = powerUps[i];
    if (rectsCollide(p.x, p.y, p.size, p.size, playerHitbox.x, playerHitbox.y, playerHitbox.w, playerHitbox.h)) {
      collectPowerUp(p);
      powerUps.splice(i, 1);
    }
  }

  // 5) Avançar wave
  const hadEnemies = enemies.length > 0;
  const noEnemiesAlive = hadEnemies && enemies.every(e => !e.alive);
  const noBossAlive = !boss || !boss.alive;

  if (!gameOver && gameStarted && hadEnemies && noEnemiesAlive && noBossAlive) {
    nextWave();
  }

  // 6) Feedback
  updatePlayerHitFeedback();
}
