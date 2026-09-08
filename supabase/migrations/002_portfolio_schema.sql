-- ============================================================
-- SmartResume AI — Migration 002: Portfolio Engine Schema
-- ============================================================

-- 1. Ensure username column on profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- 2. Portfolio Sites Table
CREATE TABLE IF NOT EXISTS public.portfolio_sites (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  title           TEXT NOT NULL DEFAULT 'My Professional Portfolio',
  theme           TEXT NOT NULL DEFAULT 'indigo', -- neutral, indigo, blue, emerald, violet, rose, amber
  template        TEXT NOT NULL DEFAULT 'modern', -- minimal, modern, creative, developer, professional, editorial, bold, elegant
  motion_level    TEXT NOT NULL DEFAULT 'smooth', -- subtle, smooth, dynamic
  content         JSONB NOT NULL DEFAULT '{}',
  seo_metadata    JSONB NOT NULL DEFAULT '{}',
  published       BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_portfolio UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_portfolio_sites_user ON public.portfolio_sites(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_sites_username ON public.portfolio_sites(username);
CREATE INDEX IF NOT EXISTS idx_portfolio_sites_slug ON public.portfolio_sites(slug);
CREATE INDEX IF NOT EXISTS idx_portfolio_sites_published ON public.portfolio_sites(published);

-- 3. Portfolio Views Analytics Table
CREATE TABLE IF NOT EXISTS public.portfolio_views (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id    UUID NOT NULL REFERENCES public.portfolio_sites(id) ON DELETE CASCADE,
  referrer        TEXT,
  user_agent      TEXT,
  viewer_ip_hash  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_views_portfolio ON public.portfolio_views(portfolio_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_views_created ON public.portfolio_views(portfolio_id, created_at DESC);

-- 4. Portfolio Versions Table
CREATE TABLE IF NOT EXISTS public.portfolio_versions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  portfolio_id    UUID NOT NULL REFERENCES public.portfolio_sites(id) ON DELETE CASCADE,
  version_number  INTEGER NOT NULL,
  content         JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_portfolio_version UNIQUE (portfolio_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_portfolio_versions_portfolio ON public.portfolio_versions(portfolio_id);

-- 5. Updated_at Trigger
CREATE TRIGGER update_portfolio_sites_updated_at BEFORE UPDATE ON public.portfolio_sites
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Row Level Security Policies
ALTER TABLE public.portfolio_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_versions ENABLE ROW LEVEL SECURITY;

-- Portfolio Sites Policies
CREATE POLICY "Users can manage their own portfolio site" ON public.portfolio_sites
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can view published portfolio sites" ON public.portfolio_sites
  FOR SELECT USING (published = true);

-- Portfolio Views Policies
CREATE POLICY "Users can view analytics for their portfolio" ON public.portfolio_views
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.portfolio_sites
      WHERE portfolio_sites.id = portfolio_views.portfolio_id
        AND portfolio_sites.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can record a view on published portfolios" ON public.portfolio_views
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.portfolio_sites
      WHERE portfolio_sites.id = portfolio_views.portfolio_id
        AND portfolio_sites.published = true
    )
  );

-- Portfolio Versions Policies
CREATE POLICY "Users can view own portfolio versions" ON public.portfolio_versions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.portfolio_sites
      WHERE portfolio_sites.id = portfolio_versions.portfolio_id
        AND portfolio_sites.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own portfolio versions" ON public.portfolio_versions
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.portfolio_sites
      WHERE portfolio_sites.id = portfolio_versions.portfolio_id
        AND portfolio_sites.user_id = auth.uid()
    )
  );

-- Grant privileges
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
