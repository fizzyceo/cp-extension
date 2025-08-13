# React Chrome Extension with Supabase OAuth & Plan-Based Content

A Chrome extension built with React, Tailwind CSS, and Supabase authentication that implements a robust OAuth system and plan-based content filtering with a prompt improver tool.

## Features

- ✅ React-based Chrome extension
- ✅ Tailwind CSS for styling
- ✅ Supabase integration for authentication
- ✅ **Google OAuth login**
- ✅ **Email & Password authentication**
- ✅ Robust authentication flow that handles popup closing
- ✅ Background script for OAuth callback handling
- ✅ Persistent session storage
- ✅ **NEW: Plan-based content filtering**
- ✅ **NEW: Prompt improver tool with categories**
- ✅ **NEW: Upgrade plan integration**

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Go to Authentication > Providers and enable:
   - **Google OAuth** (for social login)
   - **Email** (for email/password authentication)
4. Add your Google OAuth credentials (Client ID and Client Secret)
5. **Create the users table** (see `DATABASE_SCHEMA.md` for details)

### 3. Build the Extension

```bash
npm run build
```

### 4. Load in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `dist` folder
4. Copy your extension ID from the extensions page

### 5. Configure Redirect URLs

In your Supabase project, add this redirect URL:

```
https://YOUR_EXTENSION_ID.chromiumapp.org/
```

Replace `YOUR_EXTENSION_ID` with the actual ID from step 4.

## How It Works

### Authentication Flow

This extension implements a robust OAuth flow that solves the common popup closing issue:

1. **User clicks login** → Extension opens a new tab with Supabase's OAuth endpoint
2. **Background script listens** → For OAuth callback redirects
3. **Session is saved** → To chrome.storage.local for persistence
4. **User reopens extension** → And finds they're already logged in

### Authentication Methods

#### Email & Password

- Users can sign in with their email and password
- Direct authentication through Supabase Auth
- No popup windows or redirects needed
- Immediate access to the extension

#### Google OAuth

- Traditional OAuth flow for social login
- Opens new tab for authentication
- Background script handles callback
- Persistent session storage

### Content Filtering

The extension now includes plan-based content filtering:

1. **User signs in** → Extension fetches user data from `users` table
2. **Plan check** → Determines access level based on `plan` column
3. **Content display**:
   - `DISCOVER` plan → Shows upgrade message with link to pricing
   - Other plans → Shows full prompt improver tool

### Prompt Improver

A powerful tool that helps users improve their prompts:

- **Category selection** (General, Creative, Business, Academic, Technical)
- **Smart improvement** using category-specific system prompts
- **Copy to clipboard** functionality
- **Clear and reset** options

## Project Structure

```
├── src/
│   ├── App.js                    # Main React component with auth & plan logic
│   ├── supabaseClient.js         # Supabase client configuration
│   ├── userService.js            # User data fetching service
│   ├── components/
│   │   ├── LoginForm.js          # Email/password & Google OAuth login
│   │   ├── PromptImprover.js     # Main prompt improvement tool
│   │   ├── UpgradePlan.js        # Plan upgrade component
│   │   └── LoadingSpinner.js     # Loading states
│   └── index.js                  # React entry point
├── public/
│   ├── background.js             # Background script for OAuth handling
│   └── success.html              # Success page after OAuth
├── dist/                         # Built extension (load this in Chrome)
├── manifest.json                 # Extension manifest
├── webpack.config.js             # Build configuration
└── DATABASE_SCHEMA.md            # Database setup instructions
```

## Database Setup

The extension requires a `users` table in your Supabase database. See `DATABASE_SCHEMA.md` for complete setup instructions.

### Required Fields:

- `id` (UUID, primary key)
- `email` (TEXT, unique)
- `plan` (TEXT, default: 'DISCOVER')

### Plan Values:

- `DISCOVER` - Free plan (shows upgrade message)
- `BASIC`, `PRO`, `ENTERPRISE` - Paid plans (shows prompt improver)

## Development

```bash
# Build for development
npm run build

# Watch for changes
npm run watch
```

## Permissions

The extension requires these permissions:

- `identity` - For OAuth authentication
- `tabs` - For opening auth tabs
- `storage` - For persisting user sessions

## Testing

### Test Different Plans:

1. **DISCOVER Plan**: Create user with `plan = 'DISCOVER'` → Should see upgrade message
2. **Premium Plan**: Create user with `plan = 'PRO'` → Should see prompt improver
3. **OAuth Flow**: Test Google sign-in and session persistence
4. **Email Login**: Test email/password authentication

### Authentication Testing:

- **Email/Password**: Use existing Supabase users or create test accounts
- **Google OAuth**: Test the full OAuth flow with popup handling
- **Session Persistence**: Verify users stay logged in after closing/reopening

## Troubleshooting

- **OAuth not working**: Check that redirect URLs match exactly in Supabase
- **Session not persisting**: Verify the background script is loaded (check chrome://extensions/)
- **User plan not loading**: Check database connection and users table structure
- **Email login failing**: Verify email authentication is enabled in Supabase
- **Build errors**: Make sure all dependencies are installed with `npm install`

## Credits

This implementation follows the robust OAuth pattern described in [this blog post](https://beastx.ro/supabase-login-with-oauth-in-chrome-extensions) by Dragos Sebestin.

## License

MIT
