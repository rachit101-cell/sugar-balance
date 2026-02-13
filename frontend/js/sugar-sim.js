// ═══════════════════════════════════════════════
// SUGAR-SIM.JS — Brix-based sugar simulation
// ═══════════════════════════════════════════════

// Max Brix we scale to (Jalebi = 24° is the highest)
const MAX_BRIX = 24;

// ─── Get sugar level from Brix ────────────────
export function getLevelFromBrix(brix) {
  if (brix <= 8)  return 'Low';
  if (brix <= 15) return 'Medium';
  return 'High';
}

// ─── Calculate ring offset for SVG ───────────
export function brixToRingOffset(brix, circumference = 314) {
  const pct = Math.min(brix / MAX_BRIX, 1);
  return circumference - circumference * pct;
}

// ─── Sugar impact label ───────────────────────
export function getSugarImpactLabel(level) {
  const labels = {
    Low:    '✅ Low sugar impact. Great choice!',
    Medium: '⚠️ Moderate sugar. A walk will help.',
    High:   '🚨 High sugar spike detected! Act now.',
  };
  return labels[level] || '';
}

// ─── Corrective points by level ───────────────
export function getCorrectivePoints(level) {
  return { Low: 10, Medium: 20, High: 30 }[level] ?? 20;
}

// ─── Animate ring ─────────────────────────────
export function animateRing(ringEl, brix, colorMap = { Low:'#34D399', Medium:'#FBBF24', High:'#FB7185' }) {
  const level      = getLevelFromBrix(brix);
  const offset     = brixToRingOffset(brix);
  ringEl.style.stroke           = colorMap[level];
  ringEl.style.strokeDashoffset = 314;  // reset

  setTimeout(() => {
    ringEl.style.strokeDashoffset = offset;
  }, 80);
}
