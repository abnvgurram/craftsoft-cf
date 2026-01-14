-- OTP storage for student login
-- Execute this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.student_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    otp_code TEXT NOT NULL,
    email_sent_to TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '10 minutes'),
    is_used BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.student_otps ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for our edge functions/backend logic)
-- Actually, since we use the anon key for login, we need a restricted policy
-- But ideally, we should verify OTP via a Supabase Function or a secure RPC call.

-- For now, let's just create the table. We will use Supabase RPC to verify to keep it secure.
