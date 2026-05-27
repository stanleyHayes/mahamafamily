# Mahama Portfolios — Monorepo

Portfolio sites + admin dashboards + backends for three Ghanaian public figures:

| Subject | Public site | Admin | Backend |
| --- | --- | --- | --- |
| **Ibrahim Mahama** — industrialist, founder of Engineers & Planners | `apps/ibrahim-website` | `apps/ibrahim-admin` | `apps/ibrahim-backend` |
| **John Dramani Mahama** — President of Ghana | `apps/john-website` | `apps/john-admin` | `apps/john-backend` |
| **Sharaf Mahama** — boxing promoter, FIFA agent, sports entrepreneur | `apps/sharaf-website` | `apps/sharaf-admin` | `apps/sharaf-backend` |

## Stack

- pnpm + Turborepo
- React + TypeScript + MUI (frontends)
- Express + Inversify + hexagonal architecture (backends)
- MongoDB
- Hand-rolled JWT
- Resend (email), Cloudinary (media), OpenAI (AI assist)
- Render (deployment)

## Layout

```
apps/
  ibrahim-website  ibrahim-admin  ibrahim-backend
  john-website     john-admin     john-backend
  sharaf-website   sharaf-admin   sharaf-backend
packages/
  shared-types       — Domain types shared FE/BE
  ui-theme           — MUI themes per subject + shared components
  jwt-utils          — Hand-rolled JWT (HS256)
  api-client         — Frontend HTTP client
  backend-core       — Hexagonal building blocks (Result, errors, Inversify symbols)
  config             — Eslint/tsconfig/env helpers
.research/           — Research markdown for seeding bios
```

## Setup

```bash
pnpm install
pnpm dev
```

Each backend reads `.env` (see `apps/*/env.example`).
