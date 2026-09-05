-- ============================================================
-- SmartResume AI — Initial Database Schema
-- Migration 001: Core tables, RLS, indexes
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy search

-- ── Profiles ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT,
  email           TEXT NOT NULL,
  avatar_url      TEXT,
  career_goal     TEXT CHECK (career_goal IN ('first_job','internship','better_job','career_change','freelancing')),
  experience_level TEXT CHECK (experience_level IN ('student','fresher','1_2_years','3_5_years','5_plus_years')),
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  is_admin        BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- ── Resumes ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resumes (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL DEFAULT 'Untitled Resume',
  template_id     TEXT NOT NULL DEFAULT 'ats-classic',
  data            JSONB NOT NULL DEFAULT '{}',
  ats_score       INTEGER CHECK (ats_score >= 0 AND ats_score <= 100),
  is_public       BOOLEAN NOT NULL DEFAULT false,
  public_slug     TEXT UNIQUE,
  public_expires_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_resumes_user_updated ON resumes(user_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_resumes_public_slug ON resumes(public_slug) WHERE public_slug IS NOT NULL;

-- ── Resume Versions ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS resume_versions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  resume_id       UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  version_number  INTEGER NOT NULL,
  description     TEXT,
  data            JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (resume_id, version_number)
);

CREATE INDEX IF NOT EXISTS idx_resume_versions_resume_id ON resume_versions(resume_id);

-- ── ATS Scans ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ats_scans (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id       UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  job_description TEXT,
  result          JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ats_scans_user_id ON ats_scans(user_id);
CREATE INDEX IF NOT EXISTS idx_ats_scans_resume_id ON ats_scans(resume_id);

-- ── Job Applications ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS job_applications (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company         TEXT NOT NULL,
  position        TEXT NOT NULL,
  job_description TEXT,
  job_url         TEXT,
  application_date DATE,
  status          TEXT NOT NULL DEFAULT 'wishlist'
                  CHECK (status IN ('wishlist','applied','assessment','interview','offer','rejected','withdrawn')),
  resume_id       UUID REFERENCES resumes(id) ON DELETE SET NULL,
  notes           TEXT,
  interview_date  TIMESTAMPTZ,
  recruiter_name  TEXT,
  recruiter_email TEXT,
  recruiter_phone TEXT,
  salary_range    TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(user_id, status);

-- ── Files ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS files (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  original_name   TEXT NOT NULL,
  storage_path    TEXT NOT NULL,
  size            BIGINT NOT NULL,
  mime_type       TEXT NOT NULL,
  category        TEXT NOT NULL DEFAULT 'other'
                  CHECK (category IN ('resumes','certificates','documents','other')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_files_user_id ON files(user_id);
CREATE INDEX IF NOT EXISTS idx_files_category ON files(user_id, category);

-- ── AI Usage ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_usage (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_type       TEXT NOT NULL,
  model           TEXT NOT NULL,
  prompt_tokens   INTEGER NOT NULL DEFAULT 0,
  completion_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens    INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON ai_usage(user_id, created_at DESC);

-- ── Payments ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gateway         TEXT NOT NULL,
  transaction_id  TEXT UNIQUE,
  gateway_order_id TEXT,
  amount          INTEGER NOT NULL, -- in smallest currency unit (paise for INR)
  currency        TEXT NOT NULL DEFAULT 'INR',
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending','successful','failed','refunded')),
  purpose         TEXT NOT NULL
                  CHECK (purpose IN ('resume_unlock','subscription','export_credits')),
  metadata        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id) WHERE transaction_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_gateway_order ON payments(gateway_order_id) WHERE gateway_order_id IS NOT NULL;

-- ── User Entitlements ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_entitlements (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  free_resume_count   INTEGER NOT NULL DEFAULT 0,
  cooldown_started_at TIMESTAMPTZ,
  cooldown_expires_at TIMESTAMPTZ,
  paid_resume_credits INTEGER NOT NULL DEFAULT 0,
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_user_entitlements_user_id ON user_entitlements(user_id);

-- ── Notifications ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  data        JSONB NOT NULL DEFAULT '{}',
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read, created_at DESC);

-- ── Updated_at Trigger Function ───────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resumes_updated_at BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_entitlements_updated_at BEFORE UPDATE ON user_entitlements
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ── Auto-create profile on user signup ────────────────────
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );

  INSERT INTO public.user_entitlements (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ── Resume Eligibility Function ───────────────────────────
CREATE OR REPLACE FUNCTION check_resume_creation_eligibility(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_entitlement user_entitlements%ROWTYPE;
  v_resume_count INTEGER;
  v_now TIMESTAMPTZ := NOW();
BEGIN
  -- Get or create entitlement
  INSERT INTO user_entitlements (user_id)
  VALUES (p_user_id)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT * INTO v_entitlement FROM user_entitlements WHERE user_id = p_user_id;

  -- Count actual resumes in DB
  SELECT COUNT(*) INTO v_resume_count FROM resumes WHERE user_id = p_user_id;

  -- If user has paid credits
  IF v_entitlement.paid_resume_credits > 0 THEN
    RETURN jsonb_build_object(
      'can_create', true,
      'reason', 'paid_credits',
      'cooldown_expires_at', null,
      'free_count', v_resume_count,
      'paid_credits', v_entitlement.paid_resume_credits,
      'next_unlock_option', null
    );
  END IF;

  -- First 3 resumes are free
  IF v_resume_count < 3 THEN
    RETURN jsonb_build_object(
      'can_create', true,
      'reason', 'free',
      'cooldown_expires_at', null,
      'free_count', v_resume_count,
      'paid_credits', v_entitlement.paid_resume_credits,
      'next_unlock_option', null
    );
  END IF;

  -- Check if cooldown has expired
  IF v_entitlement.cooldown_expires_at IS NOT NULL AND v_entitlement.cooldown_expires_at <= v_now THEN
    RETURN jsonb_build_object(
      'can_create', true,
      'reason', 'cooldown_expired',
      'cooldown_expires_at', v_entitlement.cooldown_expires_at,
      'free_count', v_resume_count,
      'paid_credits', v_entitlement.paid_resume_credits,
      'next_unlock_option', null
    );
  END IF;

  -- Check if cooldown is active
  IF v_entitlement.cooldown_started_at IS NOT NULL AND v_entitlement.cooldown_expires_at > v_now THEN
    RETURN jsonb_build_object(
      'can_create', false,
      'reason', 'cooldown_active',
      'cooldown_expires_at', v_entitlement.cooldown_expires_at,
      'free_count', v_resume_count,
      'paid_credits', v_entitlement.paid_resume_credits,
      'next_unlock_option', 'pay'
    );
  END IF;

  -- No credits and no active cooldown — start cooldown
  UPDATE user_entitlements
  SET
    cooldown_started_at = v_now,
    cooldown_expires_at = v_now + INTERVAL '5 hours'
  WHERE user_id = p_user_id
    AND (cooldown_started_at IS NULL OR cooldown_expires_at <= v_now);

  SELECT * INTO v_entitlement FROM user_entitlements WHERE user_id = p_user_id;

  RETURN jsonb_build_object(
    'can_create', false,
    'reason', 'cooldown_active',
    'cooldown_expires_at', v_entitlement.cooldown_expires_at,
    'free_count', v_resume_count,
    'paid_credits', v_entitlement.paid_resume_credits,
    'next_unlock_option', 'pay'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── RLS Policies ──────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ats_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Resumes: public read for shared, private write
CREATE POLICY "Users can view own resumes" ON resumes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public can view shared resumes" ON resumes
  FOR SELECT USING (is_public = true AND (public_expires_at IS NULL OR public_expires_at > NOW()));
CREATE POLICY "Users can insert own resumes" ON resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own resumes" ON resumes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own resumes" ON resumes
  FOR DELETE USING (auth.uid() = user_id);

-- Resume versions
CREATE POLICY "Users can view own resume versions" ON resume_versions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM resumes WHERE resumes.id = resume_id AND resumes.user_id = auth.uid())
  );
CREATE POLICY "Users can insert own resume versions" ON resume_versions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM resumes WHERE resumes.id = resume_id AND resumes.user_id = auth.uid())
  );

-- ATS scans
CREATE POLICY "Users can view own ats scans" ON ats_scans
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ats scans" ON ats_scans
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Job applications
CREATE POLICY "Users can manage own applications" ON job_applications
  FOR ALL USING (auth.uid() = user_id);

-- Files
CREATE POLICY "Users can manage own files" ON files
  FOR ALL USING (auth.uid() = user_id);

-- AI usage
CREATE POLICY "Users can view own ai usage" ON ai_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Payments: read own, no direct insert/update (server-side only)
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Entitlements: read own (mutations via server functions only)
CREATE POLICY "Users can view own entitlements" ON user_entitlements
  FOR SELECT USING (auth.uid() = user_id);

-- Notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- ── Role Privileges ───────────────────────────────────────
-- Ensure proper role access for all tables and sequences in public schema
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;
