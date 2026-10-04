import { PRIORITIES, filterPriorities, toggleSavedPriority } from './domain/priority-catalog.mjs';

const STORAGE_KEY = 'priv-philanthropy:saved-priorities:v1';
const grid = document.querySelector('#priority-grid');
const search = document.querySelector('#priority-search');
const count = document.querySelector('#result-count');
const savedViewButton = document.querySelector('#saved-view');
const savedCount = document.querySelector('#saved-count');
const storageNote = document.querySelector('#storage-note');
const dialog = document.querySelector('#priority-dialog');
const dialogSave = document.querySelector('#dialog-save');

function loadSaved() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(stored)
      ? stored.filter((id) => PRIORITIES.some((priority) => priority.id === id))
      : [];
  } catch {
    storageNote.hidden = false;
    return [];
  }
}

let savedIds = loadSaved();
let activeCategory = 'all';
let showingSaved = false;
let selectedPriority = null;

function storeSaved() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
    storageNote.hidden = true;
  } catch {
    storageNote.hidden = false;
  }
}

function updateSavedCount() {
  savedCount.textContent = String(savedIds.length);
}

function render() {
  const category = showingSaved ? 'saved' : activeCategory;
  const results = filterPriorities(PRIORITIES, {
    query: search.value,
    category,
    savedIds,
  });
  grid.replaceChildren();
  count.textContent = `${results.length} ${results.length === 1 ? 'priority' : 'priorities'}${showingSaved ? ' saved in this browser' : ''}`;

  if (results.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = showingSaved
      ? 'No saved priorities yet. Explore the concepts and save any you want to revisit.'
      : 'No priorities match this search. Try a different term or area.';
    grid.append(empty);
    return;
  }

  for (const priority of results) {
    const card = document.createElement('article');
    card.className = 'priority-card';
    card.style.setProperty('--card-accent', `var(--${priority.accent})`);
    const isSaved = savedIds.includes(priority.id);
    card.innerHTML = `
      <div class="priority-card-top">
        <span class="priority-index">${priority.number}</span>
        <span class="priority-category">${priority.categoryLabel}</span>
        <button class="save-button" type="button" data-save="${priority.id}" aria-pressed="${isSaved}">${isSaved ? 'Saved' : 'Save'}</button>
      </div>
      <h3>${priority.title}</h3>
      <p>${priority.summary}</p>
      <div class="priority-card-bottom">
        <span class="concept-tag">Concept · not active</span>
        <button type="button" data-open="${priority.id}">View details <span aria-hidden="true">→</span></button>
      </div>`;
    grid.append(card);
  }
}

function updateDialogSave() {
  const isSaved = selectedPriority && savedIds.includes(selectedPriority.id);
  dialogSave.textContent = isSaved ? 'Remove saved priority' : 'Save priority';
  dialogSave.setAttribute('aria-pressed', String(Boolean(isSaved)));
}

function openPriority(priorityId) {
  selectedPriority = PRIORITIES.find((priority) => priority.id === priorityId);
  if (!selectedPriority) return;
  document.querySelector('#dialog-category').textContent = `${selectedPriority.categoryLabel} · Concept only`;
  document.querySelector('#dialog-title').textContent = selectedPriority.title;
  document.querySelector('#dialog-summary').textContent = selectedPriority.summary;
  document.querySelector('#dialog-description').textContent = selectedPriority.description;
  document.querySelector('#dialog-next-step').textContent = selectedPriority.nextStep;
  updateDialogSave();
  dialog.showModal();
}

search.addEventListener('input', render);
document.querySelectorAll('[data-category]').forEach((button) => {
  button.addEventListener('click', () => {
    activeCategory = button.dataset.category;
    showingSaved = false;
    savedViewButton.setAttribute('aria-pressed', 'false');
    document.querySelectorAll('[data-category]').forEach((filter) => {
      filter.setAttribute('aria-pressed', String(filter === button));
    });
    render();
  });
});

savedViewButton.addEventListener('click', () => {
  showingSaved = !showingSaved;
  savedViewButton.setAttribute('aria-pressed', String(showingSaved));
  render();
});

grid.addEventListener('click', (event) => {
  const saveButton = event.target.closest('[data-save]');
  if (saveButton) {
    savedIds = toggleSavedPriority(savedIds, saveButton.dataset.save);
    storeSaved();
    updateSavedCount();
    render();
    updateDialogSave();
    return;
  }
  const openButton = event.target.closest('[data-open]');
  if (openButton) openPriority(openButton.dataset.open);
});

dialogSave.addEventListener('click', () => {
  if (!selectedPriority) return;
  savedIds = toggleSavedPriority(savedIds, selectedPriority.id);
  storeSaved();
  updateSavedCount();
  updateDialogSave();
  render();
});

document.querySelector('#dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

updateSavedCount();
render();