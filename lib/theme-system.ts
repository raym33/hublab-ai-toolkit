/**
 * HubLab Theme System
 *
 * Global theming system that applies to all 180+ components
 * Supports preset themes and custom configuration
 * Export as Tailwind config or CSS variables
 */

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeTypography {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

export interface ThemeShadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  none: string;
}

export interface ThemeConfig {
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
}

// Default Theme (Blue & Purple)
export const DEFAULT_THEME: ThemeConfig = {
  name: 'Default',
  colors: {
    primary: '#3B82F6',    // Blue
    secondary: '#8B5CF6',  // Purple
    accent: '#EC4899',     // Pink
    neutral: '#6B7280',    // Gray
    success: '#10B981',    // Green
    warning: '#F59E0B',    // Amber
    error: '#EF4444',      // Red
    info: '#3B82F6',       // Blue
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      serif: 'Georgia, serif',
      mono: 'Menlo, Monaco, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    none: 'none',
  },
};

// Dark Mode Theme
export const DARK_THEME: ThemeConfig = {
  name: 'Dark',
  colors: {
    primary: '#60A5FA',    // Light Blue
    secondary: '#A78BFA',  // Light Purple
    accent: '#F472B6',     // Light Pink
    neutral: '#9CA3AF',    // Light Gray
    success: '#34D399',    // Light Green
    warning: '#FBBF24',    // Light Amber
    error: '#F87171',      // Light Red
    info: '#60A5FA',       // Light Blue
  },
  typography: DEFAULT_THEME.typography,
  spacing: DEFAULT_THEME.spacing,
  borderRadius: DEFAULT_THEME.borderRadius,
  shadows: {
    sm: '0 1px 2px 0 rgba(255, 255, 255, 0.05)',
    md: '0 4px 6px -1px rgba(255, 255, 255, 0.1)',
    lg: '0 10px 15px -3px rgba(255, 255, 255, 0.1)',
    xl: '0 20px 25px -5px rgba(255, 255, 255, 0.1)',
    '2xl': '0 25px 50px -12px rgba(255, 255, 255, 0.25)',
    none: 'none',
  },
};

// Ocean Theme (Sky Blue, Cyan, Teal)
export const OCEAN_THEME: ThemeConfig = {
  name: 'Ocean',
  colors: {
    primary: '#0EA5E9',    // Sky Blue
    secondary: '#06B6D4',  // Cyan
    accent: '#14B8A6',     // Teal
    neutral: '#64748B',    // Slate
    success: '#22C55E',    // Green
    warning: '#F59E0B',    // Amber
    error: '#EF4444',      // Red
    info: '#0EA5E9',       // Sky Blue
  },
  typography: DEFAULT_THEME.typography,
  spacing: DEFAULT_THEME.spacing,
  borderRadius: DEFAULT_THEME.borderRadius,
  shadows: DEFAULT_THEME.shadows,
};

// Sunset Theme (Orange, Pink, Yellow)
export const SUNSET_THEME: ThemeConfig = {
  name: 'Sunset',
  colors: {
    primary: '#F97316',    // Orange
    secondary: '#EC4899',  // Pink
    accent: '#FBBF24',     // Yellow
    neutral: '#78716C',    // Stone
    success: '#84CC16',    // Lime
    warning: '#F59E0B',    // Amber
    error: '#DC2626',      // Red
    info: '#F97316',       // Orange
  },
  typography: DEFAULT_THEME.typography,
  spacing: DEFAULT_THEME.spacing,
  borderRadius: DEFAULT_THEME.borderRadius,
  shadows: DEFAULT_THEME.shadows,
};

// Forest Theme (Greens and Earth Tones)
export const FOREST_THEME: ThemeConfig = {
  name: 'Forest',
  colors: {
    primary: '#22C55E',    // Green
    secondary: '#84CC16',  // Lime
    accent: '#10B981',     // Emerald
    neutral: '#78716C',    // Stone
    success: '#22C55E',    // Green
    warning: '#F59E0B',    // Amber
    error: '#DC2626',      // Red
    info: '#14B8A6',       // Teal
  },
  typography: DEFAULT_THEME.typography,
  spacing: DEFAULT_THEME.spacing,
  borderRadius: DEFAULT_THEME.borderRadius,
  shadows: DEFAULT_THEME.shadows,
};

