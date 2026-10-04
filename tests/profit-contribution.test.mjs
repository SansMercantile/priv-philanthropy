import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateProfitContribution } from '../src/domain/profit-contribution.mjs';

const basePolicy = {
  optedIn: true,
  netRealizedProfitMinor: 25_000,
  rateBasisPoints: 100,
  periodCapMinor: 1_000,
  annualCapMinor: 5_000,
  annualCommittedMinor: 0,
};

test('calculates a percentage of net realized profit in integer minor units', () => {
  assert.equal(calculateProfitContribution(basePolicy), 250);
});

test('returns zero when the donor has not opted in', () => {
  assert.equal(calculateProfitContribution({ ...basePolicy, optedIn: false }), 0);
});

test('returns zero when net realized profit is zero or negative', () => {
  assert.equal(calculateProfitContribution({ ...basePolicy, netRealizedProfitMinor: 0 }), 0);
  assert.equal(calculateProfitContribution({ ...basePolicy, netRealizedProfitMinor: -10_000 }), 0);
});

test('applies both the per-period cap and remaining annual cap', () => {
  assert.equal(calculateProfitContribution({ ...basePolicy, periodCapMinor: 100 }), 100);
  assert.equal(calculateProfitContribution({ ...basePolicy, annualCommittedMinor: 4_950 }), 50);
  assert.equal(calculateProfitContribution({ ...basePolicy, annualCommittedMinor: 5_000 }), 0);
});

test('rejects rates outside basis-point bounds and fractional minor units', () => {
  assert.throws(() => calculateProfitContribution({ ...basePolicy, rateBasisPoints: 10_001 }), RangeError);
  assert.throws(() => calculateProfitContribution({ ...basePolicy, netRealizedProfitMinor: 1.25 }), TypeError);
});
