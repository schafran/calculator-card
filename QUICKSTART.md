# Quick Start

## 1. Install Dependencies

```bash
npm install
```

## 2. Build the Card

```bash
npm run build
```

## 3. Test in Home Assistant

Copy the built file to your Home Assistant installation:

```bash
# Copy to Home Assistant
cp dist/calculator-card.js /path/to/homeassistant/www/
```

## 4. Add to Home Assistant

In your dashboard configuration:

```yaml
type: custom:calculator-card
title: Hello World Card
```

## 5. Development Mode

For active development:

```bash
npm run watch
```

This will automatically rebuild when you save changes to `src/calculator-card.ts`.

## Next Steps

- Edit `src/calculator-card.ts` to customize the card
- Check `DEVELOPMENT.md` for more details
- See `README.md` for HACS installation instructions
