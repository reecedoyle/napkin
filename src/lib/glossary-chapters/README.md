# Per-chapter glossary files

One file per chapter, named after the chapter directory slug
(e.g. `part-9-complex-analysis-01-holomorphic-functions.ts`). Each file
default-exports a `Record<string, GlossaryEntry>`:

```ts
import type { GlossaryEntry } from '../glossary';

const entries: Record<string, GlossaryEntry> = {
  holomorphic: {
    term: 'Holomorphic',
    definition: 'Complex-differentiable on an open set …',
    example: '…',
  },
};

export default entries;
```

`glossary.ts` merges every file here into the global `glossary` via
`import.meta.glob`, after the base map. Because each chapter owns its own
file, parallel chapter-authoring agents never edit a shared file — there
are no merge conflicts and no dedup step at finalize time. A key defined
here overrides the same key in the base map (last spread wins), so keep
keys unique across chapters.
