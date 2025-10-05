-- Add missing columns to subscriptions table
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);

-- Update existing records to have default values
UPDATE public.subscriptions
SET cancel_at_period_end = FALSE
WHERE cancel_at_period_end IS NULL;

-- Add comment to table
COMMENT ON COLUMN public.subscriptions.stripe_customer_id IS 'Stripe customer ID for this subscription';
COMMENT ON COLUMN public.subscriptions.stripe_subscription_id IS 'Stripe subscription ID - unique identifier from Stripe';
COMMENT ON COLUMN public.subscriptions.current_period_start IS 'Start date of the current billing period';
COMMENT ON COLUMN public.subscriptions.current_period_end IS 'End date of the current billing period';
COMMENT ON COLUMN public.subscriptions.cancel_at_period_end IS 'Whether the subscription will be canceled at the end of the current period';
