// ==============================
// Bloco 11 — Efeitos Visuais Extras
// ==============================

// --- Starfield dinâmico ---
const stars = [];

function initStars(count = 200) {
  stars.length = 0;
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      s: Math.random() * 2 + 0.5, // tamanho
      v: Math.random() * 1.2 + 0.8, // velocidade base
    });
  }
}

let warpEffect = 0; // intensidade do warp (0 = normal, 1 = máximo)

function triggerWarp() {
  warpEffect = 1.0; // ativa warp ao iniciar fase/chefe
}

function updateStars() {
  const speedFactor = 1 + (wave - 1) * 0.15 + warpEffect * 3;
  for (const st of stars) {
    st.y -= st.v * speedFactor;
    if (st.y < 0) {
      st.y = canvas.height + Math.random() * 20;
      st.x = Math.random() * canvas.width;
    }
  }
  if (warpEffect > 0) warpEffect = Math.max(0, warpEffect - 0.02); // decai suavemente
}

function drawStars() {
  ctx.save();
  for (const st of stars) {
    const alpha = 0.5 + 0.5 * Math.random();
    ctx.fillStyle = `rgba(200, 240, 255, ${alpha})`;
    ctx.fillRect(st.x, st.y, st.s, st.s);
  }
  ctx.restore();
}

// --- Partículas de fundo (pequenos brilhos aleatórios) ---
const particles = [];

function spawnParticles(count = 5) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2 + 1,
      alpha: 1,
      decay: 0.01 + Math.random() * 0.02,
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].alpha -= particles[i].decay;
    if (particles[i].alpha <= 0) particles.splice(i, 1);
  }
}

function drawParticles() {
  ctx.save();
  for (const p of particles) {
    ctx.globalAlpha = p.alpha;
    ctx.fillStyle = "rgba(56,189,248,0.9)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
