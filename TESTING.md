# Local Development Guide

## Quick Start - Local Testing

You can test the calculator card locally without deploying to Home Assistant!

### Development Mode with Live Reload

1. **Start the dev server:**

   ```bash
   npm run dev
   ```

2. **Your browser will automatically open to:**

   ```
   http://localhost:5000/dev/
   ```

The server includes:

- ✅ Auto-rebuild on file changes
- ✅ Live reload in browser
- ✅ Source maps for debugging
- ✅ Automatic browser opening

### Development Workflow

1. Run `npm run dev`
2. Browser opens automatically
3. Edit `src/calculator-card.ts`
4. Save - browser automatically reloads with changes!

### Production Build

To build for production (minified):

```bash
npm run build
```

### Testing Features

The `dev/index.html` page includes:

- Mock Home Assistant theme variables
- Multiple card instances
- Browser console for debugging
- Real-time testing of all calculator functions

## Deploying to Home Assistant

Once you're happy with local testing:

1. Build for production: `npm run build`
2. Copy `dist/calculator-card.js` to Home Assistant's `www/` folder
3. Add as a Lovelace resource
4. Use in your dashboard
