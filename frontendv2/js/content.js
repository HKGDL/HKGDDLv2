import { round, score } from './score.js';
import { apiFetch, fetchLevels } from './api.js';

const KNOWN_MAPPINGS = {
  'nexus': 'skyehi',
  '3^3=7': '3³=7',
  'yourlui': 'Yorklui',
};

async function resolveNames(names) {
  const unique = [...new Set(names.map(n => n.toLowerCase()))];
  const results = await Promise.allSettled(
    unique.map(async (name) => {
      const res = await apiFetch(`/api/player-mapping?gameName=${encodeURIComponent(name)}`);
      return { from: name, mapped: res.isMapped, to: res.dbName || name };
    })
  );
  const apiMap = {};
  results.forEach(r => {
    if (r.status === 'fulfilled' && r.value.mapped) apiMap[r.value.from] = r.value.to;
  });
  return (name) => {
    const lower = name.toLowerCase();
    if (apiMap[lower]) return apiMap[lower];
    if (KNOWN_MAPPINGS[lower]) return KNOWN_MAPPINGS[lower];
    return lower;
  };
}

const CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 1 week
let _cachedList = null;
let _cachedTime = 0;

export async function fetchList() {
  if (_cachedList && Date.now() - _cachedTime < CACHE_TTL) return _cachedList;
  try {
    const levels = await fetchLevels();
    _cachedList = levels.map(level => [level, null]);
    _cachedTime = Date.now();
    return _cachedList;
  } catch {
    console.error('Failed to load list.');
    return null;
  }
}

export async function fetchEditors() {
  return [];
}

export async function fetchLeaderboard() {
  const list = await fetchList();
  if (!list) return [[], []];

  // Collect all unique names for resolution
  const allNames = [];
  list.forEach(([level]) => {
    level.records.forEach(r => allNames.push(r.user));
  });
  const resolve = await resolveNames(allNames);

  const totalLevels = list.length;
  const scoreMap = {};
  const errs = [];
  list.forEach(([level, err], rank) => {
    if (err) { errs.push(err); return; }

    level.records.forEach(record => {
      const user = resolve(record.user);
      scoreMap[user] ??= { completed: [], progressed: [] };
      const { completed, progressed } = scoreMap[user];
      const r = level.rank || rank + 1;
      const pts = record.points != null ? record.points : score(r, record.percent === 100 ? 100 : record.percent, level.percentToQualify, totalLevels);
      if (record.percent === 100) {
        completed.push({ rank: r, level: level.name, score: pts, link: record.link });
      } else {
        progressed.push({ rank: r, level: level.name, percent: record.percent, score: pts, link: record.link });
      }
    });
  });

  const res = Object.entries(scoreMap).map(([user, scores]) => {
    const { completed, progressed } = scores;
    const total = [...completed, ...progressed].reduce((prev, cur) => prev + cur.score, 0);
    return { user, total: round(total), ...scores };
  });

  return [res.sort((a, b) => b.total - a.total), errs];
}
