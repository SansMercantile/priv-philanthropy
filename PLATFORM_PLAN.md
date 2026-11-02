# Priv Philanthropy Platform Plan

## Executive Summary

Priv Philanthropy is currently a public-facing static site, not a live donations product. The existing “Open platform” links returned visitors to that same site. The CTA now points to a launch-updates/contact action while the giving platform is developed.

Build the giving experience as a dedicated product with separately accounted funding sources: personal gifts; an optional donor-selected share of that donor's own net realized Priv Core trading profit; any voluntary company contribution from Priv's realized company profit; and a company-funded Priv Pay contribution. These are different sources with different owners and consent requirements. Never calculate a donation from trading notional, customer balances, card draws, or Priv Pay purchase principal. Do not accept or route live funds until the operating entity, recipient/funds flow, payment-provider approval, and applicable legal and tax treatment have been confirmed.

South Africa is a working launch-market assumption, not a confirmed requirement. This plan is product and engineering guidance, not legal or tax advice.

## What Exists Today

- `index.html` is the static Philanthropy landing page; it does not provide donor accounts, payments, a ledger, project grants, or a support assistant.
- The local Priv Core React app has a dashboard and AI assistant, but its app is trading-focused and applies identity/KYC assumptions that should not be copied into a donor product unchanged.
- The legacy `constellation/priv/website/social-impact.html` contains placeholder statements and purported pilot results. Do not republish its figures or case studies as verified impact.
- No philanthropy payment or grant-disbursement backend has been verified.

## Donor Experience

### Public pages

- Explain the mission, legal operator, how each funding source works, current projects, allocation rules, fees, and verified impact.
- Show project evidence and reporting dates. Label plans, targets, and independently verified outcomes distinctly.
- Provide a clear giving route and donor support contact. Until checkout is approved and operational, use an early-access or updates CTA instead.

### Donor account and dashboard

- Allow guest one-time gifts if the approved provider and legal model support them; offer an account for receipts, recurring-gift controls, and history.
- Show each gift's amount, currency, date, provider reference, status, source, any applicable fees, and associated project or general fund.
- Distinguish `payment received`, `available`, `committed`, `disbursed`, and `reported`; never describe a pledge as a completed transfer.
- Provide receipts and downloadable statements. Claim tax deductibility only for gifts that legally qualify and only after the eligible entity and receipt process are confirmed.
- Let donors change or cancel future recurring gifts and preferences. Make cancellation easy to find and effective before the next scheduled charge.

### Support assistant

- Start with a clearly disclosed assistant grounded only in approved mission, project, donation, receipt, privacy, and account-help content.
- Keep personal and payment data out of prompts unless necessary and covered by the privacy notice and processor agreements. Do not send card credentials, identity documents, or sensitive personal information to a model.
- Do not let AI approve grants, make eligibility decisions, promise outcomes, or give legal, tax, or investment advice. Escalate account, payment, safeguarding, complaints, and uncertainty to a person.
- Log only what is needed for service quality and dispute handling; set and disclose retention periods.

## Contribution Model

### Personal gifts

Offer one-time gifts first. Add recurring gifts only after the merchant account, recurring-payment mandate, cancellation process, receipts, and support workflow are ready. Make amount, currency, destination, cadence, and any platform-retained amount clear before authorization.

### Donor-selected Priv Core profit share

Make this a separate, voluntary donor instruction; never debit or earmark a broker balance. The donor chooses a rate and explicit per-period and annual caps, sees a preview, and confirms the contribution using an approved giving payment method. The calculation base is the donor's net realized profit for the selected period after netting settled wins and losses across the donor's included accounts; open positions, deposits, withdrawals, trading notional, and unrealized P/L are excluded. Contributions stop immediately for future periods when the donor opts out. Calculate in integer minor units and reserve cap headroom for pending as well as received contributions. A future calculation is `min(period_cap, annual_cap - annual_committed, rate * max(0, period_net_realized_profit))`. Do not offer a default rate or cap until governance approves them.

### Priv company profit contribution

Treat this separately from the donor-selected share above. The base must be reconciled, realized company net profit after approved costs, taxes, losses, and reserves, never customer trading volume, assets under management, or client money. Define a contribution rate, annual cap, approval, and payment date from company books. The rate and cap remain unset until governance approves them. Record the calculation and dual approval; never imply guaranteed contributions or create incentives for users to trade more.

### Priv Pay-linked contribution