// Minimal Theme (Grays and Blacks)
export const MINIMAL_THEME: ThemeConfig = {
  name: 'Minimal',
  colors: {
    primary: '#18181B',    // Zinc 900
    secondary: '#3F3F46',  // Zinc 700
    accent: '#71717A',     // Zinc 500
    neutral: '#A1A1AA',    // Zinc 400
    success: '#10B981',    // Emerald
    warning: '#F59E0B',    // Amber
    error: '#EF4444',      // Red
    info: '#6366F1',       // Indigo
  },
  typography: DEFAULT_THEME.typography,
  spacing: DEFAULT_THEME.spacing,
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.25rem',
    lg: '0.375rem',
    xl: '0.5rem',
    '2xl': '0.75rem',
    full: '9999px',
  },
  shadows: DEFAULT_THEME.shadows,
};

// All preset themes
export const PRESET_THEMES = {
  default: DEFAULT_THEME,
  dark: DARK_THEME,
  ocean: OCEAN_THEME,
  sunset: SUNSET_THEME,
  forest: FOREST_THEME,
  minimal: MINIMAL_THEME,
};

// Get theme by name
export function getTheme(name: keyof typeof PRESET_THEMES): ThemeConfig {
  return PRESET_THEMES[name] || DEFAULT_THEME;
}

// Export theme as Tailwind Config
export function exportAsTailwindConfig(theme: ThemeConfig): string {
  return `// Tailwind Config
// Generated by HubLab Studio V2
// Theme: ${theme.name}

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${theme.colors.primary}',
        secondary: '${theme.colors.secondary}',
        accent: '${theme.colors.accent}',
        neutral: '${theme.colors.neutral}',
        success: '${theme.colors.success}',
        warning: '${theme.colors.warning}',
        error: '${theme.colors.error}',
        info: '${theme.colors.info}',
      },
      fontFamily: {
        sans: [${theme.typography.fontFamily.sans.split(',').map(f => `'${f.trim()}'`).join(', ')}],
        serif: [${theme.typography.fontFamily.serif.split(',').map(f => `'${f.trim()}'`).join(', ')}],
        mono: [${theme.typography.fontFamily.mono.split(',').map(f => `'${f.trim()}'`).join(', ')}],
      },
      spacing: {
        xs: '${theme.spacing.xs}',
        sm: '${theme.spacing.sm}',
        md: '${theme.spacing.md}',
        lg: '${theme.spacing.lg}',
        xl: '${theme.spacing.xl}',
        '2xl': '${theme.spacing['2xl']}',
        '3xl': '${theme.spacing['3xl']}',
        '4xl': '${theme.spacing['4xl']}',
      },
      borderRadius: {
        sm: '${theme.borderRadius.sm}',
        md: '${theme.borderRadius.md}',
        lg: '${theme.borderRadius.lg}',
        xl: '${theme.borderRadius.xl}',
        '2xl': '${theme.borderRadius['2xl']}',
        full: '${theme.borderRadius.full}',
      },
      boxShadow: {
        sm: '${theme.shadows.sm}',
        md: '${theme.shadows.md}',
        lg: '${theme.shadows.lg}',
        xl: '${theme.shadows.xl}',
        '2xl': '${theme.shadows['2xl']}',
      },
    },
  },
};`;
}

