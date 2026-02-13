// ═══════════════════════════════════════════════
// CELEBRATIONS.JS — Confetti, trophy, toasts, particles
// ═══════════════════════════════════════════════

// ─── Toast ────────────────────────────────────
export function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  existing?.remove();

  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  if (type === 'error') t.style.background = 'linear-gradient(135deg,#EF4444,#FB7185)';
  document.body.appendChild(t);

  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => {
    t.classList.remove('show');
    setTimeout(() => t.remove(), 350);
  }, 2600);
}

// ─── Confetti burst ───────────────────────────
export function spawnConfetti(count = 90) {
  const colors = ['#C084FC','#FB7185','#34D399','#FBBF24','#60A5FA','#F9A8D4','#FDE68A'];
  for (let i = 0; i < count; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.cssText = `
      position:fixed;
      left: ${Math.random() * 100}vw;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      width:  ${6 + Math.random() * 10}px;
      height: ${6 + Math.random() * 10}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '3px'};
      z-index: 5001; pointer-events: none;
      animation: confettiFall ${1.5 + Math.random() * 2}s linear ${Math.random() * 0.6}s forwards;
    `;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4000);
  }
}

// ─── Marathon celebration ─────────────────────
export function celebrate() {
  const el = document.getElementById('celebration');
  if (el) {
    el.classList.add('show');
    spawnConfetti();
  }
}

export function closeCelebration() {
  document.getElementById('celebration')?.classList.remove('show');
}

// ─── Ambient particles ────────────────────────
export function spawnParticles() {
  const colors = ['#C084FC','#FB7185','#34D399','#FBBF24','#60A5FA','#F9A8D4'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}vw;
      width:  ${4 + Math.random() * 6}px;
      height: ${4 + Math.random() * 6}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${8 + Math.random() * 14}s;
      animation-delay: ${-Math.random() * 14}s;
    `;
    document.body.appendChild(p);
  }
}

// ─── Wire close button ────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('celebrationClose')?.addEventListener('click', closeCelebration);
});
