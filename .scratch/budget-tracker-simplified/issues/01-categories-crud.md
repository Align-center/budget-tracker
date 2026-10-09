# 01: Categories CRUD

**What to build:** Full create/read/update/delete for categories with name, icon, and color. User can manage their custom category list.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

## Acceptance Criteria

- [ ] Zod schema (`src/lib/schemas/category.ts`): name (required, max 100, unique), icon (required, lucide name), color (required, hex)
- [ ] DB wrapper (`src/lib/db.ts`): category CRUD functions with Dexie
- [ ] Hook (`src/hooks/useCategories.ts`): state + add/update/delete/refresh, unique name validation, loading/error states
- [ ] Form (`src/components/forms/CategoryForm.tsx`): RHF + Zod, name input, curated ~30 icon grid picker, hex color input + picker, validation errors inline
- [ ] List (`src/components/lists/CategoryList.tsx`): table with colored icon, name, color swatch, edit/delete actions, empty state
- [ ] Page (`src/app/(dashboard)/categories/page.tsx`): uses hook, "Add Category" button opens form dialog, renders list
- [ ] Unit tests: schema valid/invalid, DB CRUD (fake-indexeddb), hook logic (renderHook)
- [ ] Component tests: Form (validation, submit, prefill), List (empty, render, edit/delete actions)
- [ ] TypeScript strict passes, lint passes
