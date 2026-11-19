// filters.js — which trophies the checklist shows: kind, grade, earned state, a
// missable-only toggle and a free-text search over names and descriptions.

export const KIND_LABELS = {
  all: 'All kinds',
  story: 'Story',
  side: 'Side',
  collectibles: 'Collectibles',
  activities: 'Activities',
  feats: 'Feats',
  money: 'Money',
  meta: 'Meta',
};

export const GRADE_LABELS = {
  all: 'All grades',
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
};

export function createFilterState() {
  return { kind: 'all', grade: 'all', earnedState: 'all', missableOnly: false, searchText: '' };
}

export function trophyMatchesFilters(trophy, filters, earnedNames) {
  if (filters.kind !== 'all' && trophy.kind !== filters.kind) return false;
  if (filters.grade !== 'all' && trophy.grade !== filters.grade) return false;
  if (filters.missableOnly && !trophy.missable) return false;
  const isEarned = earnedNames.has(trophy.name);
  if (filters.earnedState === 'earned' && !isEarned) return false;
  if (filters.earnedState === 'unearned' && isEarned) return false;
  const query = filters.searchText.trim().toLowerCase();
  if (query) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.kind} ${trophy.grade}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  return true;
}

export function filterTrophies(trophies, filters, earnedNames) {
  return trophies.filter((trophy) => trophyMatchesFilters(trophy, filters, earnedNames));
}

export function isMaskedBySpoiler(trophy, earnedNames, spoilerOn) {
  return Boolean(spoilerOn && trophy.hidden && !earnedNames.has(trophy.name));
}

export function formatCountTarget(trophy) {
  if (typeof trophy.count !== 'number') return '';
  if (trophy.count >= 1000) return `Target: ${trophy.count.toLocaleString('en-US')}`;
  return `Target: ${trophy.count}`;
}