Preferred starting model: a modest company-funded contribution calculated from separately verified Priv Pay company revenue (for example, earned platform fees) and paid from company funds. Publish the base, rate or fixed amount, cap, period, and payment evidence. Current Priv Pay customer transaction records show purchase and card-routing amounts, not company revenue; those records are not a valid donation base. It must not reduce a user's balance or silently alter the price of a Priv Pay transaction.

If a customer-funded gift is later considered, make it an independent, unchecked opt-in with its own amount and clear recipient/purpose, separate from payment-processing fees. Never treat it as a card surcharge or make a payment contingent on accepting it. Obtain written payment-provider approval for the exact checkout and settlement flow before enabling it.

### Opt-out, errors, and reversals

Opt-out stops future voluntary contributions and scheduled gifts; it does not claw back a completed, properly authorized allocation. Do not promise that all gifts are non-refundable. Publish a reviewed policy that covers mistakes, duplicates, unauthorized payments, provider reversals, chargebacks, fraud, and any statutory consumer rights. Record requests and outcomes.

## Product and Technical Shape

Use a dedicated philanthropy application and backend/API. Reuse Priv Core's visual assets or general UI components only where their licenses and dependencies fit; do not reuse its trading routes, auth/KYC gates, or AI behavior as the product architecture.

Core modules:

1. **Identity and consent:** donor accounts, guest-gift association, communication preferences, recurring mandates, versioned terms/privacy consent, and explicit opt-in records with timestamp and source.
2. **Projects and grants:** reviewed project profiles, eligibility and due diligence, approvals, agreements, milestone evidence, disbursements, and public reporting permissions.
3. **Payment adapter:** provider-neutral API boundary; server-side payment initialization; no secret keys in the browser; verify transaction status and amount; validate webhook signatures; make webhook handling idempotent; reconcile provider settlements and refunds.
4. **Double-entry ledger:** immutable postings for gifts, company contributions, provider fees, refunds/reversals, restricted or designated funds, commitments, and disbursements. Corrections use compensating entries, never edits to history.
5. **Administration and controls:** role-based access, separation of duties, dual approval for disbursements and beneficiary/bank-detail changes, audit logs, reconciliation exceptions, exports, and financial close.
6. **Reporting:** donor statements plus public, evidence-backed totals for funds received, fees, amounts committed and disbursed, recipients/projects, and reporting period. Protect beneficiary privacy and avoid claiming causality without evidence.
7. **Support:** case management and the constrained assistant described above, with a human escalation path.

### Engineering foundation started

- `src/domain/profit-contribution.mjs` calculates a donor-opted-in contribution from a period's net realized profit using integer minor units, an explicit rate, a period cap, and remaining annual cap. Opt-out, zero profit, and losses return zero. This pure function does not charge a payment method.
- `src/domain/journal-entry.mjs` validates source-tagged, balanced debit/credit entries and requires a consent reference for donor-funded sources. It freezes the returned record, but does not persist it; production storage must enforce unique idempotency keys and append-only records.
- The Priv Core and Priv Pay data connectors, durable donor preferences/consent, dashboard, payment adapter, and disbursement workflow are not implemented yet.

A small first release can use the existing React/Vite frontend and Express backend already present in the local Priv repo, but place philanthropy routes and data models behind a distinct application boundary. Select database, authentication, deployment, backups, and monitoring based on the approved data-residency, access-control, and audit requirements. The existing landing page alone is not a suitable payments backend.

## Launch Gates and Compliance Questions

Resolve these before accepting money:

- Confirm launch country, legal operator, bank account ownership, beneficiary relationship, and whether Priv Philanthropy is a charitable organization, company program, or a partnership with an established registered nonprofit/fiscal sponsor.
- Get local counsel/accountant advice on fundraising, custody/control of funds, grants, company contributions, tax treatment, donor statements, and any registration, reporting, or section 18A receipt requirements. Do not represent gifts as tax-deductible until eligibility is confirmed.
- Submit the exact activities and funds flow to Paystack (or the selected processor) and get written approval. Paystack's South Africa merchant agreement recognizes donations and bona fide charitable organizations, but also places intended-use communication, customer support/refunds, tax compliance, payout compliance, and customer-data obligations on the merchant. Its payout terms also restrict use to eligible recipient relationships and purposes. Do not assume a split-payment feature authorizes a donation marketplace, custodial model, or third-party grants.
- Determine privacy roles, lawful bases, Information Officer responsibilities, data-subject rights, retention, security controls, and cross-border processor arrangements under POPIA and other applicable law.
- Approve project due diligence, conflicts-of-interest, safeguarding, sanctions/fraud controls as applicable, disbursement evidence, complaints, refund/reversal, and records-retention procedures.
- Agree the contribution formulas and caps for company sources; define who approves calculations and public reporting.

