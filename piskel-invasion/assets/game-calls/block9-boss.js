// ==============================
// Bloco 9 — Chefe de Fase (Boss)
// ==============================

const BOSS_BASE = { w: 120, h: 80, hp: 40, speed: 3.0 };
const BOSS_BULLET_SPEED = 3.2;

function spawnBoss() {
  boss = {
    x: canvas.width / 2 - BOSS_BASE.w / 2,
    y: 90,
    w: BOSS_BASE.w,
    h: BOSS_BASE.h,
    hp: Math.floor(BOSS_BASE.hp * (1 + (wave - 1) * 0.2)),
    alive: true,
    shootTimer: 0,
    dir: Math.random() < 0.5 ? -1 : 1,
    speed: (BOSS_BASE.speed * 0.6) + (wave - 1) * 0.15,
    bursting: false,
    burstIndex: 0
  };

  // música do boss
  stopAllMusic();
  currentTrack = ostBoss;
  currentTrack.loop = true;
  currentTrack.play().catch(()=>{});
}

function updateBoss() {
  if (!boss || !boss.alive) return;

  boss.x += boss.dir * boss.speed;
  if (boss.x < 20 || boss.x + boss.w > canvas.width - 20) boss.dir *= -1;
  boss.y = 90 + Math.sin(performance.now() / 600) * 40;

  boss.shootTimer++;
  const cx = boss.x + boss.w / 2;
  const cy = boss.y + boss.h;

  if (!boss.bursting && boss.shootTimer % 72 === 0) {
    boss.bursting = true;
    boss.burstIndex = 0;
  }
  if (boss.bursting && boss.shootTimer % 6 === 0) {
    bossBullets.push({ x: cx, y: cy, w: 6, h: 14, vx: 0, vy: BOSS_BULLET_SPEED });
    boss.burstIndex++;
    if (boss.burstIndex >= 4) boss.bursting = false;
  }

  if (boss.shootTimer % 90 === 0) {
    for (let i = -3; i <= 3; i++) {
      bossBullets.push({
        x: cx + i * 10,
        y: cy,
        w: 6,
        h: 14,
        vx: i * 0.5,
        vy: BOSS_BULLET_SPEED
      });
    }
  }

  if (wave >= 6 && boss.shootTimer % 300 === 0) {
    const numMinions = Math.floor(Math.random() * 6) + 3;
    for (let i = 0; i < numMinions; i++) {
      enemies.push({
        x: 60 + i * (ENEMY_W + 10),
        y: boss.y + boss.h + 40,
        w: ENEMY_W,
        h: ENEMY_H,
        hp: 1,
        alive: true,
        scale: 1,
        type: "normal",
        shootTimer: 0
      });
    }
  }
}

function moveBossBullets() {
  for (let i = bossBullets.length - 1; i >= 0; i--) {
    const b = bossBullets[i];
    b.x += b.vx || 0;
    b.y += b.vy || BOSS_BULLET_SPEED;
    if (b.y > canvas.height || b.x < 0 || b.x > canvas.width) {
      bossBullets.splice(i, 1);
    }
  }
}

function drawBossBullets() {
  ctx.fillStyle = "orange";
  for (const b of bossBullets) ctx.fillRect(b.x, b.y, b.w, b.h);
}

function drawBoss() {
  if (!boss || !boss.alive) return;

  ctx.save();
  ctx.shadowColor = "rgba(255,120,0,0.8)";
  ctx.shadowBlur = 16;
  ctx.drawImage(imgBoss, boss.x, boss.y, boss.w, boss.h);
  ctx.restore();

  const barW = 240;
  const barH = 10;
  const bx = canvas.width / 2 - barW / 2;
  const by = boss.y - 16;
  const pct = Math.max(0, boss.hp / Math.floor(BOSS_BASE.hp * (1 + (wave - 1) * 0.2)));

  ctx.fillStyle = "rgba(20,20,20,0.8)";
  ctx.fillRect(bx, by, barW, barH);
  ctx.fillStyle = "rgba(255,120,0,0.9)";
  ctx.fillRect(bx, by, barW * pct, barH);
  ctx.strokeStyle = "orange";
  ctx.strokeRect(bx, by, barW, barH);
}

function checkBossHit(bb) {
  if (!boss || !boss.alive) return false;
  if (rectsCollide(bb.x, bb.y, bb.w, bb.h, boss.x, boss.y, boss.w, boss.h)) {
    boss.hp--;
    explosions.push({ x: boss.x + boss.w / 2, y: boss.y + boss.h / 2, alpha: 0.9, radius: 10 });
    if (boss.hp <= 0) {
      boss.alive = false;
      kills++;
      score += 100;
      playBossExplosion();

      powerUps.push({
        x: boss.x + boss.w / 2 - POWERUP_SIZE / 2,
        y: boss.y + boss.h / 2 - POWERUP_SIZE / 2,
        size: POWERUP_SIZE,
        type: Math.random() < 0.5 ? "double" : "life",
      });

      boss = null;

      // ✅ adiar avanço de wave para depois do frame
      setTimeout(() => {
        nextWave();
        triggerWarp();

        // voltar a tocar OST de waves
        if (!gameOver) {
          stopAllMusic();
          currentTrack = ostWaves[Math.floor(Math.random()*ostWaves.length)];
          currentTrack.loop = true;
          currentTrack.play().catch(()=>{});
        }
      }, 500); // delay para não cortar som da explosão
    }
    return true;
  }
  return false;
}
