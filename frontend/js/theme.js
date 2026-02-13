// ═══════════════════════════════════════════════
// THEME.JS — Dark / Light mode toggle
// ═══════════════════════════════════════════════
import { state } from './app.js';

export function initTheme() {
  // Restore preference
  const saved = localStorage.getItem('ss_theme');
  if (saved === 'dark') _applyDark(true);

  document.getElementById('themeBtn')?.addEventListener('click', () => {
    state.isDark = !state.isDark;
    _applyDark(state.isDark);
    localStorage.setItem('ss_theme', state.isDark ? 'dark' : 'light');
  });
}

function _applyDark(isDark) {
  document.body.classList.toggle('dark', isDark);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = isDark ? '☀️' : '🌙';
  state.isDark = isDark;
}
