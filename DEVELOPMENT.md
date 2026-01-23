# Development Guide

## Project Structure

```
calculator-card/
├── src/
│   └── calculator-card.ts    # Main card component
├── dist/                      # Built files (generated)
├── .github/
│   └── workflows/
│       └── release.yml        # GitHub Actions for releases
├── package.json
├── tsconfig.json
├── rollup.config.mjs
├── hacs.json                  # HACS configuration
└── info.md                    # HACS info page
```

## Technology Stack

- **TypeScript**: Type-safe development
- **Lit**: Modern web components library
- **Rollup**: Module bundler
- **ESLint**: Code linting
- **custom-card-helpers**: Home Assistant card utilities

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Build the card:**

   ```bash
   npm run build
   ```

   This creates `dist/calculator-card.js`

3. **Development with watch mode:**

   ```bash
   npm run watch
   ```

   Automatically rebuilds on file changes

## Testing in Home Assistant

1. Copy `dist/calculator-card.js` to your Home Assistant's `www` folder
2. Add as a resource in your dashboard configuration
3. Reload the page and add the card to your dashboard

## Customizing the Card

Edit `src/calculator-card.ts` to modify:

- Card layout (in the `render()` method)
- Styling (in the `styles` getter)
- Configuration options (add to `CalculatorCardConfig` interface)

## Release Process

1. Update version in `package.json`
2. Commit changes
3. Create a new release on GitHub
4. GitHub Actions will automatically build and attach the JS file