## Delivery Phases

### Phase 0: Decide and validate

Confirm the launch market and legal structure; consult counsel/accounting; describe the donation and grant flow to candidate providers; choose a direct recipient or approved fiscal sponsor; define the project-selection and funds-use policy; approve source-specific formulas and refund/cancellation rules. Keep live payments disabled.

### Phase 1: Trustworthy MVP

Publish accurate mission, operator, fund-use, support, privacy, and reviewed terms information. Build one-time personal gifts, payment verification, donor receipts/history, admin reconciliation, immutable ledger entries, and manual dual-approved disbursements to vetted projects. Publish a simple, evidence-backed allocation report. Start with one payment provider and one market.

### Phase 2: Recurring and company contributions

Add recurring personal gifts with explicit mandates and cancellation controls. Add manually calculated Priv Core and Priv Pay company contributions as separate ledger sources after the formulas, accounting controls, and provider/legal review are signed off. Display these separately from donor gifts.

### Phase 3: Support and scale

Add the constrained AI support assistant with human escalation, then expand projects, payment methods, currencies, and geographies only after their compliance, provider, accounting, and operational controls are independently ready.

## Implementation Backlog

Treat each work package as a release gate. Work on public information and payment-free engineering can proceed while decisions are pending; accepting, holding, or disbursing real money cannot.

### 0. Approve the operating model

Create a dated decision record covering the launch market, legal operator and recipient, provider-approved funds flow, privacy roles, project selection, gift restrictions, refund policy, and ownership of financial approvals. Record the decision owner and supporting legal, accounting, and provider evidence. Keep all payment credentials and live checkout disabled until this package is approved.

**Exit criteria:** every launch-gate question above has an accountable owner and documented disposition; the recipient and payout account are verified; counsel/accounting review is complete; the payment provider has approved the described activity and funds flow in writing. Any unresolved item keeps live payments blocked.

### 1. Establish the application boundary

- Keep the existing static landing page available while building the product in a separately routed philanthropy application and API boundary. Do not mount donation endpoints on trading routes or reuse trading-specific identity/KYC assumptions without review.
- Define development, test, and production configuration separately. Keep provider secrets server-side and use synthetic donor, project, and payment data in development.
- Write and review the initial privacy notice, terms, support route, fund-use explanation, and project-content format before publishing claims about operations or impact.
- Add automated checks for the existing contribution calculator and journal validator, and document which inputs are trusted and which must come from verified financial records.

**Exit criteria:** the static site still works; the new application can run without payment credentials; test data is visibly synthetic; no live donor or broker data is read or written; and automated domain tests run in CI.

### 2. Build the ledger and payment sandbox

- Select a durable store and define migrations only after retention, residency, backup, and access requirements are agreed.
- Specify gift, consent, payment-attempt, provider-event, ledger-transaction, ledger-entry, project, and disbursement records. Store money as integer minor units with an explicit currency; retain provider references without storing card credentials.
- Enforce balanced journal entries, append-only corrections, source attribution, authorization checks, and unique idempotency keys at the persistence boundary. A process-local validator is not a production ledger.
- Define payment states and allowed transitions, including pending, verified, failed, refunded, reversed, committed, and disbursed. Reject amount or currency mismatches; do not treat a browser redirect as proof of payment.
- Implement the selected provider behind the adapter boundary in sandbox mode. Verify webhook signatures, acknowledge and deduplicate retries, tolerate out-of-order events, and reconcile provider settlements against ledger records.

**Exit criteria:** automated tests cover duplicate and replayed webhooks, invalid signatures, mismatched amounts/currencies, retries, refunds/reversals, ledger imbalance, duplicate idempotency keys, and reconciliation exceptions. Sandbox tests cannot create live charges or payouts.

### 3. Pilot one-time personal gifts

After Work Package 0 is approved, release one-time gifts for one approved market, currency, recipient flow, and provider. Start with general-fund gifts unless designated-project handling and its failure/refund rules have also been approved. Keep recurring gifts, profit-share contributions, company contributions, and Priv Pay-linked funding off.

