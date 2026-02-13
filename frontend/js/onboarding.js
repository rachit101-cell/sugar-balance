// ═══════════════════════════════════════════════
// ONBOARDING.JS — Form validation & submit
// ═══════════════════════════════════════════════
import { state, showSection } from './app.js';
import { auth }               from './api.js';
import { showToast }          from './celebrations.js';
import { animatePoints }      from './points.js';

export async function completeOnboarding(e) {
  e.preventDefault();

  const name   = document.getElementById('ob-name').value.trim();
  const email  = document.getElementById('ob-email').value.trim();
  const pass   = document.getElementById('ob-password').value;
  const age    = +document.getElementById('ob-age').value;
  const height = +document.getElementById('ob-height').value;
  const weight = +document.getElementById('ob-weight').value;
  const sleep  = +document.getElementById('ob-sleep').value;
  const steps  = +document.getElementById('ob-steps').value;
  const goal   = document.getElementById('ob-goal').value;

  const btn = e.target.querySelector('button[type=submit]');
  btn.disabled  = true;
  btn.textContent = '✨ Setting up…';

  try {
    const res = await auth.register({
      name, email, password: pass,
      profile: { age, height, weight, sleepHours: sleep, dailySteps: steps, goal },
    });

    // Persist token & state
    sessionStorage.setItem('ss_token', res.token);
    state.user   = res.user;
    state.points = res.user.points;
    state.streak = res.user.streak;

    // Update UI names everywhere
    _applyUserToUI(name);
    animatePoints(state.points);

    btn.textContent = '🎉 Welcome aboard!';
    btn.style.background = 'linear-gradient(135deg, #34D399, #10B981)';

    setTimeout(() => showSection('home'), 700);
  } catch (err) {
    showToast(`❌ ${err.message}`, 'error');
    btn.disabled    = false;
    btn.textContent = '🚀 Begin My Sugar Streak Journey';
  }
}

function _applyUserToUI(name) {
  const initial = name.charAt(0).toUpperCase();
  document.querySelectorAll('.user-initial').forEach(el => el.textContent = initial);
  document.querySelectorAll('.user-name').forEach(el => el.textContent = name);
  document.querySelectorAll('.user-first').forEach(el => el.textContent = name.split(' ')[0]);
}

// ─── Wire form on DOM ready ────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('onboardForm');
  form?.addEventListener('submit', completeOnboarding);
});
