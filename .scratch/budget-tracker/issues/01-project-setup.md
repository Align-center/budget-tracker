# Issue 01: Project Setup

## Type: task

## Status: open

## Description

Install dependencies and configure tooling for the budget tracker project.

## Tasks

- [ ] Install runtime dependencies for `_dexie_`, `_form_`, `_chart_`, `_icon_`, `_cn_`
- [ ] Install dev dependencies for `_husky_`, `_lint_`, `_prettier_`
- [ ] Configure `_husky_` + `_lint_` in package.json
- [ ] Configure `_prettier_` with Tailwind plugin
- [ ] Set up path aliases in tsconfig.json
- [ ] Create `.env.local.example` template
- [ ] Create `.github/workflows/ci.yml` — GitHub Actions CI pipeline
  - Triggers: push to main, pull requests
  - Jobs: install, build, lint, type-check, format-check
  - Node: 20 LTS
  - Cache: pnpm store + Next.js build cache
- [ ] Add `type-check` script to package.json (`tsc --noEmit`)
- [ ] Add `format:check` script to package.json (`prettier --check .`)

## Acceptance Criteria

- [ ] `pnpm install` completes without errors
- [ ] `pnpm lint` runs ESLint successfully
- [ ] `pnpm format` runs Prettier successfully
- [ ] `pnpm type-check` passes
- [ ] `pnpm format:check` passes
- [ ] Path aliases work in imports
- [ ] `_husky_` runs on pre-commit
- [ ] GitHub Actions CI runs on push/PR
- [ ] CI passes: install, build, lint, type-check, format-check