// Export theme as CSS Variables
export function exportAsCSSVariables(theme: ThemeConfig): string {
  return `/* CSS Variables */
/* Generated by HubLab Studio V2 */
/* Theme: ${theme.name} */

:root {
  /* Colors */
  --color-primary: ${theme.colors.primary};
  --color-secondary: ${theme.colors.secondary};
  --color-accent: ${theme.colors.accent};
  --color-neutral: ${theme.colors.neutral};
  --color-success: ${theme.colors.success};
  --color-warning: ${theme.colors.warning};
  --color-error: ${theme.colors.error};
  --color-info: ${theme.colors.info};

  /* Typography */
  --font-sans: ${theme.typography.fontFamily.sans};
  --font-serif: ${theme.typography.fontFamily.serif};
  --font-mono: ${theme.typography.fontFamily.mono};

  --font-size-xs: ${theme.typography.fontSize.xs};
  --font-size-sm: ${theme.typography.fontSize.sm};
  --font-size-base: ${theme.typography.fontSize.base};
  --font-size-lg: ${theme.typography.fontSize.lg};
  --font-size-xl: ${theme.typography.fontSize.xl};
  --font-size-2xl: ${theme.typography.fontSize['2xl']};
  --font-size-3xl: ${theme.typography.fontSize['3xl']};
  --font-size-4xl: ${theme.typography.fontSize['4xl']};

  --font-weight-normal: ${theme.typography.fontWeight.normal};
  --font-weight-medium: ${theme.typography.fontWeight.medium};
  --font-weight-semibold: ${theme.typography.fontWeight.semibold};
  --font-weight-bold: ${theme.typography.fontWeight.bold};

  /* Spacing */
  --spacing-xs: ${theme.spacing.xs};
  --spacing-sm: ${theme.spacing.sm};
  --spacing-md: ${theme.spacing.md};
  --spacing-lg: ${theme.spacing.lg};
  --spacing-xl: ${theme.spacing.xl};
  --spacing-2xl: ${theme.spacing['2xl']};
  --spacing-3xl: ${theme.spacing['3xl']};
  --spacing-4xl: ${theme.spacing['4xl']};

  /* Border Radius */
  --radius-sm: ${theme.borderRadius.sm};
  --radius-md: ${theme.borderRadius.md};
  --radius-lg: ${theme.borderRadius.lg};
  --radius-xl: ${theme.borderRadius.xl};
  --radius-2xl: ${theme.borderRadius['2xl']};
  --radius-full: ${theme.borderRadius.full};

  /* Shadows */
  --shadow-sm: ${theme.shadows.sm};
  --shadow-md: ${theme.shadows.md};
  --shadow-lg: ${theme.shadows.lg};
  --shadow-xl: ${theme.shadows.xl};
  --shadow-2xl: ${theme.shadows['2xl']};
}`;
}

// Export theme as JSON
export function exportAsJSON(theme: ThemeConfig): string {
  return JSON.stringify(theme, null, 2);
}

// Create custom theme
export function createCustomTheme(
  name: string,
  customColors: Partial<ThemeColors>,
  baseTheme: ThemeConfig = DEFAULT_THEME
): ThemeConfig {
  return {
    ...baseTheme,
    name,
    colors: {
      ...baseTheme.colors,
      ...customColors,
    },
  };
}

// Apply theme to component class names
export function applyThemeToClasses(
  baseClasses: string,
  theme: ThemeConfig
): string {
  // Replace Tailwind color classes with theme colors
  // This is a simplified version - in production, use proper Tailwind config
  return baseClasses
    .replace(/bg-blue-\d+/g, 'bg-primary')
    .replace(/text-blue-\d+/g, 'text-primary')
    .replace(/border-blue-\d+/g, 'border-primary')
    .replace(/bg-purple-\d+/g, 'bg-secondary')
    .replace(/text-purple-\d+/g, 'text-secondary')
    .replace(/border-purple-\d+/g, 'border-secondary');
}

// Example usage
export const EXAMPLE_USAGE = `
import { getTheme, exportAsTailwindConfig, createCustomTheme } from './theme-system';

// Use a preset theme
const oceanTheme = getTheme('ocean');

// Export as Tailwind config
const tailwindConfig = exportAsTailwindConfig(oceanTheme);

// Create custom theme
const customTheme = createCustomTheme('My Brand', {
  primary: '#FF6B6B',
  secondary: '#4ECDC4',
  accent: '#FFE66D',
});

// Export as CSS variables
const cssVars = exportAsCSSVariables(customTheme);
`;
