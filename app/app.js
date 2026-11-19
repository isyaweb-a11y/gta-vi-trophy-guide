// app.js — entry point of the Leonida Legend trophy guide: loads the official
// 55-trophy list from ./data/trophies.json (the only file fetched, and it lives
// inside app/), wires the checklist, filters, spoiler mode, guide panel, roadmap
// view and progress export/import together. No network requests at runtime.

import {
  loadEarnedNames,
  saveEarnedNames,
  loadSpoilerMode,
  saveSpoilerMode,
  toggleEarnedName,
  countByGrade,
  buildProgressExport,
  downloadProgressExport,
  readProgressImport,
  resetAllProgress,
} from './js/tracker-state.js';
import {
  createFilterState,
  filterTrophies,
  isMaskedBySpoiler,
  formatCountTarget,
  KIND_LABELS,
} from './js/filters.js';
import { renderRoadmapInto } from './js/roadmap.js';
import { createGuidePanel } from './js/guide-panel.js';

const trophyListElement = document.getElementById('trophy-list');
const emptyMessageElement = document.getElementById('empty-message');
const progressSummaryElement = document.getElementById('progress-summary');
const progressFillElement = document.getElementById('progress-bar-fill');
const gradeProgressElement = document.getElementById('grade-progress');
const visibleCountElement = document.getElementById('visible-count');
const checklistViewElement = document.getElementById('checklist-view');
const roadmapViewElement = document.getElementById('roadmap-view');
const roadmapStagesElement = document.getElementById('roadmap-stages');
const mainLayoutElement = document.getElementById('main-layout');

const guidePanel = createGuidePanel(document.getElementById('guide-panel'));

let trophies = [];
let earnedNames = loadEarnedNames();
let spoilerOn = loadSpoilerMode();
let selectedTrophy = null;
const filters = createFilterState();

function renderHeaderProgress() {
  const total = trophies.length;
  const earnedCount = trophies.filter((t) => earnedNames.has(t.name)).length;
  const percent = total === 0 ? 0 : Math.round((earnedCount / total) * 100);
  progressSummaryElement.textContent = `${earnedCount} of ${total} earned · ${percent}%`;
  progressFillElement.style.width = `${percent}%`;
  const { totals, earned } = countByGrade(trophies, earnedNames);
  gradeProgressElement.textContent =
    `Platinum ${earned.platinum}/${totals.platinum} · Gold ${earned.gold}/${totals.gold} · ` +
    `Silver ${earned.silver}/${totals.silver} · Bronze ${earned.bronze}/${totals.bronze}`;
}

function buildTrophyCard(trophy) {
  const isEarned = earnedNames.has(trophy.name);
  const masked = isMaskedBySpoiler(trophy, earnedNames, spoilerOn);
  const card = document.createElement('article');
  card.className = `trophy-card grade-${trophy.grade}${isEarned ? ' is-earned' : ''}` +
    (selectedTrophy && selectedTrophy.name === trophy.name ? ' is-selected' : '');

  const top = document.createElement('div');
  top.className = 'card-top';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = isEarned;
  checkbox.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  checkbox.addEventListener('click', (event) => event.stopPropagation());
  checkbox.addEventListener('change', () => {
    toggleEarnedName(earnedNames, trophy.name);
    renderAll();
  });
  const textBlock = document.createElement('div');
  const nameElement = document.createElement('h3');
  nameElement.className = 'trophy-name';
  nameElement.textContent = masked ? 'Hidden trophy' : trophy.name;
  const descriptionElement = document.createElement('p');
  descriptionElement.className = 'trophy-description';
  descriptionElement.textContent = masked
    ? 'Hidden on PSN — spoiler mode is hiding this story trophy until you earn it.'
    : trophy.description;
  textBlock.append(nameElement, descriptionElement);
  top.append(checkbox, textBlock);

  const badges = document.createElement('div');
  badges.className = 'card-badges';
  const gradeBadge = document.createElement('span');
  gradeBadge.className = `badge badge-grade-${trophy.grade}`;
  gradeBadge.textContent = trophy.grade.toUpperCase();
  badges.append(gradeBadge);
  const kindBadge = document.createElement('span');
  kindBadge.className = 'badge';
  kindBadge.textContent = KIND_LABELS[trophy.kind] ?? trophy.kind;
  badges.append(kindBadge);
  const countLabel = formatCountTarget(trophy);
  if (countLabel) {
    const countBadge = document.createElement('span');
    countBadge.className = 'badge';
    countBadge.textContent = countLabel;
    badges.append(countBadge);
  }
  if (trophy.missable) {
    const missableBadge = document.createElement('span');
    missableBadge.className = 'badge badge-missable';
    missableBadge.textContent = 'MISSABLE';
    badges.append(missableBadge);
  }
  if (trophy.hidden) {
    const hiddenBadge = document.createElement('span');
    hiddenBadge.className = 'badge badge-hidden';
    hiddenBadge.textContent = 'HIDDEN';
    badges.append(hiddenBadge);
  }
  const stageBadge = document.createElement('span');
  stageBadge.className = 'badge';
  stageBadge.textContent = `Stage ${trophy.stage}`;
  badges.append(stageBadge);
  if (isEarned) {
    const earnedBadge = document.createElement('span');
    earnedBadge.className = 'badge badge-earned';
    earnedBadge.textContent = 'EARNED ✓';
    badges.append(earnedBadge);
  }

  const hint = document.createElement('p');
  hint.className = 'card-guide-hint';
  hint.textContent = 'Click for the full guide + cited sources →';

  card.append(top, badges, hint);
  card.addEventListener('click', () => selectTrophy(trophy));
  return card;
}

