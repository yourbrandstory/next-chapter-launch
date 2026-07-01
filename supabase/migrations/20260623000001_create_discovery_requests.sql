CREATE TABLE public.discovery_requests (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name       text NOT NULL,
  email      text NOT NULL,
  company    text,
  team_size  text,
  tools      text[],
  message    text,
  best_time  text,
  status     text NOT NULL DEFAULT 'new'
);

-- Basic validation constraints
ALTER TABLE public.discovery_requests
  ADD CONSTRAINT discovery_requests_name_not_empty
  CHECK (length(trim(name)) > 0);

ALTER TABLE public.discovery_requests
  ADD CONSTRAINT discovery_requests_email_format
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE public.discovery_requests
  ADD CONSTRAINT discovery_requests_status_values
  CHECK (status IN ('new', 'contacted', 'booked', 'closed'));

ALTER TABLE public.discovery_requests
  ADD CONSTRAINT discovery_requests_team_size_values
  CHECK (team_size IS NULL OR team_size IN ('1-5', '6-10', '11-20', '20+'));

ALTER TABLE public.discovery_requests
  ADD CONSTRAINT discovery_requests_best_time_values
  CHECK (best_time IS NULL OR best_time IN ('Mornings', 'Afternoons', 'Evenings'));

-- Row Level Security
ALTER TABLE public.discovery_requests ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert rows (for the /book form)
CREATE POLICY anon_insert ON public.discovery_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- No public SELECT — reads stay server/admin-only

-- Required: table-level privilege for the anon role (RLS alone is insufficient)
GRANT INSERT ON public.discovery_requests TO anon;
