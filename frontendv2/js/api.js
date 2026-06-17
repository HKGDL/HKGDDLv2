const API_BASE = 'https://api.hkgdl.dpdns.org';

export async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export async function apiPost(path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function apiGet(path, token) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

export async function apiDelete(path, token) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method: 'DELETE', headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function apiPut(path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

export async function fetchLevels() {
  const levels = await apiFetch('/api/levels');
  const filtered = levels.filter(l => l.hkgdRank > 0 && !(l.tags || []).some(t => t.toLowerCase() === 'platformer'));
  filtered.sort((a, b) => (a.aredlRank ?? 9999) - (b.aredlRank ?? 9999));
  return filtered.map((l, i) => ({
    id: parseInt(l.levelId) || 0,
    name: l.name,
    author: l.creator || 'Unknown',
    creators: [],
    verifier: l.verifier || 'Unknown',
    verification: l.records?.[0]?.videoUrl || '',
    percentToQualify: 100,
    password: 'Free to Copy',
    rank: i + 1,
    records: (l.records || []).map(r => ({
      user: r.player,
      link: r.videoUrl || '',
      percent: 100,
      hz: r.fps ? parseInt(r.fps) : null,
      mobile: false,
      points: r.points || null,
    })),
  }));
}

export async function fetchLeaderboardData() {
  const levels = await fetchLevels();
  const scoreMap = {};
  levels.forEach((level, rank) => {
    const verifier = level.verifier;
    scoreMap[verifier] = scoreMap[verifier] || { verified: [], completed: [], progressed: [] };
    scoreMap[verifier].verified.push({ rank: rank + 1, level: level.name, score: 0, link: level.verification });

    level.records.forEach(record => {
      const user = record.user;
      scoreMap[user] = scoreMap[user] || { verified: [], completed: [], progressed: [] };
      scoreMap[user].completed.push({ rank: rank + 1, level: level.name, score: 0, link: record.link });
    });
  });
  return Object.entries(scoreMap).map(([user, scores]) => ({
    user,
    total: (scores.verified.length + scores.completed.length + scores.progressed.length) * 100,
    ...scores,
  })).sort((a, b) => b.total - a.total);
}

export async function fetchChangelog() {
  return apiFetch('/api/changelog');
}

export async function submitRecord(data) {
  return apiPost('/api/pending-submissions', {
    id: `sub-${Date.now()}`,
    levelId: data.levelId,
    levelName: data.levelName,
    isNewLevel: false,
    record: { player: data.player, videoUrl: data.videoUrl, fps: data.fps ? parseInt(data.fps) : null },
    submittedAt: new Date().toISOString(),
    submittedBy: data.player,
    status: 'pending',
  });
}
