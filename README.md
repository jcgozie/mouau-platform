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

## Stage 3 — Colleges, Departments, Centres & Excellence

- `/colleges` — full index. `/colleges/[slug]` — College profile template:
  real Departments and Programmes filtered live from the same Department
  and Programme records used elsewhere (not re-typed per college).
- `/colleges/[slug]/[deptSlug]` — Department profile: Programmes
  (cross-linked via `Programme.departmentSlug`), Courses (matched by
  department name), and staff — verified end-to-end (e.g. Crop Science
  correctly shows B.Agric. Crop Science and its two CSC courses).
- `/centres` and `/centres/[slug]` — Centre/Institute profile template.
  The Projects & Outputs section is honestly labeled as a Stage 4
  dependency rather than faked with placeholder content.
- New data: `lib/departmentsData.ts` (Department, cross-linked to College
  by `collegeSlug`). `College` and `Centre` types extended with
  dean/mission/facilities/contact and director/mandate/facilities/contact
  respectively, in `lib/types.ts` and `lib/mockData.ts` — not a second,
  parallel dataset.

## Stage 4 — Research & Innovation Hub

- `/research` — landing with entry points to researchers, projects,
  publications, facilities, innovation/patents, and SDG impact mapping.
- `/research/researchers/[slug]` — profile with ORCID link and Person
  structured data. Enforces the contact-visibility opt-in from the spec:
  `contactPublished: false` genuinely hides contact info (see the
  Biotechnology Centre director's profile) rather than showing it with a
  UI toggle that could be bypassed.
- `/research/projects/[slug]` — SDG tags, researchers, and related
  publications all cross-linked from the same underlying records.
- `/research/publications/[slug]` — DOI link, ScholarlyArticle structured
  data, author cross-links back to researcher profiles.
- `/research/facilities` and `/research/facilities/[slug]` — **real
  refactor of Stage 3**: College/Centre `facilities` changed from a plain
  `string[]` to a genuine `Facility` relation (owner, location, equipment,
  manager, services). The Stage 3 College/Department pages were updated to
  read from this relation instead of a duplicated string list — verified
  the College of Agriculture page still renders its 3 facilities correctly,
  now as real links to `/research/facilities/[slug]`.
- `/research/impact` — SDG mapping view aggregating real projects per goal
  (verified: the cassava project correctly appears under both SDG 2 and
  SDG 13, matching its actual `sdgTags`).
- `/research/innovation` — patents/IP showcase and consultancy info,
  honestly labeled that licensing/consultancy requests become real tracked
  requests only once Stage 13 (Partner/Industry Portal) exists.
- New data: `lib/researchData.ts` (Researcher, ResearchProject,
  Publication, Facility — all cross-linked to Department/College/Centre
  slugs already established in Stages 2–3, not a parallel dataset).
