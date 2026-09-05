-- ============================================================
-- SmartResume AI — Migration 002: Helper Functions for Entitlements
-- ============================================================

-- Increment free resume count atomically
CREATE OR REPLACE FUNCTION increment_free_resume_count(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_entitlements (user_id, free_resume_count)
  VALUES (p_user_id, 1)
  ON CONFLICT (user_id) DO UPDATE
  SET free_resume_count = user_entitlements.free_resume_count + 1,
      updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add paid resume credits atomically (prevents race conditions)
CREATE OR REPLACE FUNCTION add_paid_resume_credits(p_user_id UUID, p_credits INTEGER)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_entitlements (user_id, paid_resume_credits)
  VALUES (p_user_id, p_credits)
  ON CONFLICT (user_id) DO UPDATE
  SET paid_resume_credits = user_entitlements.paid_resume_credits + p_credits,
      -- Clear cooldown when credits are added
      cooldown_started_at = NULL,
      cooldown_expires_at = NULL,
      updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Deduct paid resume credit (atomic, prevents going below 0)
CREATE OR REPLACE FUNCTION deduct_paid_resume_credit(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_credits INTEGER;
BEGIN
  SELECT paid_resume_credits INTO v_credits
  FROM user_entitlements
  WHERE user_id = p_user_id
  FOR UPDATE; -- Row lock for atomicity

  IF v_credits IS NULL OR v_credits <= 0 THEN
    RETURN FALSE;
  END IF;

  UPDATE user_entitlements
  SET paid_resume_credits = paid_resume_credits - 1,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user analytics summary (admin use)
CREATE OR REPLACE FUNCTION get_user_analytics_summary()
RETURNS TABLE (
  total_users BIGINT,
  total_resumes BIGINT,
  total_ats_scans BIGINT,
  total_payments BIGINT,
  successful_payments BIGINT,
  total_revenue_paise BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM profiles) as total_users,
    (SELECT COUNT(*) FROM resumes) as total_resumes,
    (SELECT COUNT(*) FROM ats_scans) as total_ats_scans,
    (SELECT COUNT(*) FROM payments) as total_payments,
    (SELECT COUNT(*) FROM payments WHERE status = 'successful') as successful_payments,
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'successful') as total_revenue_paise;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Only admins can call analytics function
REVOKE ALL ON FUNCTION get_user_analytics_summary() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_user_analytics_summary() TO service_role;

-- Notify on new notifications (for Realtime)
CREATE OR REPLACE FUNCTION notify_new_notification()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'new_notification',
    json_build_object(
      'user_id', NEW.user_id,
      'id', NEW.id,
      'type', NEW.type
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_notification_created
  AFTER INSERT ON notifications
  FOR EACH ROW EXECUTE FUNCTION notify_new_notification();
