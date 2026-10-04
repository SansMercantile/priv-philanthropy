import assert from 'node:assert/strict';
import test from 'node:test';

import { PRIORITIES, filterPriorities, toggleSavedPriority } from '../src/domain/priority-catalog.mjs';

test('catalog contains four explicitly exploratory community priorities', () => {
  assert.equal(PRIORITIES.length, 4);
  assert.ok(PRIORITIES.every((priority) => priority.nextStep && priority.description));
});

test('filters priorities by category and case-insensitive search', () => {
  assert.deepEqual(filterPriorities(PRIORITIES, { category: 'water' }).map((item) => item.id), ['clean-water']);
  assert.deepEqual(filterPriorities(PRIORITIES, { query: 'CLINIC' }).map((item) => item.id), ['learning-health']);
});

test('saved view filters to the visitor-selected priorities', () => {
  assert.deepEqual(
    filterPriorities(PRIORITIES, { category: 'saved', savedIds: ['clean-water', 'safe-shared-places'] })
      .map((item) => item.id),
    ['clean-water', 'safe-shared-places'],
  );
});

test('saved priorities toggle without duplicates and reject unknown IDs', () => {
  assert.deepEqual(toggleSavedPriority([], 'clean-water'), ['clean-water']);
  assert.deepEqual(toggleSavedPriority(['clean-water'], 'clean-water'), []);
  assert.throws(() => toggleSavedPriority([], 'not-a-priority'), RangeError);
});