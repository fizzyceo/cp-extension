# Database Schema

## Users Table

The extension expects a `users` table in your Supabase database with the following structure:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL DEFAULT 'DISCOVER',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Add any other user fields you need
  full_name TEXT,
  avatar_url TEXT,
  subscription_status TEXT,
  subscription_end_date TIMESTAMP WITH TIME ZONE
);
```

## Plan Values

The `plan` column should contain one of these values:

- `DISCOVER` - Free plan with limited access
- `BASIC` - Basic paid plan
- `PRO` - Professional plan
- `ENTERPRISE` - Enterprise plan

## Row Level Security (RLS)

Make sure to enable RLS and create appropriate policies:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy to allow users to update their own data
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

## Automatic User Creation

You can set up a trigger to automatically create user records when someone signs up:

```sql
-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, plan)
  VALUES (new.id, new.email, 'DISCOVER');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

## Testing

To test the extension:

1. Create a user with `plan = 'DISCOVER'` to see the upgrade message
2. Create a user with `plan = 'PRO'` to see the prompt improver
3. The extension will automatically fetch the user's plan when they sign in