- Show the recipient, amount, currency, designation, fees if applicable, and relevant terms before donor authorization.
- Create a server-side payment intent and associate it with consent and an idempotency key.
- Confirm payment from a verified provider status, issue a receipt only after confirmation, and show a donor-accessible history/status view.
- Provide an operator workflow for settlement reconciliation, duplicate/unauthorized-payment reports, refunds, and support escalation.

**Exit criteria:** end-to-end sandbox tests pass for successful, abandoned, failed, duplicate, delayed, refunded, and reversed payments; donor access is scoped to the donor; receipts reconcile to verified payments; support and incident runbooks have named owners; production enablement has a separate approval.

### 4. Add project grants and public reporting

- Require documented due diligence and approval before a project can receive funds. Track restrictions, conflicts, agreement terms, milestones, evidence, and reporting permissions.
- Require separation of duties and dual approval for disbursements and beneficiary or payout-detail changes. Record the approvers, amount, purpose, evidence, and resulting provider reference.
- Publish period-based totals for verified receipts, fees, commitments, disbursements, and remaining funds. Reconcile every published total to the ledger and protect beneficiary information.

**Exit criteria:** a test grant can move through review, approval, commitment, disbursement, and evidence/reporting without editing prior ledger entries; rejected and returned funds have explicit states; public totals reproduce from ledger data.

### 5. Add optional contribution sources independently

Evaluate each source as its own change request after the one-time-gift pilot is stable. No source inherits consent, approval, or provider authorization from another source.

- Recurring personal gifts require a clear mandate, notice before charges, change/cancel controls, retry rules, and tests proving opt-out prevents future charges.
- Donor-selected Priv Core contributions require explicit versioned opt-in and a verified settled-profit feed. Net settled wins and losses only; exclude deposits, withdrawals, notional, open positions, and unrealized P/L. Apply period and annual caps to pending plus received contributions.
- Priv company-profit contributions require reconciled company accounts, an approved net-profit definition, reserves, caps, dual approval, and a documented payment date.
- Priv Pay contributions require evidence of company revenue as the base. Never use customer purchase principal, card-routing amounts, balances, or user assets.

**Exit criteria:** source-specific calculations have finance approval and independent test fixtures; consent, calculation inputs, caps, and approvals are auditable; cancellation and correction paths are exercised; ledger and public reporting distinguish the source from personal gifts.

### Release operations checklist

Before any production money flow, verify provider and legal approvals remain current; production credentials are scoped and stored server-side; backups and restore have been tested; access and dual-approval roles are reviewed; webhook, reconciliation, refund, complaint, and incident alerts have owners; donor-facing copy matches the actual recipient and fund flow; and a named operator has completed a reconciliation and refund rehearsal. Rollout should begin with a restricted pilot and a documented stop procedure.

## Decisions Needed From Priv

1. Is South Africa the intended first market?
2. Which legal entity receives gifts and owns the payout account? Is a registered nonprofit or fiscal sponsor intended?
3. Should Priv Pay giving be company-funded per eligible activity (recommended first) or a separate customer opt-in?
4. What exactly counts as realized net Priv Core profit, and what rate, cap, reserve, and approval cadence should apply?
5. Are gifts general-purpose or donor-designated to projects? What happens if a designated project cannot use the funds?
6. What account and reporting features are essential for the first release, and can one-time gifts launch before recurring donations?

## Research References

- [Paystack South Africa Merchant Services Agreement and terms](https://paystack.com/za/terms): eligibility, donation communications, merchant responsibility, tax and payout terms, privacy, and payment requirements. Its terms can change; reconfirm with Paystack during onboarding.
- [Paystack Accept Payments](https://paystack.com/docs/payments/accept-payments/): initialize payments server-side, keep secret keys off the frontend, and verify transaction status and amount.
- [Paystack Webhooks](https://paystack.com/docs/payments/webhooks/): webhook signature validation, acknowledgements, and retries.
- [Paystack Verify Payments](https://paystack.com/docs/payments/verify-payments/): transaction status verification and recurring-payment considerations.
- [Paystack Split Payments](https://paystack.com/docs/payments/split-payments/): technical support for subaccounts and settlement splits. This is not confirmation that the proposed philanthropy model is approved.
- [South African Information Regulator: POPIA](https://inforegulator.org.za/popia/): official privacy-regulator resources. Confirm current obligations with local counsel.
- [SARS Tax Exempt Institutions](https://www.sars.gov.za/types-of-tax/tax-exempt-organisations/): official tax-exemption information. The page could not be reliably extracted during this research, so no eligibility or deductibility conclusion is drawn here.
