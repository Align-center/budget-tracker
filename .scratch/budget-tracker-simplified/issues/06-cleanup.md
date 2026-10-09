# 06: Cleanup

**What to build:** Remove all old architecture code (budgets, repository pattern, Context/Reducers, Recharts) and verify clean build.

**Blocked by:** 05 (needs E2E verification before removing old code)

**Status:** ready-for-agent

## Acceptance Criteria

- [ ] Delete budget code: `src/lib/schemas/budget.ts`, any budget repository/context/reducer/hooks/UI
- [ ] Delete repository pattern: all `*Repository.ts` interfaces and implementations
- [ ] Delete Context + Reducer: all `*Context.tsx` providers, `*Reducer.ts` files
- [ ] Remove Recharts: `pnpm remove recharts`, delete any Recharts chart components
- [ ] Remove unused dependencies: audit `package.json`, remove budget/reports utils no longer needed
- [ ] Fix all broken imports from deleted files
- [ ] Verify: `pnpm build` succeeds, `pnpm typecheck` passes, `pnpm lint` passes
- [ ] Verify: all unit/component tests still pass (`pnpm test`)
- [ ] Verify: E2E tests still pass (`pnpm test:e2e`)
- [ ] Bundle size reduced (compare before/after)
