// guide-panel.js — the detail panel for one trophy: its full guide in our own words,
// the missable flag with its reasoning, its count target, kind and grade, and the
// sources the guide cites, rendered as ordinary links (the app itself fetches nothing).

import { KIND_LABELS, formatCountTarget } from './filters.js';

export function createGuidePanel(panelElement) {
  const title = panelElement.querySelector('[data-guide-title]');
  const meta = panelElement.querySelector('[data-guide-meta]');
  const description = panelElement.querySelector('[data-guide-description]');
  const guideText = panelElement.querySelector('[data-guide-text]');
  const missableBox = panelElement.querySelector('[data-guide-missable]');
  const sourcesList = panelElement.querySelector('[data-guide-sources]');
  const earnedToggle = panelElement.querySelector('[data-guide-earned]');

  let currentTrophy = null;

  function showGuideFor(trophy, isEarned, onToggleEarned) {
    currentTrophy = trophy;
    panelElement.hidden = false;
    title.textContent = trophy.name;
    const countLabel = formatCountTarget(trophy);
    meta.textContent = [
      `Grade: ${trophy.grade}`,
      `Kind: ${KIND_LABELS[trophy.kind] ?? trophy.kind}`,
      `Roadmap stage ${trophy.stage}`,
      countLabel,
      trophy.hidden ? 'Hidden on PSN until earned' : '',
    ]
      .filter(Boolean)
      .join(' · ');
    description.textContent = trophy.description;
    guideText.textContent = trophy.guide;
    missableBox.hidden = false;
    missableBox.className = trophy.missable ? 'missable-flag is-missable' : 'missable-flag is-safe';
    missableBox.textContent = trophy.missable
      ? `MISSABLE — ${trophy.missableNote}`
      : `Not missable. ${trophy.missableNote}`;
    sourcesList.replaceChildren();
    for (const source of trophy.sources ?? []) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = source.url;
      link.textContent = source.name;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      item.append(link);
      sourcesList.append(item);
    }
    earnedToggle.textContent = isEarned ? 'Earned ✓ — tap to undo' : 'Mark as earned';
    earnedToggle.onclick = () => {
      if (currentTrophy) onToggleEarned(currentTrophy);
    };
  }

  function hideGuide() {
    panelElement.hidden = true;
    currentTrophy = null;
  }

  return { showGuideFor, hideGuide, getCurrentTrophy: () => currentTrophy };
}
