# Repair notes

Prepared from the supplied pocket-pal-main.zip on 2026-11-08.

## Changes

- Replaced isolated finance-hook state with a single shared provider.
- Persist transaction records and account updates together in one versioned storage value.
- Preserve legacy storage keys while migrating existing records on first use.
- Reject invalid amounts, dates, times, account IDs and custom recurrence values.
- Round transaction amounts and account balance changes to paise.
- Keep forms open when saving fails and show the error.
- Prevent repeated transaction deletion from reversing a balance more than once.
- Reset the budget alert flag when a budget is edited; persist dismissal through the dialog close action.
- Count reminder dates by calendar day and remove the unsupported background-notification promise.
- Add a storage-error fallback without clearing saved data.
- Add Pocket Pal branding, navigation button labeling, deployment route fallback, setup documentation and finance regression tests.

## Verification

`npm test`: **8 tests passed** on Node.js 26.13.0.

TypeScript syntax transpilation checked 77 source/test files: **0 syntax errors**. This is not a full dependency-aware type check.

Dependency installation could not complete: the environment cannot resolve external package hosts, and the available npm cache is missing packages (including zod). Full Vite build, TypeScript, ESLint and browser interaction checks remain **unverified**. Run `npm ci`, `npm run typecheck`, `npm run lint` and `npm run build` in a connected environment before deployment.

These files were edited locally. They have not been pushed to GitHub or deployed.

## Browser smoke check after installing

1. Set Bank Account to 1000 and FamPay to 100.
2. Add a Bank expense of 125.50; check Bank is 874.50 and FamPay remains 100.
3. Open Dashboard, Accounts, Budget, Analytics and Calendar; confirm data agrees without a reload.
4. Delete the expense; check Bank returns to 1000 and the expense disappears everywhere.
5. Add an income and a second expense; reload and check records and balances persist.
6. Try zero/negative amounts, an empty date and a blank custom recurrence; check no records are created.
7. Set a monthly budget, exceed 80%, dismiss the alert and revisit Dashboard; check it stays dismissed.
8. On the deployed site, refresh `/transactions` and `/accounts` directly.

Use a test browser profile to avoid changing your actual finance records during these checks.
