# Calculator Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/custom-components/hacs)

A simple calculator for your dashboard.

![Calculator Card](.github/assets/screenshot.png)

## Installation

### HACS (Recommended)

1. Make sure [HACS](https://hacs.xyz/) is installed
2. Add this repository as a custom repository in HACS:
   - Go to HACS → Frontend
   - Click the three dots menu → Custom repositories
   - Add repository URL with category "Lovelace"
3. Install the Calculator Card
4. Restart Home Assistant

### Manual Installation

1. Download `calculator-card.js` from the [latest release](https://github.com/schafran/calculator-card/releases)
2. Copy it to `<config>/www/calculator-card.js`
3. Add the resource in Home Assistant:
   - Go to Settings → Dashboards → Resources
   - Add `/local/calculator-card.js` as a JavaScript Module

## Usage

Add the card to your Lovelace dashboard:

```yaml
type: custom:calculator-card
title: My Card
```

## Configuration Options

| Name    | Type   | Default      | Description |
|---------|--------|--------------|-------------|
| `type`  | string | **Required** | `custom:calculator-card` |
| `title` | string | Optional     | Card title  |

## Development

### Prerequisites

- Node.js (v18 or later)
- npm

### Setup

```bash
npm install
```

### Build

```bash
npm run build
```

### Watch mode

```bash
npm run watch
```

### Linting

```bash
npm run lint
```

## License

MIT License - see LICENSE file for details
