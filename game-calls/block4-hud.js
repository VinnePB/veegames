// ==============================
// Bloco 4 — Power-ups, Explosões e HUD
// ==============================

// --- Função para desenhar HUD ---
function drawHUD() {
  ctx.fillStyle = "lime";
  ctx.font = "16px Courier New";
  ctx.fillText(`Score: ${score}`, 8, 22);
  ctx.fillText(`High Score: ${highScore}`, canvas.width - 180, 22);
  ctx.fillText(`Vidas: ${player.lives}`, 8, 42);
  ctx.fillText(`Fase: ${wave}`, canvas.width - 160, 42);
  ctx.fillText(`Abatidas: ${kills}`, 8, 62);
  ctx.fillText(`Acertos na nave: ${hits}`, canvas.width - 220, 62);
  ctx.fillText(`Tempo: ${elapsedTime}s`, 8, 82);
}

// --- Movimento dos power-ups ---
function movePowerUps() {
  for (let i = powerUps.length - 1; i >= 0; i--) {
    powerUps[i].y += 2; // velocidade de queda
    if (powerUps[i].y > canvas.height) powerUps.splice(i, 1);
  }
}

// --- Desenho dos power-ups ---
function drawPowerUps() {
  for (const p of powerUps) {
    if (p.type === "life") {
      ctx.drawImage(imgPUHeart, p.x, p.y, p.size, p.size);
    } else if (p.type === "double") {
      ctx.drawImage(imgPUDouble, p.x, p.y, p.size, p.size);
    } else {
      ctx.fillStyle = "cyan";
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
  }
}
