// ═══════════════════════════════════════════════
// API.JS — Fetch wrappers for backend REST API
// ═══════════════════════════════════════════════
const BASE = '/api';

// ─── Get stored token ─────────────────────────
const getToken = () => sessionStorage.getItem('ss_token');

// ─── Core request helper ──────────────────────
async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res  = await fetch(`${BASE}${path}`, options);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || `Request failed: ${res.status}`);
  return data;
}

// ─── Auth ──────────────────────────────────────
export const auth = {
  register: (payload)  => request('POST', '/auth/register', payload),
  login:    (payload)  => request('POST', '/auth/login',    payload),
  me:       ()         => request('GET',  '/auth/me'),
};

// ─── User ──────────────────────────────────────
export const users = {
  getProfile:    ()        => request('GET',  '/users/profile'),
  updateProfile: (payload) => request('PUT',  '/users/profile', payload),
  getStats:      ()        => request('GET',  '/users/stats'),
};

// ─── Food ──────────────────────────────────────
export const food = {
  getProducts:          (category) => request('GET',  `/food/products${category ? `?category=${category}` : ''}`),
  logFood:              (payload)  => request('POST', '/food/log', payload),
  completeCorrectiveAction: (logId, type) => request('POST', `/food/log/${logId}/corrective`, { type }),
  getHistory:           (page = 1) => request('GET',  `/food/history?page=${page}`),
};

// ─── Points ────────────────────────────────────
export const points = {
  get:     ()          => request('GET',  '/points'),
  history: (days = 7)  => request('GET',  `/points/history?days=${days}`),
  award:   (payload)   => request('POST', '/points/award', payload),
};

// ─── Marathon ──────────────────────────────────
export const marathon = {
  get:          ()                          => request('GET',   '/marathon'),
  completeTask: (dayIndex, taskIndex)       => request('PATCH', '/marathon/task', { dayIndex, taskIndex }),
  complete:     ()                          => request('POST',  '/marathon/complete'),
};

// ─── Community ─────────────────────────────────
export const community = {
  getGroups:    ()       => request('GET',  '/community/groups'),
  joinGroup:    (id)     => request('POST', `/community/groups/${id}/join`),
  leaderboard:  ()       => request('GET',  '/community/leaderboard'),
};

// ─── Report ────────────────────────────────────
export const report = {
  get: () => request('GET', '/report'),
};
