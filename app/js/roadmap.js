// roadmap.js — the road to the platinum: six stages in the order to play them, each
// derived from the official trophy descriptions (story chapters and named missions
// first, then side strands, collectibles, activities, money, and the cleanup that
// ends at 100% completion and the platinum itself).

export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Story first',
    summary:
      'Play the campaign straight through: Gone Fishing, Chapters 1-4, the named missions (Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory) and the final mission. Watch the flagged moment during the VCIA sequence (Catch Me If You Can) and keep a save before VCIA Takedown and before the finale.',
  },
  {
    stage: 2,
    title: 'Strangers & side strands',
    summary:
      'Finish the named-character strands to their final missions — Andy, Kenton, Billy, Randy and Tyrone — and complete 8 stranger strands in total for Strangers & Freaks. These finals are flagged as watch-out trophies, so clear them before the story finale rather than after it.',
  },
  {
    stage: 3,
    title: 'Collectibles & exploration',
    summary:
      'Sweep Leonida area by area: complete 3 collectible card sets, WAiNK It at 100 locations, discover 100 vehicles, register 10 vehicles to the Scooter Bros app, and explore all 52 areas. One district at a time keeps every count moving together.',
  },
  {
    stage: 4,
    title: 'Activities & challenges',
    summary:
      'Work the repeatable grind: 250 stunts, gold in all 42 Shooting Range challenges, drone-race wins at 14 locations, 20 different race wins, 18 meditation spots, 50 challenges, one arcade game, Cal\u2019s fishing challenge, Bret\u2019s hunt, and a first try of all 9 activity types.',
  },
  {
    stage: 5,
    title: 'Money & property',
    summary:
      'Turn crime into capital: launder $250,000 of Marked Bills through your contacts, spend $100,000 across all shops, and purchase all 8 garage properties. Run these together — laundering income is what pays for the garages.',
  },
  {
    stage: 6,
    title: 'Cleanup to 100% and the platinum',
    summary:
      'Mop up the one-off feats (the partner trophies Hot Together and Retail Therapy while your partner is with you, the 500 tracked choices, bank vaults, gang operations and the small free-roam feats), reach 100% Completion for A Long Road, and the platinum Vice Got a Price! follows as the 55th trophy.',
  },
];

export function trophiesForStage(trophies, stageNumber) {
  return trophies.filter((trophy) => trophy.stage === stageNumber);
}

export function buildRoadmapSections(trophies) {
  return ROADMAP_STAGES.map((stageInfo) => ({
    ...stageInfo,
    trophies: trophiesForStage(trophies, stageInfo.stage),
  }));
}

export function renderRoadmapInto(container, trophies, earnedNames, onSelectTrophy) {
  container.replaceChildren();
  for (const section of buildRoadmapSections(trophies)) {
    const block = document.createElement('section');
    block.className = 'roadmap-stage';
    const heading = document.createElement('h3');
    const doneCount = section.trophies.filter((t) => earnedNames.has(t.name)).length;
    heading.textContent = `Stage ${section.stage} — ${section.title} (${doneCount}/${section.trophies.length} earned)`;
    const summary = document.createElement('p');
    summary.className = 'roadmap-summary';
    summary.textContent = section.summary;
    const list = document.createElement('ul');
    list.className = 'roadmap-list';
    for (const trophy of section.trophies) {
      const item = document.createElement('li');
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'roadmap-item';
      const countNote = typeof trophy.count === 'number' ? ` · target ${trophy.count.toLocaleString('en-US')}` : '';
      const missableNote = trophy.missable ? ' · MISSABLE — watch out' : '';
      button.textContent = `${earnedNames.has(trophy.name) ? '✓ ' : ''}${trophy.name} (${trophy.grade})${countNote}${missableNote}`;
      button.addEventListener('click', () => onSelectTrophy(trophy));
      item.append(button);
      list.append(item);
    }
    block.append(heading, summary, list);
    container.append(block);
  }
}
