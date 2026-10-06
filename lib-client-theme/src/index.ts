import { createContext, createElement, useContext } from 'react';
import type { ReactNode } from 'react';

export const theme = {
  colors: {
    border: '#9eafb8',
    borderSubtle: '#e2e8eb',
    error: '#b42318',
    errorBorder: '#d92d20',
    errorSurface: '#fef3f2',
    ink: '#20272c',
    mutedInk: '#52616b',
    pressedSurface: '#dfe9ed',
    scopeThumb: '#f4f6f7',
    scopeTrack: '#aebbc2',
    scopeTrackActive: '#9bbec8',
    selected: '#356a79',
    subtleSurface: '#edf3f5',
    surface: '#ffffff',
  },
  radius: {
    control: 6,
  },
  sizes: {
    checkbox: 18,
    control: 40,
    scopeRow: 52,
  },
  spacing: {
    buttonHorizontal: 14,
    buttonVertical: 8,
    field: 8,
    inputHorizontal: 12,
    inputVertical: 8,
    scopeRowHorizontal: 12,
    scopeRowVertical: 8,
  },
  typography: {
    body: 14,
    buttonWeight: '600',
    heading: 20,
    headingLineHeight: 1.3,
    headingWeight: '600',
    label: 13,
    labelLineHeight: 18,
    labelWeight: '500',
  },
} as const;

export type ThemeMode = 'light' | 'dark';
export type Theme = Omit<typeof theme, 'colors'> & {
  colors: { [Color in keyof typeof theme.colors]: string };
};

export const darkTheme: Theme = {
  ...theme,
  colors: {
    ...theme.colors,
    border: '#526169',
    borderSubtle: '#39464c',
    error: '#ff8a80',
    errorBorder: '#ff7f73',
    errorSurface: '#3b2425',
    ink: '#f1f4f5',
    mutedInk: '#b0bdc2',
    pressedSurface: '#37454b',
    scopeThumb: '#d6e0e3',
    scopeTrack: '#66767c',
    scopeTrackActive: '#769ba5',
    selected: '#8ccbd5',
    subtleSurface: '#2c383d',
    surface: '#1b2529',
  },
};

const ThemeContext = createContext<Theme>(theme);

export const ThemeProvider = ({
  children,
  mode,
}: {
  children: ReactNode;
  mode: ThemeMode;
}) =>
  createElement(
    ThemeContext.Provider,
    { value: mode === 'dark' ? darkTheme : theme },
    children,
  );

export const useTheme = () => useContext(ThemeContext);
