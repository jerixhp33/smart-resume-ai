-- Add public_views tracking to resumes table
ALTER TABLE public.resumes 
ADD COLUMN IF NOT EXISTS public_views INTEGER NOT NULL DEFAULT 0;

-- RPC to securely increment views without race conditions
CREATE OR REPLACE FUNCTION increment_resume_view(p_slug TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Runs as elevated privileges
AS $$
BEGIN
  UPDATE public.resumes
  SET public_views = public_views + 1
  WHERE public_slug = p_slug AND is_public = true;
END;
$$;
