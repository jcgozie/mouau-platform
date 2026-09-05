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

## Stage 5 — News & Media

- `/news` — landing, filterable by category via real GET-form links.
- `/news/[slug]` — article detail with OpenGraph metadata, NewsArticle
  structured data, and a real "Related:" link to the tagged College/Centre.
- `/news/events` — upcoming/past toggle and audience filter, both via URL
  params. Verified: Upcoming view correctly sorts chronologically and
  excludes the past-dated Staff-only Senate briefing.
- `/news/events/[slug]` — registration CTA, livestream link, and a
  genuinely generated `.ics` calendar file (built from the event's real
  data, not a placeholder link).
- `/news/media-kit` — press contact and a real filtered press-release
  archive.
- **Site-wide emergency banner** (`components/EmergencyBanner.tsx`),
  wired into `app/layout.tsx` above every page's content — not scoped to
  the News section. Off by default (`isActive: false` in
  `lib/newsData.ts`); flip it to see it render site-wide. Dismissible,
  `role="alert"`/`aria-live="assertive"` for screen readers.
- **Real retrofit, not just new pages**: `NewsItem` now carries
  `relatedEntityType`/`relatedEntitySlug`. The Stage 3 College and Centre
  profile pages were updated to filter the global news list down to only
  articles tagged to that specific entity — verified the College of
  Agriculture page shows exactly its one tagged article, not the full
  4-item global feed.

## Stage 6 — Institutional Directory Registry

