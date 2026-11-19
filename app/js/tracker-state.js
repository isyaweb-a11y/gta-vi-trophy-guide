// tracker-state.js — the checker's saved progress: which trophies are earned and whether
// spoiler mode is on. Everything persists in localStorage so the guide works fully offline,
// and progress can be exported to a JSON file, imported back, or reset.

const EARNED_KEY = 'leonida-trophy-guide:earned:v1';
const SPOILER_KEY = 'leonida-trophy-guide:spoiler:v1';

export function loadEarnedNames() {
  try {
    const raw = localStorage.getItem(EARNED_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((n) => typeof n === 'string') : []);
  } catch {
    return new Set();
  }
}

export function saveEarnedNames(earnedNames) {
  localStorage.setItem(EARNED_KEY, JSON.stringify([...earnedNames]));
}

export function toggleEarnedName(earnedNames, trophyName) {
  if (earnedNames.has(trophyName)) earnedNames.delete(trophyName);
  else earnedNames.add(trophyName);
  saveEarnedNames(earnedNames);
  return earnedNames.has(trophyName);
}

export function loadSpoilerMode() {
  return localStorage.getItem(SPOILER_KEY) === 'on';
}

export function saveSpoilerMode(isOn) {
  localStorage.setItem(SPOILER_KEY, isOn ? 'on' : 'off');
}

export function countByGrade(trophies, earnedNames) {
  const totals = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  const earned = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const trophy of trophies) {
    totals[trophy.grade] = (totals[trophy.grade] ?? 0) + 1;
    if (earnedNames.has(trophy.name)) earned[trophy.grade] = (earned[trophy.grade] ?? 0) + 1;
  }
  return { totals, earned };
}

export function buildProgressExport(trophies, earnedNames, spoilerOn) {
  return {
    app: 'leonida-trophy-guide',
    version: 1,
    exportedAt: new Date().toISOString(),
    totalTrophies: trophies.length,
    earnedCount: earnedNames.size,
    spoilerOn,
    earned: [...earnedNames].sort(),
  };
}

export function downloadProgressExport(payload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'gta6-trophy-progress.json';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function readProgressImport(file, validNames) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  const list = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(list)) throw new Error('That file does not hold an earned list.');
  const names = list.filter((n) => typeof n === 'string' && validNames.has(n));
  return new Set(names);
}

export function resetAllProgress() {
  localStorage.removeItem(EARNED_KEY);
  localStorage.removeItem(SPOILER_KEY);
}