function renderChecklist() {
  const visible = filterTrophies(trophies, filters, earnedNames);
  trophyListElement.replaceChildren(...visible.map(buildTrophyCard));
  emptyMessageElement.hidden = visible.length > 0;
  visibleCountElement.textContent = `Showing ${visible.length} of ${trophies.length} trophies`;
}

function renderRoadmap() {
  renderRoadmapInto(roadmapStagesElement, trophies, earnedNames, selectTrophy);
}

function renderAll() {
  renderHeaderProgress();
  renderChecklist();
  renderRoadmap();
  if (selectedTrophy) {
    guidePanel.showGuideFor(selectedTrophy, earnedNames.has(selectedTrophy.name), handlePanelToggle);
  }
}

function selectTrophy(trophy) {
  selectedTrophy = trophy;
  mainLayoutElement.classList.remove('no-panel');
  guidePanel.showGuideFor(trophy, earnedNames.has(trophy.name), handlePanelToggle);
  renderChecklist();
}

function handlePanelToggle(trophy) {
  toggleEarnedName(earnedNames, trophy.name);
  renderAll();
}

function wireControls() {
  document.getElementById('search-input').addEventListener('input', (event) => {
    filters.searchText = event.target.value;
    renderChecklist();
  });
  document.getElementById('kind-filter').addEventListener('change', (event) => {
    filters.kind = event.target.value;
    renderChecklist();
  });
  document.getElementById('grade-filter').addEventListener('change', (event) => {
    filters.grade = event.target.value;
    renderChecklist();
  });
  document.getElementById('earned-filter').addEventListener('change', (event) => {
    filters.earnedState = event.target.value;
    renderChecklist();
  });
  document.getElementById('missable-toggle').addEventListener('change', (event) => {
    filters.missableOnly = event.target.checked;
    renderChecklist();
  });
  const spoilerToggle = document.getElementById('spoiler-toggle');
  spoilerToggle.checked = spoilerOn;
  spoilerToggle.addEventListener('change', (event) => {
    spoilerOn = event.target.checked;
    saveSpoilerMode(spoilerOn);
    renderChecklist();
  });
  document.getElementById('export-button').addEventListener('click', () => {
    downloadProgressExport(buildProgressExport(trophies, earnedNames, spoilerOn));
  });
  document.getElementById('import-input').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      earnedNames = await readProgressImport(file, new Set(trophies.map((t) => t.name)));
      saveEarnedNames(earnedNames);
      renderAll();
    } catch {
      visibleCountElement.textContent = 'That import file could not be read as trophy progress.';
    }
    event.target.value = '';
  });
  document.getElementById('reset-button').addEventListener('click', () => {
    resetAllProgress();
    earnedNames = new Set();
    spoilerOn = false;
    document.getElementById('spoiler-toggle').checked = false;
    renderAll();
  });
  document.getElementById('guide-close').addEventListener('click', () => {
    selectedTrophy = null;
    guidePanel.hideGuide();
    mainLayoutElement.classList.add('no-panel');
    renderChecklist();
  });
  const tabChecklist = document.getElementById('tab-checklist');
  const tabRoadmap = document.getElementById('tab-roadmap');
  tabChecklist.addEventListener('click', () => {
    checklistViewElement.hidden = false;
    roadmapViewElement.hidden = true;
    tabChecklist.classList.add('is-active');
    tabRoadmap.classList.remove('is-active');
  });
  tabRoadmap.addEventListener('click', () => {
    checklistViewElement.hidden = true;
    roadmapViewElement.hidden = false;
    tabRoadmap.classList.add('is-active');
    tabChecklist.classList.remove('is-active');
    renderRoadmap();
  });
}

async function loadTrophyData() {
  const response = await fetch('./data/trophies.json');
  const data = await response.json();
  trophies = Array.isArray(data) ? data : data.trophies;
}

wireControls();
await loadTrophyData();
renderAll();
