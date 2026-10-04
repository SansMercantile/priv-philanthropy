const BASIS_POINTS = 10_000;

function assertMinorUnits(name, value, { allowNegative = false } = {}) {
  if (!Number.isSafeInteger(value) || (!allowNegative && value < 0)) {
    throw new TypeError(`${name} must be a ${allowNegative ? 'safe integer' : 'non-negative safe integer'}`);
  }
}

/**
 * Calculates a donor-authorized contribution from net realized trading profit.
 * This is a calculation only: callers must persist consent and ledger entries,
 * and must not interpret the returned amount as permission to charge a payment method.
 */
export function calculateProfitContribution({
  optedIn,
  netRealizedProfitMinor,
  rateBasisPoints,
  periodCapMinor,
  annualCapMinor,
  annualCommittedMinor,
}) {
  if (typeof optedIn !== 'boolean') {
    throw new TypeError('optedIn must be a boolean');
  }
  assertMinorUnits('netRealizedProfitMinor', netRealizedProfitMinor, { allowNegative: true });
  assertMinorUnits('periodCapMinor', periodCapMinor);
  assertMinorUnits('annualCapMinor', annualCapMinor);
  assertMinorUnits('annualCommittedMinor', annualCommittedMinor);

  if (!Number.isInteger(rateBasisPoints) || rateBasisPoints < 0 || rateBasisPoints > BASIS_POINTS) {
    throw new RangeError(`rateBasisPoints must be between 0 and ${BASIS_POINTS}`);
  }
  if (!optedIn || netRealizedProfitMinor <= 0 || rateBasisPoints === 0) {
    return 0;
  }

  const calculatedMinor =
    (BigInt(netRealizedProfitMinor) * BigInt(rateBasisPoints)) / BigInt(BASIS_POINTS);
  const remainingAnnualMinor = Math.max(0, annualCapMinor - annualCommittedMinor);
  const contributionMinor = [
    calculatedMinor,
    BigInt(periodCapMinor),
    BigInt(remainingAnnualMinor),
  ].reduce((smallest, amount) => amount < smallest ? amount : smallest);

  return Number(contributionMinor);
}
