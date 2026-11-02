# Priv Philanthropy

A standalone, static pre-launch site for Priv Philanthropy. It introduces the long-term community-investment vision and a proposed giving experience; it does not process donations or report active programs.

The working product slice is `platform.html`: visitors can search and filter four exploratory community-priority areas, read their current concept briefs, and save priorities in local browser storage. These are not active projects, and saved items are not sent to a server.

The legacy roadmap's pilot dates and reported metrics were not carried forward because the source page identifies them as placeholders and they have not been independently verified.

## Run locally

Open `index.html` directly to read the vision, or open `platform.html` to use the priority explorer. The static site also works with any file server.

## Deploy with Vercel

Import this repository as a static site. No framework preset, install command, build command, environment variables, or output directory are required. The entry page is `index.html` at the repository root.

The page directs visitors to platform updates. Do not enable payment links until the operating entity, recipient and disbursement model, local legal review, and payment-provider approval are confirmed. Any future Priv Core company contribution must be calculated from realized company net profit, not user trading volume or client assets, and must have a published cap.

## Domain tests

The initial contribution-policy and journal-entry modules use only Node.js built-ins and can be tested with:

```powershell
node --test tests/*.test.mjs
```

The policy module is not connected to a live account, payment method, or persistent ledger. It does not authorize charges.
