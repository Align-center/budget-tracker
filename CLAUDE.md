## Agent skills

### Issue tracker

Issues live as local markdown files under `.scratch/`. See `docs/agents/issue-tracker.md`.

### Triage labels

Using the default five canonical labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: `CONTEXT.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

## Code quality checks

**Before every commit**, run these commands in order:

```bash
pnpm lint
pnpm format
pnpm type-check
```

If any errors arise, fix them before committing. Commits should NOT have a body or footer.