**Found and fixed a real duplicate-naming bug before building anything
new**: `Footer.tsx` and the now-retired `lib/contactData.ts` had two
different names for the ICT unit ("Information & Communication
Technology" vs "ICT Directorate"). Both now read from one source,
`lib/directoratesData.ts`.

- `/directorates` and `/directorates/[slug]` — mandate, services with
  real SLA days, forms, leadership, contact. Every "Submit a request"
  link goes to a working form.
- `/directorates/[slug]/request` + `app/api/service-requests/route.ts` —
  a **real** ticket system: POST creates a ticket with a generated ID,
  GET retrieves it. Verified end-to-end: create → fetch by ID → correct
  404 for an unknown ID. Storage is in-memory (documented limitation —
  resets on redeploy; production needs this backed by Postgres, same
  pattern as `db/schema.sql`).
- `/directorates/requests/status` — public, no-login status lookup by
  ticket ID.
- `/directory` — the central Institutional Directory search across all
  8 entity types (College, Department, Centre, Directorate, Programme,
  Researcher, Facility, Policy) — 47 real entries indexed live from
  existing data, not a separately maintained list. Verified: searching
  "agriculture" correctly returns results across 3 different types.
- `/directorates/admin` — governance review page. Two things worth being
  precise about:
  - **Duplicate-name detection is a real algorithm** (`lib/governance.ts`,
    Levenshtein-based), verified to catch genuine spelling variants
    ("Centre" vs "Center", a typo'd "Agricuture") — but it correctly does
    *not* flag acronym-vs-full-name pairs like "ICT" vs "Information &
    Communication Technology", since that's alias resolution, a different
    problem requiring a canonical-name mapping table, not string
    similarity. Don't oversell what this catches.
  - **Approve/Reject buttons are a labeled client-side demo**, not a real
    workflow — they update local component state only. Real enforcement
    needs the Approver RBAC role from Stage 7 and a persistent database,
    neither of which exist yet in this scaffold. This is stated on the
    page itself, not just in this README.

## Branding update — MOUAU crest + Vice-Chancellor photo

- Added the real MOUAU crest (`public/images/mouau-logo.jpg`) to
  `components/Header.tsx` — since Header renders on every single page,
  this one change puts the logo in the header site-wide, not per-page.
- Added the Vice-Chancellor's photo (`public/images/vc-ursula-akanwa.jpeg`)
  and name to the one homepage mention of the VC — the "Vice-Chancellor
  commissions upgraded poultry teaching and research unit" story in the
  homepage News feed. `NewsItem` gained optional `personImageUrl`/
  `personName` fields; `components/NewsFeed.tsx` renders them only when
  present, so the other 3 news rows are unaffected.
- Now also updated: the About page's Leadership section shows Prof.
  Ursula Ngozi Akanwa's real photo and name — `LeadershipProfile` gained
  an optional `imageUrl` field, rendered only when present so the other
  two leadership entries (still placeholders) are unaffected.

## Stage 7 — Central SSO/MFA & Portal Shells

Real authentication, not a mockup: **NextAuth (Credentials + JWT)**,
**bcrypt** password hashing, **otplib** TOTP-based MFA, and a **Next.js
middleware** enforcing RBAC server-side on every protected route.

- `/login` — one shared login for all seven personas + admin roles.
  Handles the real MFA challenge (server returns `MFA_REQUIRED`, the form
  reveals the code field — not a client-side guess).
- `middleware.ts` + `lib/auth/roleAccess.ts` — real, tested RBAC:
  - Unauthenticated request to `/portals/student` → `307` to `/login`
  - Wrong-role request (Student → `/portals/staff`) → **`403`**, verified
  - Retrofit: Stage 6's Governance Review page (`/directorates/admin`),
    previously open to anyone with an honest "no login gate yet" caveat,
    is now actually restricted to `Approver`/`SystemAdministrator`.
- **Real MFA, verified end-to-end**: logged in as `staff@mouau.edu.ng`
  using the actual current TOTP code (fetched from `/demo-mfa-code`, a
  clearly-labeled test-only helper — a real deployment never shows a code
  on a public page); an invalid code was correctly rejected.
- `/register` + `app/api/register/route.ts` — self-registration limited
  to Sponsor/Alumni/Partner only, least-privilege by default (exactly the
  requested base role, nothing elevated). Verified: attempting to
  self-register as Staff is rejected with a 400.
- `/account` — real MFA enrollment: generates a genuine TOTP secret +
  scannable QR code, and only persists it once the person proves they
  captured it by entering a valid code back (an interrupted setup can't
  silently half-enable MFA).
- `/portals` — server-side role router; shows a picker only when an
  account holds more than one portal-eligible role (e.g. Staff +
  Researcher), rather than guessing.
- `/portals/{applicant,student,sponsor,staff,researcher,alumni,partner}` —
  one shared `PortalShell` layout, honest empty-state dashboards pointing
  at the stage that builds their real content.
- `/portals/admin` — the **real** audit log (`lib/auth/auditLog.ts`),
  logging every login success/failure, MFA check, and registration.
  **Bug found and fixed during testing**: this page was originally
  statically prerendered at build time, freezing the audit log at
  whatever it contained then (empty) — the same class of mistake as
  Stage 1's build-time self-fetch bug. Fixed with `export const dynamic
  = "force-dynamic"`; re-verified live events now appear correctly.

**Documented limitations, not hidden ones**: user store and audit log
are in-memory (reset on restart — same pattern as Stage 6's ticket
store; production needs Postgres). `otplib` is pinned to the deprecated
v12 API rather than v13's rewritten interface — a real migration should
move to v13 or a maintained alternative. No real external IdP
(Keycloak/OIDC) is connected — this demonstrates the RBAC/MFA mechanics
for real, it doesn't replace a production identity provider.

## Stage 8A — Applicant Journey, Admission, Matriculation

The full lifecycle is real and was verified end-to-end via direct API
testing (not just code review):

1. **Apply** (`/portals/applicant/apply` → `POST /api/admissions/apply`) —
   validated against real Stage 2 Programme records. Verified: applying
   twice is rejected with a 409.
2. **Document upload** (`/portals/applicant/documents`) — honestly
   metadata-only (filename, type, extension validated) — no file bytes
   are stored. A production deployment needs real cloud storage (S3,
   Vercel Blob) behind this; the upload contract is real, the persistence
   isn't.
3. **Staff review** (`/portals/staff/admissions` → `POST
   /api/admissions/decide`) — real, persisted decisions (not a client-side
   demo like Stage 6's governance board), logged with `decisionBy`/
   `decisionAt`.
4. **Offer response** (`/portals/applicant/offer` → `POST
   /api/admissions/respond`) — accepting creates a real
   `StudentMasterRecord` with a generated matric number
   (`MOUAU/<session>/<college-acronym>/<sequence>`).
5. **The automatic Applicant→Student role transition** — verified with a
   real, deliberate before/after test: accessing `/portals/student`
   **before** the session refreshes correctly returns `403` (the JWT
   still only has `Applicant`); calling the same `session.update()`
   mechanism the offer page calls automatically refreshes the JWT's roles
   from the live user store, and the same request immediately after
   returns `200` — no sign-out/sign-in required, exactly the spec's
   requirement.
6. **Student Portal** now shows the real matric number, programme, and
   college when a `StudentMasterRecord` exists, verified against actual
   rendered HTML output for a real matriculated test account.

**Bug found and fixed during testing**: `/portals/applicant` and
`/portals/student` needed `export const dynamic = "force-dynamic"` to
avoid the same build-time-freeze bug hit in Stages 1 and 7 — caught by
testing, not by inspection.

**Audit trail extended**: added dedicated `admission_decision` and
`matriculation` audit actions (previously would have been mislabeled
under an unrelated existing action type) — both visible in
`/portals/admin`'s real audit log.
