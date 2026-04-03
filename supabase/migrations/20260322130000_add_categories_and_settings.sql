-- Create categories table for incident types
CREATE TABLE IF NOT EXISTS public.incident_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#3b82f6',
  icon TEXT DEFAULT 'AlertTriangle',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.incident_categories ENABLE ROW LEVEL SECURITY;

-- Insert default categories
INSERT INTO public.incident_categories (name, description, color, icon) VALUES
  ('Theft', 'Theft, robbery, or burglary incidents', '#ef4444', 'Shield'),
  ('Assault', 'Physical assault or violence', '#dc2626', 'AlertTriangle'),
  ('Harassment', 'Harassment or stalking', '#f59e0b', 'UserX'),
  ('Medical Emergency', 'Medical emergencies requiring immediate attention', '#10b981', 'Heart'),
  ('Fire', 'Fire incidents or smoke reports', '#f97316', 'Flame'),
  ('Traffic Accident', 'Vehicle accidents or road incidents', '#8b5cf6', 'Car'),
  ('Suspicious Activity', 'Suspicious persons or activities', '#6b7280', 'Eye'),
  ('Other', 'Other types of incidents', '#64748b', 'MoreHorizontal')
ON CONFLICT (name) DO NOTHING;

-- Add category column to incident_reports if not exists
ALTER TABLE public.incident_reports ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Other';

-- Create system_settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Insert default settings
INSERT INTO public.system_settings (key, value, description) VALUES
  ('app_name', '"Raksha Alert"', 'Application name'),
  ('app_version', '"1.0.0"', 'Current application version'),
  ('maintenance_mode', 'false', 'Whether the system is in maintenance mode'),
  ('max_file_size', '5242880', 'Maximum file upload size in bytes (5MB)'),
  ('allowed_file_types', '["image/jpeg", "image/png", "image/gif"]', 'Allowed file types for uploads'),
  ('notification_retention_days', '30', 'How long to keep notifications'),
  ('auto_delete_old_reports', 'false', 'Whether to auto-delete old resolved reports'),
  ('report_retention_days', '365', 'How long to keep resolved reports'),
  ('sos_timeout_minutes', '30', 'How long SOS alerts remain active'),
  ('map_default_zoom', '13', 'Default zoom level for maps'),
  ('map_center_lat', '17.3850', 'Default map center latitude'),
  ('map_center_lng', '78.4867', 'Default map center longitude')
ON CONFLICT (key) DO NOTHING;

-- RLS Policies
CREATE POLICY "Admins can manage categories" ON public.incident_categories
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view active categories" ON public.incident_categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage system settings" ON public.system_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Everyone can view system settings" ON public.system_settings
  FOR SELECT USING (true);

-- Update trigger for timestamps
CREATE TRIGGER update_incident_categories_updated_at
  BEFORE UPDATE ON public.incident_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();