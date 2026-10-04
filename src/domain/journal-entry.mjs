const SOURCES = new Set([
  'personal_gift',
  'priv_core_profit_share',
  'priv_core_company_contribution',
  'priv_pay_company_contribution',
]);
const DONOR_FUNDED_SOURCES = new Set(['personal_gift', 'priv_core_profit_share']);
const STATUSES = new Set([
  'pending',
  'received',
  'reserved',
  'allocated',
  'disbursed',
  'reported',
  'refunded',
  'reversed',
  'failed',
]);

/** Validates and freezes one balanced, source-tagged journal entry for persistence. */
export function createJournalEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    throw new TypeError('entry must be an object');
  }
  if (typeof entry.id !== 'string' || !entry.id.trim()) {
    throw new TypeError('id is required');
  }
  if (typeof entry.idempotencyKey !== 'string' || !entry.idempotencyKey.trim()) {
    throw new TypeError('idempotencyKey is required');
  }
  if (!SOURCES.has(entry.source)) {
    throw new RangeError('source is not supported');
  }
  if (!STATUSES.has(entry.status)) {
    throw new RangeError('status is not supported');
  }
  if (!/^[A-Z]{3}$/.test(entry.currency)) {
    throw new TypeError('currency must be a three-letter uppercase code');
  }
  if (!Number.isSafeInteger(entry.amountMinor) || entry.amountMinor <= 0) {
    throw new TypeError('amountMinor must be a positive safe integer');
  }
  if (!Number.isFinite(Date.parse(entry.occurredAt))) {
    throw new TypeError('occurredAt must be a valid date string');
  }
  if (DONOR_FUNDED_SOURCES.has(entry.source) &&
      (typeof entry.consentId !== 'string' || !entry.consentId.trim())) {
    throw new TypeError('donor-funded entries require a consentId');
  }
  if (!Array.isArray(entry.lines) || entry.lines.length < 2) {
    throw new TypeError('at least two journal lines are required');
  }

  let debits = 0n;
  let credits = 0n;
  const lines = entry.lines.map((line) => {
    if (!line || typeof line.account !== 'string' || !line.account.trim()) {
      throw new TypeError('each journal line requires an account');
    }
    if (!Number.isSafeInteger(line.amountMinor) || line.amountMinor <= 0) {
      throw new TypeError('journal line amounts must be positive safe integers');
    }
    if (line.side === 'debit') debits += BigInt(line.amountMinor);
    else if (line.side === 'credit') credits += BigInt(line.amountMinor);
    else throw new RangeError('journal line side must be debit or credit');
    return Object.freeze({ account: line.account, side: line.side, amountMinor: line.amountMinor });
  });

  if (debits !== credits || debits !== BigInt(entry.amountMinor)) {
    throw new RangeError('journal debits and credits must balance to amountMinor');
  }

  return Object.freeze({
    id: entry.id,
    idempotencyKey: entry.idempotencyKey,
    source: entry.source,
    status: entry.status,
    amountMinor: entry.amountMinor,
    currency: entry.currency,
    occurredAt: new Date(entry.occurredAt).toISOString(),
    consentId: entry.consentId ?? null,
    lines: Object.freeze(lines),
  });
}
