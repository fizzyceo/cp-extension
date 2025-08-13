# React Chrome Extension with Supabase OAuth

A Chrome extension built with React, Tailwind CSS, and Supabase authentication that implements a robust OAuth system following best practices.

## Features

- ✅ React-based Chrome extension
- ✅ Tailwind CSS for styling
- ✅ Supabase integration for authentication
- ✅ Google OAuth login
- ✅ Robust authentication flow that handles popup closing
- ✅ Background script for OAuth callback handling
- ✅ Persistent session storage

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Go to Authentication > Providers and enable Google OAuth
4. Add your Google OAuth credentials (Client ID and Client Secret)

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

This extension implements a robust OAuth flow that solves the common popup closing issue:

1. **User clicks login** → Extension opens a new tab with Supabase's OAuth endpoint
2. **Background script listens** → For OAuth callback redirects
3. **Session is saved** → To chrome.storage.local for persistence
4. **User reopens extension** → And finds they're already logged in

## Project Structure

```
├── src/
│   ├── App.js              # Main React component with auth UI
│   ├── supabaseClient.js   # Supabase client configuration
│   └── index.js            # React entry point
├── public/
│   ├── background.js       # Background script for OAuth handling
│   └── success.html        # Success page after OAuth
├── dist/                   # Built extension (load this in Chrome)
├── manifest.json           # Extension manifest
└── webpack.config.js       # Build configuration
```

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

## Troubleshooting

- **OAuth not working**: Check that redirect URLs match exactly in Supabase
- **Session not persisting**: Verify the background script is loaded (check chrome://extensions/)
- **Build errors**: Make sure all dependencies are installed with `npm install`

## Credits

This implementation follows the robust OAuth pattern described in [this blog post](https://beastx.ro/supabase-login-with-oauth-in-chrome-extensions) by Dragos Sebestin.

## License

MIT
