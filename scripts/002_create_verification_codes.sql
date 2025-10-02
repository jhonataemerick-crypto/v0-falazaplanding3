-- Create verification_codes table for email verification
create table if not exists public.verification_codes (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code text not null,
  expires_at timestamp with time zone not null,
  verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table public.verification_codes enable row level security;

-- RLS Policies - allow users to verify their own codes
create policy "Users can view codes for their email"
  on public.verification_codes for select
  using (true); -- Public read for verification

create policy "Users can insert verification codes"
  on public.verification_codes for insert
  with check (true); -- Allow anyone to request codes

create policy "Users can update their verification codes"
  on public.verification_codes for update
  using (true); -- Allow verification updates

-- Create index for faster lookups
create index if not exists verification_codes_email_idx on public.verification_codes(email);
create index if not exists verification_codes_code_idx on public.verification_codes(code);

-- Function to clean up expired codes
create or replace function public.cleanup_expired_codes()
returns void
language plpgsql
security definer
as $$
begin
  delete from public.verification_codes
  where expires_at < now();
end;
$$;
