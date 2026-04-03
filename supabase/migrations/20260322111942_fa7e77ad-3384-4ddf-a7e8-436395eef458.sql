-- Create storage bucket for incident evidence images
INSERT INTO storage.buckets (id, name, public)
VALUES ('incident-evidence', 'incident-evidence', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to incident-evidence bucket
CREATE POLICY "Users can upload evidence"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'incident-evidence');

-- Allow public read access
CREATE POLICY "Public can view evidence"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'incident-evidence');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own evidence"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'incident-evidence' AND (storage.foldername(name))[1] = auth.uid()::text);