# MOUAU Digital University Platform — Stages 1–2

Real, working code for **Stage 1** (homepage) and **Stage 2** (About,
Study, Contact & Support) of the 19-stage build playbook. Next.js 14
(App Router) + TypeScript + Tailwind CSS.

## What's real here

**Stage 1 — Homepage**: Header nav (mobile menu), Hero, Portal tiles,
Research strip, Partnerships/Giving, Colleges & Centres "field row"
showcases, Innovation pull-quote, International block, Student Life /
Alumni teasers, News feed, Facts strip, Rankings/SDG block, Footer.

**Stage 2 — About, Study, Contact & Support**:
- `/about` — history, vision/mission/values, leadership, policy library,
  accreditation, transparency link.
- `/study` — landing segmented by level (Undergraduate/Postgraduate/CEC/Professional).
- `/study/programmes` — the **Programme Finder**, filterable by search
  term, level, and college. Built as a real `<form method="get">` —
  filtering happens server-side against `searchParams`, so it works
  correctly with JavaScript disabled, per the Stage 2 spec's low-bandwidth
  requirement. Verified: `?level=Postgraduate` correctly narrows results
  and the `<select>` reflects the active filter.
- `/study/programmes/[slug]` — programme detail template (statically
  generated per programme), with Course-style structured data.
- `/study/courses` — course catalogue table.
- `/study/fees`, `/study/scholarships`, `/study/admissions`,
  `/study/international` — informational pages per the spec.
- `/contact` — searchable directory (also a real GET-form filter),
  campus map placeholder (honestly labeled as a Stage 15 dependency,
  not faked), emergency contact, support form, complaints entry point.
- `/contact/accessibility` — accessibility statement.

All Stage 2 pages reuse Stage 1's `Header`, `Footer`, and the shared
`PageIntro` component — no new nav or footer was built per page.

## What's mocked, and how to connect the real thing

- **Content**: `lib/mockData.ts` (Stage 1), `lib/aboutData.ts`,
  `lib/studyData.ts`, `lib/contactData.ts` (Stage 2) stand in for the real
  CMS. Every component reads from the typed shapes in `lib/types.ts`, not
  from the mock files directly — swap `lib/cms.ts`'s `fetchHomepageData()`
  (and add equivalents for About/Study/Contact) to call your real CMS's
  HTTP API via `CMS_API_URL`, and no component code needs to change.
- **Fonts**: Fraunces (display) and IBM Plex Sans (body) load via a
  `<link>` tag in `app/layout.tsx` — works in any real deployment. This
  build sandbox can't reach `fonts.googleapis.com`, so a close serif/sans
  fallback stack is defined in `app/globals.css` in the meantime.
- **Programme/Course data**: illustrative. Per Stage 2's non-negotiable,
  this data model is exactly what Stage 6 (Institutional Directory
  Registry) and Stage 3 (Colleges/Departments) will read from — do not
  redefine Programme/Course elsewhere; extend these types instead.
- **Not yet built** (linked from these pages but return 404 until a later
  pass): `/about/policies/[slug]` detail pages, `/about/transparency`,
  `/contact/complaints` as a dedicated page. The complaints *entry point*
  exists at `/contact#complaints`; the full SERVICOM-aligned workflow is
  Stage 15 per the playbook.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000, live reload
# or
npm run build && npm run start   # production build
```

## What's not in this scaffold

Stages 1–2 only — public content. No authentication (Stage 7), no
SIS/portals (Stages 8–13), no payments (Stage 14), no backend beyond the
mock content API route. Those get built the same way, stage by stage,
growing this same repository rather than starting over each time.

## Project structure

```
app/
  layout.tsx                Root layout, fonts, structured data
  page.tsx                   Homepage (Stage 1)
  about/page.tsx              About (Stage 2)
  study/
    page.tsx                  Study landing
    programmes/page.tsx        Programme Finder (server-rendered filter)
    programmes/[slug]/page.tsx  Programme detail template
    courses/page.tsx            Course catalogue
    fees/, scholarships/, admissions/, international/  Informational pages
  contact/
    page.tsx                  Directory, map placeholder, forms
    accessibility/page.tsx     Accessibility statement
  api/homepage/route.ts      Mock CMS endpoint
components/                   One file per reusable section
lib/
  types.ts                   Full CMS content model (Stage 1 + 2)
  mockData.ts / aboutData.ts / studyData.ts / contactData.ts   Mock content
  cms.ts                       Single point of integration with the real CMS
db/
  schema.sql                 Postgres schema (Stage 1 content model)
```
