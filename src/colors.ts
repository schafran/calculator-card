const THEME_COLORS = new Set([
  'primary',
  'accent',
  'red',
  'pink',
  'purple',
  'deep-purple',
  'indigo',
  'blue',
  'light-blue',
  'cyan',
  'teal',
  'green',
  'light-green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'deep-orange',
  'brown',
  'light-grey',
  'grey',
  'dark-grey',
  'blue-grey',
  'black',
  'white',
]);

// Theme colours that need white/light text (dark backgrounds)
const DARK_BG_COLORS = new Set([
  'primary',
  'accent',
  'red',
  'pink',
  'purple',
  'deep-purple',
  'indigo',
  'blue',
  'teal',
  'green',
  'brown',
  'blue-grey',
  'dark-grey',
  'black',
]);

export function computeCssColor(color: string): string {
  if (THEME_COLORS.has(color)) {
    return `var(--${color}-color)`;
  }
  return color;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export function getContrastTextColor(bgColor: string): string {
  if (DARK_BG_COLORS.has(bgColor)) {
    return 'var(--text-primary-color)';
  }
  if (THEME_COLORS.has(bgColor)) {
    // Light theme colours get dark text
    return 'var(--primary-text-color)';
  }
  if (bgColor.startsWith('#')) {
    const rgb = hexToRgb(bgColor);
    if (rgb) {
      // Calculate relative luminance
      const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
      return luminance > 0.5 ? 'var(--primary-text-color)' : 'var(--text-primary-color)';
    }
  }
  return 'inherit';
}
