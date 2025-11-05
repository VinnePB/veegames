// ==============================
// Bloco 4 — Power-ups, Explosões e HUD
// ==============================

// --- Função para desenhar HUD ---
function drawHUD() {
  const fontSize = Math.floor(canvas.height * 0.03); // 3% da altura da tela
  ctx.fillStyle = "lime";
  ctx.font = `${fontSize}px Courier New`;

  ctx.fillText(`Score: ${score}`, canvas.width * 0.02, canvas.height * 0.05);
  ctx.fillText(`High Score: ${highScore}`, canvas.width * 0.65, canvas.height * 0.05);
  ctx.fillText(`Vidas: ${player.lives}`, canvas.width * 0.02, canvas.height * 0.10);
  ctx.fillText(`Fase: ${wave}`, canvas.width * 0.65, canvas.height * 0.10);
  ctx.fillText(`Abatidas: ${kills}`, canvas.width * 0.02, canvas.height * 0.15);
  ctx.fillText(`Acertos na nave: ${hits}`, canvas.width * 0.65, canvas.height * 0.15);
  ctx.fillText(`Tempo: ${elapsedTime}s`, canvas.width * 0.02, canvas.height * 0.20);
}

// --- Movimento dos power-ups ---
function movePowerUps() {
  for (let i = powerUps.length - 1; i >= 0; i--) {
    powerUps[i].y += canvas.height * 0.003; // velocidade proporcional à tela
    if (powerUps[i].y > canvas.height) powerUps.splice(i, 1);
  }
}

// --- Desenho dos power-ups ---
function drawPowerUps() {
  for (const p of powerUps) {
    const size = canvas.width * 0.05; // 5% da largura da tela
    if (p.type === "life") {
      ctx.drawImage(imgPUHeart, p.x, p.y, size, size);
    } else if (p.type === "double") {
      ctx.drawImage(imgPUDouble, p.x, p.y, size, size);
    } else {
      ctx.fillStyle = "cyan";
      ctx.fillRect(p.x, p.y, size, size);
    }
  }
}
