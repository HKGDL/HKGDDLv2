const API_BASE = 'https://api.hkgdl.dpdns.org';

export const userStore = Vue.reactive({
  token: localStorage.getItem('user_token') || null,
  user: null,
  unreadCount: 0,
});

export async function loadUser() {
  if (!userStore.token) return;
  try {
    const res = await fetch(`${API_BASE}/api/user/me`, {
      headers: { 'Authorization': `Bearer ${userStore.token}` },
    });
    if (!res.ok) { logoutUser(); return; }
    userStore.user = await res.json();
    loadUnreadCount();
  } catch { logoutUser(); }
}

export async function loadUnreadCount() {
  if (!userStore.token) return;
  try {
    const res = await fetch(`${API_BASE}/api/notifications`, {
      headers: { 'Authorization': `Bearer ${userStore.token}` },
    });
    if (res.ok) {
      const data = await res.json();
      userStore.unreadCount = data.unreadCount || 0;
    }
  } catch {}
}

export async function loginUser(username, password) {
  const res = await fetch(`${API_BASE}/api/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  userStore.token = data.token;
  userStore.user = data.user;
  localStorage.setItem('user_token', data.token);
  await loadUnreadCount();
  return data;
}

export async function registerUser(username, password, displayName, email) {
  const res = await fetch(`${API_BASE}/api/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, displayName, email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  userStore.token = data.token;
  userStore.user = data.user;
  localStorage.setItem('user_token', data.token);
  return data;
}

export function logoutUser() {
  userStore.token = null;
  userStore.user = null;
  userStore.unreadCount = 0;
  localStorage.removeItem('user_token');
}

export async function updateProfile(updates) {
  if (!userStore.token) throw new Error('Not logged in');
  const res = await fetch(`${API_BASE}/api/user/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userStore.token}` },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Update failed');
  if (updates.displayName) userStore.user.displayName = updates.displayName;
  if (updates.email !== undefined) userStore.user.email = updates.email;
  if (updates.discordUsername) userStore.user.discordUsername = updates.discordUsername;
  if (updates.playerName !== undefined) userStore.user.playerName = updates.playerName;
  return data;
}

export async function submitClaim(playerName) {
  if (!userStore.token) throw new Error('Not logged in');
  const res = await fetch(`${API_BASE}/api/claims`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${userStore.token}` },
    body: JSON.stringify({ playerName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to submit claim');
  return data;
}

export async function fetchNotifications() {
  if (!userStore.token) return { notifications: [], unreadCount: 0 };
  const res = await fetch(`${API_BASE}/api/notifications`, {
    headers: { 'Authorization': `Bearer ${userStore.token}` },
  });
  if (!res.ok) return { notifications: [], unreadCount: 0 };
  return res.json();
}

export async function markNotifRead(id) {
  if (!userStore.token) return;
  await fetch(`${API_BASE}/api/notifications/${id}/read`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${userStore.token}` },
  });
}

export async function markAllRead() {
  if (!userStore.token) return;
  await fetch(`${API_BASE}/api/notifications/read-all`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${userStore.token}` },
  });
  userStore.unreadCount = 0;
}
