// ==============================
// Bloco 8 — Explosões + Fragmentos Narrativos
// ==============================

// --- Explosões ---
function drawExplosions() {
  for (const ex of explosions) {
    for (let i = 0; i < 12; i++) {
      ctx.fillStyle = `rgba(${200 + Math.random() * 55}, ${80 + Math.random() * 50}, 0, ${ex.alpha})`;
      const rx = ex.x + (Math.random() - 0.5) * ex.radius;
      const ry = ex.y + (Math.random() - 0.5) * ex.radius;
      ctx.fillRect(rx, ry, 2, 2);
    }
    ex.alpha -= 0.04;
    ex.radius += 0.6;
  }
  for (let i = explosions.length - 1; i >= 0; i--) {
    if (explosions[i].alpha <= 0) explosions.splice(i, 1);
  }
}

// --- Fragmentos narrativos ---
let fragmentData = null;
let fragmentIndex = 0;
let fragmentToast = null; // {text, alpha, time}

async function loadFragmentsOnce() {
  if (fragmentData) return;
  try {
    const res = await fetch("data/fragments.json", { cache: "no-store" });
    fragmentData = await res.json();
  } catch {
    fragmentData = [
      { id: 1, text: "Fragmento: Um eco distante revela um nome esquecido." },
      { id: 2, text: "Fragmento: Entre ruídos, uma promessa retorna." },
      { id: 3, text: "Fragmento: Lembranças cintilam como estrelas." },
    ];
  }
}

function queueFragmentToast() {
  loadFragmentsOnce().then(() => {
    const frag = fragmentData[fragmentIndex % fragmentData.length];
    fragmentIndex++;
    fragmentToast = { text: frag.text, alpha: 0, time: performance.now() };
  });
}

function drawFragmentToast() {
  if (!fragmentToast) return;
  const t = (performance.now() - fragmentToast.time) / 1000;
  const fadeIn = Math.min(1, t / 0.4);
  const fadeOut = t > 2.6 ? Math.max(0, 1 - (t - 2.6) / 0.6) : 1;
  const alpha = fadeIn * fadeOut;
  if (alpha <= 0 && t > 3.2) {
    fragmentToast = null;
    return;
  }

  const maxW = canvas.width * 0.7;
  const x = canvas.width / 2 - maxW / 2;
  const y = 40;

  ctx.save();
  ctx.globalAlpha = 0.85 * alpha;
  ctx.fillStyle = "rgba(17,24,39,0.9)";
  ctx.fillRect(x, y, maxW, 60);
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = "rgba(56,189,248,0.9)";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, maxW, 60);

  ctx.fillStyle = "cyan";
  ctx.font = "16px Courier New";
  ctx.fillText(fragmentToast.text, x + 24, y + 36 - 12);
  ctx.restore();
}
