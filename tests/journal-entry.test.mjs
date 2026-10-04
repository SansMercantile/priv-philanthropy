import test from 'node:test';
import assert from 'node:assert/strict';
import { createJournalEntry } from '../src/domain/journal-entry.mjs';

const validEntry = {
  id: 'entry-1',
  idempotencyKey: 'provider:event-1',
  source: 'priv_core_profit_share',
  status: 'received',
  amountMinor: 250,
  currency: 'ZAR',
  occurredAt: '2026-10-04T12:00:00.000Z',
  consentId: 'consent-7',
  lines: [
    { account: 'cash:clearing', side: 'debit', amountMinor: 250 },
    { account: 'fund:general', side: 'credit', amountMinor: 250 },
  ],
};

test('accepts and freezes a balanced donor-funded entry with consent', () => {
  const entry = createJournalEntry(validEntry);
  assert.equal(entry.amountMinor, 250);
  assert.equal(entry.consentId, 'consent-7');
  assert.equal(Object.isFrozen(entry), true);
  assert.equal(Object.isFrozen(entry.lines[0]), true);
});

test('rejects unbalanced journal lines', () => {
  assert.throws(() => createJournalEntry({
    ...validEntry,
    lines: [
      { account: 'cash:clearing', side: 'debit', amountMinor: 250 },
      { account: 'fund:general', side: 'credit', amountMinor: 249 },
    ],
  }), /must balance/);
});

test('requires donor consent but not donor consent for company-funded entries', () => {
  assert.throws(() => createJournalEntry({ ...validEntry, consentId: null }), /require a consentId/);
  assert.equal(createJournalEntry({
    ...validEntry,
    source: 'priv_pay_company_contribution',
    consentId: null,
  }).consentId, null);
});

test('rejects floating-point minor units', () => {
  assert.throws(() => createJournalEntry({
    ...validEntry,
    amountMinor: 250.5,
  }), /positive safe integer/);
});
