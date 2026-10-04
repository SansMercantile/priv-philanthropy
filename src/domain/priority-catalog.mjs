export const PRIORITIES = Object.freeze([
  Object.freeze({
    id: 'reliable-power',
    number: '01',
    category: 'energy',
    categoryLabel: 'Power',
    title: 'Reliable community power',
    summary: 'Explore dependable energy approaches shaped around homes, local enterprise, and community priorities.',
    description: 'This concept area considers resilient, locally useful power infrastructure. No site, provider, community partner, or implementation model has been selected.',
    nextStep: 'Listen to local priorities, assess feasibility with qualified partners, and publish the proposed scope before seeking funds.',
    keywords: ['electricity', 'energy', 'resilience', 'enterprise'],
    accent: 'blue',
  }),
  Object.freeze({
    id: 'clean-water',
    number: '02',
    category: 'water',
    categoryLabel: 'Water',
    title: 'Clean water resilience',
    summary: 'Consider practical ways communities can strengthen reliable access to safe water and maintain shared infrastructure.',
    description: 'This concept area is about reliable water access and long-term maintenance. No project, engineering assessment, or delivery partner is currently confirmed.',
    nextStep: 'Identify community-led needs and obtain technical, operating, and maintenance assessments from qualified local partners.',
    keywords: ['water', 'health', 'infrastructure', 'resilience'],
    accent: 'copper',
  }),
  Object.freeze({
    id: 'safe-shared-places',
    number: '03',
    category: 'community',
    categoryLabel: 'Community spaces',
    title: 'Safe places to belong',
    summary: 'Explore shared spaces and community infrastructure that support connection, safety, and everyday life.',
    description: 'This concept area could include places to gather and participate in community life. No location, design, owner, or safety plan has been approved.',
    nextStep: 'Work with local organizations to define the need, ownership, safeguarding, accessibility, and ongoing operating responsibilities.',
    keywords: ['community', 'safety', 'shared space', 'belonging'],
    accent: 'gold',
  }),
  Object.freeze({
    id: 'learning-health',
    number: '04',
    category: 'learning-health',
    categoryLabel: 'Learning & health',
    title: 'Opportunity close to home',
    summary: 'Explore community-defined priorities for learning and accessible health services across generations.',
    description: 'This concept area recognizes learning and health as foundations for community wellbeing. No school, clinic, service provider, or program is currently selected.',
    nextStep: 'Consult qualified local education and health partners, verify service needs, and define measurable, privacy-respecting evidence.',
    keywords: ['education', 'school', 'health', 'clinic', 'opportunity'],
    accent: 'forest',
  }),
]);

export function filterPriorities(priorities = PRIORITIES, {
  query = '',
  category = 'all',
  savedIds = [],
} = {}) {
  const needle = String(query).trim().toLocaleLowerCase('en');
  const saved = new Set(savedIds);

  return priorities.filter((priority) => {
    if (category === 'saved' && !saved.has(priority.id)) return false;
    if (category !== 'all' && category !== 'saved' && priority.category !== category) return false;
    if (!needle) return true;
    const searchable = [
      priority.title,
      priority.summary,
      priority.description,
      priority.categoryLabel,
      ...priority.keywords,
    ].join(' ').toLocaleLowerCase('en');
    return searchable.includes(needle);
  });
}

export function toggleSavedPriority(savedIds, priorityId) {
  if (!PRIORITIES.some((priority) => priority.id === priorityId)) {
    throw new RangeError('priorityId is not in the catalog');
  }
  const saved = new Set(savedIds);
  if (saved.has(priorityId)) saved.delete(priorityId);
  else saved.add(priorityId);
  return [...saved];
}