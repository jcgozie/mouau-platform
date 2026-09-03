-- MOUAU Digital University Platform
-- Stage 1 schema: CMS content models introduced by the homepage.
-- This is the durable record of field definitions referenced in
-- lib/types.ts — Stage 3 reconciles this against the full
-- Institutional Directory Registry rather than redefining it.

CREATE TABLE colleges (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  acronym       TEXT NOT NULL,
  blurb         TEXT NOT NULL,
  -- governance fields (Stage 6 formalizes the workflow around these)
  owner_unit_id UUID,
  approval_status TEXT NOT NULL DEFAULT 'draft'
                CHECK (approval_status IN ('draft', 'pending', 'approved', 'archived')),
  last_verified DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE centres (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  focus_area    TEXT NOT NULL,
  blurb         TEXT NOT NULL,
  owner_unit_id UUID,
  approval_status TEXT NOT NULL DEFAULT 'draft'
                CHECK (approval_status IN ('draft', 'pending', 'approved', 'archived')),
  last_verified DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE news_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  title         TEXT NOT NULL,
  category      TEXT NOT NULL
                CHECK (category IN ('News', 'Announcement', 'Press Release', 'Research')),
  excerpt       TEXT NOT NULL,
  body          TEXT,
  published_at  DATE NOT NULL,
  approval_status TEXT NOT NULL DEFAULT 'draft'
                CHECK (approval_status IN ('draft', 'pending', 'approved', 'archived')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE institutional_facts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label         TEXT NOT NULL,
  value         TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  last_verified DATE
);

CREATE TABLE ranking_entries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  body          TEXT NOT NULL,
  distinction   TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE sdg_impact (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sdg_number    INT NOT NULL CHECK (sdg_number BETWEEN 1 AND 17),
  title         TEXT NOT NULL,
  note          TEXT NOT NULL,
  display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE research_highlight (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme         TEXT NOT NULL,
  headline      TEXT NOT NULL,
  summary       TEXT NOT NULL,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Only one active research highlight should feed the homepage at a time.
CREATE UNIQUE INDEX one_active_research_highlight
  ON research_highlight (is_active) WHERE is_active;
