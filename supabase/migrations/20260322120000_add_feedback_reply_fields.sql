-- Add admin reply fields to feedback table for support chat functionality
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS admin_reply text;
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS replied_at timestamp with time zone;
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Update RLS policies to allow admins to update feedback with replies
CREATE POLICY "Admins can update feedback"
  ON public.feedback FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow users to view their own feedback
CREATE POLICY "Users can view own feedback"
  ON public.feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);