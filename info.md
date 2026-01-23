# Calculator Card

A custom Lovelace card for Home Assistant.

## Installation

### HACS (Recommended)

1. Make sure [HACS](https://hacs.xyz/) is installed
2. Add this repository as a custom repository in HACS
3. Install the Calculator Card
4. Add the card to your dashboard

### Manual Installation

1. Download `calculator-card.js` from the latest release
2. Copy it to `<config>/www/calculator-card.js`
3. Add the following to your `configuration.yaml`:

```yaml
lovelace:
  resources:
    - url: /local/calculator-card.js
      type: module
```

## Usage

Add the card to your Lovelace dashboard:

```yaml
type: custom:calculator-card
title: Calculator
```

## Configuration Options

| Name | Type | Default | Description |
|------|------|---------|-------------|
| `type` | string | **Required** | `custom:calculator-card` |
| `title` | string | Optional | Card title |
