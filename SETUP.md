# FalaZap - Setup Guide

## Database Setup

### 1. Run SQL Scripts

Execute the SQL scripts in order to set up your database:

1. **Create Tables**: Run `scripts/01-create-tables.sql`
2. **Enable RLS**: Run `scripts/02-enable-rls.sql`
3. **Create Functions**: Run `scripts/03-create-functions.sql`

These scripts will:
- Create `profiles`, `subscriptions`, and `verification_codes` tables
- Enable Row Level Security (RLS) for data protection
- Set up automatic profile creation on user signup
- Create triggers for automatic timestamp updates

### 2. Verify Database Schema

After running the scripts, verify that you have:
- ✅ 3 tables: `profiles`, `subscriptions`, `verification_codes`
- ✅ RLS policies enabled
- ✅ Triggers for automatic profile creation

## Stripe Webhook Setup

### 1. Get Webhook Secret

1. Go to your Stripe Dashboard
2. Navigate to Developers > Webhooks
3. Click "Add endpoint"
4. Enter your webhook URL: `https://your-domain.com/api/webhooks/stripe`
5. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Copy the webhook signing secret

### 2. Add Environment Variable

Add the webhook secret to your environment variables:

\`\`\`
STRIPE_WEBHOOK_SECRET=whsec_...
\`\`\`

## How It Works

### User Signup Flow

1. User fills signup form with name, email, and password
2. Supabase creates auth user
3. Database trigger automatically creates profile record
4. User is redirected to subscription page

### Subscription Flow

1. User selects a plan on `/assinatura`
2. Stripe checkout session is created with user metadata
3. User completes payment
4. Stripe webhook receives `checkout.session.completed` event
5. Subscription is automatically saved to database with:
   - User ID
   - Stripe customer ID
   - Stripe subscription ID
   - Plan details
   - Trial period
   - Billing dates

### Webhook Events Handled

- **checkout.session.completed**: Creates subscription in database
- **customer.subscription.updated**: Updates subscription status and dates
- **customer.subscription.deleted**: Marks subscription as canceled
- **invoice.payment_succeeded**: Logs successful payment
- **invoice.payment_failed**: Updates subscription to past_due status

## Testing

### Test Mode

The app includes a test mode for development:
- Set cookie `testMode=true` to bypass authentication
- Checkout will be simulated without real charges

### Verify Integration

1. Create a test account
2. Select a subscription plan
3. Complete checkout with Stripe test card: `4242 4242 4242 4242`
4. Check database for:
   - Profile record in `profiles` table
   - Subscription record in `subscriptions` table
5. Check webhook logs in Stripe Dashboard

## Environment Variables Required

\`\`\`
# Supabase
SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Database (auto-configured by Supabase)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
\`\`\`

## Security Notes

- ✅ Row Level Security (RLS) is enabled on all tables
- ✅ Users can only access their own data
- ✅ Webhook signatures are verified
- ✅ Service role is used only for webhook operations
- ✅ Passwords are hashed by Supabase Auth

## Troubleshooting

### Profile not created on signup
- Check if trigger `on_auth_user_created` exists
- Verify function `handle_new_user()` is created
- Check Supabase logs for errors

### Subscription not saved after payment
- Verify webhook endpoint is accessible
- Check webhook secret is correct
- Verify metadata is passed in checkout session
- Check webhook logs in Stripe Dashboard

### RLS errors
- Ensure user is authenticated
- Verify RLS policies are created
- Check if user ID matches policy conditions
