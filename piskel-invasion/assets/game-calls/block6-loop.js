// ==============================
// Bloco 6 — Loop Principal + Renderização
// ==============================

function drawBackground() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  ctx.drawImage(imgShip, player.x, player.y, player.w, player.h);
  if (player.shieldTimer > 0) {
    ctx.beginPath();
    ctx.arc(player.x + player.w/2, player.y + player.h/2, player.w, 0, Math.PI*2);
    ctx.strokeStyle = player.shieldColor;
    ctx.lineWidth = 3;
    ctx.stroke();
  }
}

function drawEnemies() {
  for (const e of enemies) {
    if (!e.alive) continue;
    ctx.drawImage(imgEnemy, e.x, e.y, e.w, e.h);
  }
}

function moveEnemies() {
  let edge = false;
  for (const e of enemies) {
    if (!e.alive) continue;
    if (e.type === "normal") {
      e.x += enemyDir * enemySpeed;
      e.y += Math.sin(performance.now() / 500 + e.x) * 0.2;
    } else if (e.type === "tank") {
      e.x += enemyDir * (enemySpeed * 0.5);
    }
    if (e.x < 20 || e.x + e.w > canvas.width - 20) edge = true;
  }
  if (edge) {
    enemyDir *= -1;
    for (const e of enemies) e.y += canvas.height * 0.03;
  }
}

function moveEnemyBullets() {
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    b.x += b.vx || 0;
    b.y += b.vy || ENEMY_BULLET_SPEED;
    if (b.y > canvas.height || b.x < 0 || b.x > canvas.width) {
      enemyBullets.splice(i, 1);
    }
  }
}

function enemyShoot() {
  for (const e of enemies) {
    if (!e.alive) continue;
    if (e.type === "normal") {
      if (Math.random() < enemyShootChance) {
        enemyBullets.push({
          x: e.x + e.w / 2 - 1,
          y: e.y + e.h,
          w: canvas.width * 0.008,
          h: canvas.height * 0.018,
          vx: 0,
          vy: ENEMY_BULLET_SPEED * 1.3
        });
      }
    } else if (e.type === "tank") {
      e.shootTimer++;
      if (e.shootTimer % 90 === 0) {
        const cx = e.x + e.w / 2;
        const cy = e.y + e.h;
        for (let i = -1; i <= 1; i++) {
          enemyBullets.push({
            x: cx + i * 6,
            y: cy,
            w: canvas.width * 0.012,
            h: canvas.height * 0.025,
            vx: i * 0.6,
            vy: ENEMY_BULLET_SPEED * 0.9
          });
        }
      }
    }
  }
}

function drawBullets() {
  ctx.fillStyle = "cyan";
  for (const b of bullets) ctx.fillRect(b.x, b.y, b.w, b.h);
}

function drawEnemyBullets() {
  ctx.fillStyle = "red";
  for (const b of enemyBullets) ctx.fillRect(b.x, b.y, b.w, b.h);
}

let loopId = null;

function loop() {
  if (!gameStarted) return;

  drawBackground();
  updateStars();
  updateParticles();
  drawStars();
  drawParticles();

  if (!gamePaused && !gameOver) {
    movePlayer();
    shootBullet();
    moveEnemies();
    enemyShoot();
    moveBullets();
    moveEnemyBullets();
    moveBossBullets();
    updateBoss();
    checkCollisions();

    if (player.shieldTimer > 0) player.shieldTimer--;
    if (player.doubleShotTimer > 0) player.doubleShotTimer--;
    elapsedTime = Math.floor((performance.now() - startTime) / 1000);
    movePowerUps();
  }

  // sempre desenhar
  drawEnemyBullets();
  drawBossBullets();
  drawEnemies();
  drawBullets();
  drawPlayer();
  drawPowerUps();
  drawHUD();
  drawExplosions();
  drawFragmentToast();
  drawBoss();

  document.getElementById("gameOverScreen").style.display = gameOver ? "block" : "none";
  document.getElementById("pauseScreen").style.display = (gamePaused && !gameOver) ? "block" : "none";

  loopId = requestAnimationFrame(loop);
}

function startGame() {
  if (loopId) cancelAnimationFrame(loopId);

  // mostrar canvas e esconder menus
  document.getElementById("gameCanvas").style.display = "block";
  document.getElementById("menu").style.display = "none";
  document.getElementById("info").style.display = "none";

  // limpar tudo
  bullets.length = 0;
  enemies.length = 0;
  enemyBullets.length = 0;
  bossBullets.length = 0;
  powerUps.length = 0;
  explosions.length = 0;
  boss = null;

  // resetar estado
  gameStarted = true;
  gamePaused = false;
  gameOver = false;
  score = 0;
  kills = 0;
  hits = 0;
  wave = 1;
  player.lives = 3;

  // resets extras
  bulletCooldown = 0;
  player.shieldTimer = 0;
  player.vibrateTimer = 0;
  player.doubleShotLevel = 0;
  player.doubleShotTimer = 0;
  leftPressed = false;
  rightPressed = false;
  spacePressed = false;

  // resetar progressão de dificuldade
  enemySpeed = 2.4;
  enemyShootChance = 0.007;
  BULLET_COOLDOWN_FRAMES = 12;

  // ✅ parar TakenCare se estiver tocando
  ostTakenCare.pause();
  ostTakenCare.currentTime = 0;

  // ✅ tocar música de waves e atualizar currentTrack
  stopAllMusic();
  currentTrack = ostWaves[Math.floor(Math.random()*ostWaves.length)];
  currentTrack.loop = true;
  currentTrack.play().catch(()=>{});

  // posição segura
  player.x = canvas.width / 2 - player.w / 2;
  player.y = canvas.height - canvas.height * 0.12;

  createEnemies();
  initStars();
  startTime = performance.now();

  if (music) music.play().catch(() => {});
  loopId = requestAnimationFrame(loop);
}

function restartGame() {
  startGame();
}

// --- Botões de menu ---
document.getElementById("startButton").addEventListener("click", () => {
  startGame();
});
document.getElementById("aboutButton").addEventListener("click", () => {
  document.getElementById("menu").style.display = "none";
  document.getElementById("info").style.display = "block";

  // ✅ música da tela de info
  stopAllMusic();
  currentTrack = ostAbout;
  currentTrack.loop = true;
  currentTrack.play().catch(()=>{});
});
document.getElementById("backButton").addEventListener("click", () => {
  document.getElementById("info").style.display = "none";
  document.getElementById("menu").style.display = "block";

  // ✅ música do menu
  stopAllMusic();
  currentTrack = ostMenu;
  currentTrack.loop = true;
  currentTrack.play().catch(()=>{});
});

document.getElementById("saveScoreButton").addEventListener("click", () => {
  const name = document.getElementById("playerNameInput").value || "Anônimo";
  const entry = { name, score, wave };
  const board = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  board.push(entry);
  board.sort((a,b) => b.score - a.score);
  localStorage.setItem("leaderboard", JSON.stringify(board.slice(0,10)));
  renderLeaderboard();
});

function renderLeaderboard() {
  const board = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  const div = document.getElementById("leaderboard");
  div.innerHTML = "<h3>🏆 Leaderboard</h3>" + board.map(e => 
    `<div>${e.name} — ${e.score} pts (Wave ${e.wave})</div>`
  ).join("");
}


