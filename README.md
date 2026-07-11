# CryptoWebb Frontend

React 18 + TypeScript + Vite SPA for the CryptoWebb onchain-intelligence platform.

## Stack

- **Build:** Vite · TypeScript strict
- **Styling:** Tailwind CSS 3.4 on a CSS-variable design-token system (dark-first slate/blue;
  light mode + a "matrix" easter-egg variant via `ThemeContext`)
- **Data:** TanStack React Query v5 over a typed axios client (`src/lib/axios.ts`)
- **Tables:** TanStack Table + TanStack Virtual (`src/components/ui/DataTable.tsx`)
- **Charts:** Apache ECharts (tree-shaken via `echarts/core`, themed from CSS tokens at runtime)
- **Routing:** React Router v6 with layout routes — `MarketingLayout` (topbar + footer) for
  content pages, `AppShell` (left sidebar) for the data product
- **Real-time:** WebSocket hub client (`src/hooks/useIndexerStream.ts`) for live whale/launch events
- **Testing:** Vitest + React Testing Library

## Development

```bash
npm install --legacy-peer-deps   # required (pinned in .npmrc)
npm run dev                      # Vite on :5173
npm run build                    # tsc + production build
npx vitest run                   # tests
npm run lint / npm run format
```

Environment (`.env`):

```
VITE_BACKEND_URL=http://localhost:8080
VITE_STRIPE_PUBLIC_KEY=pk_test_...
VITE_USE_MOCK_DATA=false   # true = generated indexer data, no backend needed
```

### Demo data mode

While the chain backfill is incomplete (or with no backend running at all), flip
`VITE_USE_MOCK_DATA=true` — every indexer surface (launches, whales, flows, smart money,
token/wallet pages, status) serves a deterministic generated dataset that honors all UI
filters, and the live feeds tick with synthesized events. At runtime, the **Demo data**
chip in the app topbar toggles it without a rebuild (localStorage override beats the env
default; feature-flag plumbing lives in `src/lib/flags.ts`, generators in
`src/features/indexer/mocks.ts`). The chip stays visible whenever demo data is active.

## Map

```
src/
  components/layout/   AppShell (sidebar product frame), MarketingLayout, Header, Footer
  components/ui/       DataTable, Card, Button, Dialog, PageHeader, ...
  features/            indexer/ (API hooks + types), charts/, dashboards/, pricing/, ...
  pages/               launches/ whales/ flows/ smart-money/ token/ wallet/ portfolio/
                       analytics/ (dashboards · metrics catalog · datasources) status/ docs/ ...
  lib/                 axios client, config, format helpers
```

Design system reference: run the app and open `/design`.
