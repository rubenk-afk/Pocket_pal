# Pocket Pal

A student-focused personal finance tracker built with React, TypeScript and Vite. Record income and expenses, manage manual account balances, track loans, and compare monthly spending with a budget.

## Features

- **Dashboard:** account balances, current budget status, recent transactions and upcoming bills.
- **Accounts:** independent Bank Account and FamPay balances, editable manually.
- **Transactions:** categorized income and expenses, dates, times and descriptions; deleting a transaction reverses its balance change.
- **Loans:** track money lent or borrowed and mark records settled.
- **Budgets:** monthly spending limits with an in-app warning at 80%.
- **Reminders:** due-date lists with active/inactive status and recurrence metadata.
- **Analytics and calendar:** visual spending summaries and daily expense totals.
- Responsive navigation and system/light/dark theme support.

## Run locally

Requires Node.js **22.18 or newer** and npm. No API keys or backend are required.

```sh
git clone https://github.com/rubenkennedy1810-maker/pocket-pal.git
cd pocket-pal
npm ci
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

```sh
npm test           # Finance regression tests; no third-party test dependencies
npm run typecheck  # TypeScript application check
npm run lint       # ESLint
npm run build      # Production files in dist/
npm run preview    # Serve the production build locally
```

## Data and balances

Data is stored in this browser's localStorage under `finance-data-v1`; no cloud account or bank connection is involved. All screens share one finance state. Each transaction and its balance adjustment are saved together in one storage write; failed writes show an error rather than appearing saved.

Existing `finance-accounts`, `finance-transactions`, `finance-loans`, `finance-budgets` and `finance-reminders` records are read on first use when the new key is absent. The old keys remain untouched. After the first successful change, `finance-data-v1` is authoritative. Unreadable records are not silently replaced with defaults.

- Income adds to the selected account; expenses subtract from it. Money is rounded to paise.
- Balances can be negative. Manual balance edits set the current balance and do not create transactions.
- Loans and settlement flags are a separate ledger; they do **not** automatically move account money. Record the corresponding income/expense separately when needed.
- Reminders are displayed inside the app. Recurrence is descriptive metadata: it does **not** advance dates or trigger background/push notifications.
- Browser data is not encrypted or synchronized. Clearing site data removes records. There is no backup/import interface yet.

## Deployment

Build command: `npm run build`. Output directory: `dist`. The included `vercel.json` sends application routes to `index.html`, so refreshing a page such as `/transactions` works on Vercel. Other static hosts need an equivalent single-page-app fallback.

Deployment changes are separate from local edits. The repository previously listed https://pocket-pal-five.vercel.app; this patch has not been deployed there.

## Project layout

```text
src/pages/                 Dashboard and finance screens
src/hooks/useFinanceData.ts Shared finance provider and storage migration
src/hooks/useLocalStorage.ts Persistence before publishing state
src/lib/finance.ts         Validated transaction/balance operations
src/types/finance.ts       Finance models and categories
src/components/            Layout, theme and reusable UI
tests/finance.test.ts      Finance regression tests
```

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui · Radix UI · React Router · Recharts · date-fns

## Current development status

An early-stage personal project originally scaffolded with Lovable. No download counts, external users, contributors or ecosystem dependencies are claimed here. Planned improvements include backup/export, fuller browser coverage and reminder recurrence behavior.

See [FIXES.md](FIXES.md) for changes and verification limits in this repair.
