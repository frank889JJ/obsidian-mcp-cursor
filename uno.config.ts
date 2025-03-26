import { defineConfig, presetUno } from 'unocss'
import type { Theme } from 'unocss/preset-uno'
import sources from './shared/sources.json' assert { type: 'json' }

export default defineConfig({
  presets: [presetUno()],
  theme: {
    colors: {
      primary: 'rgb(var(--primary))',
      secondary: 'rgb(var(--secondary))',
      accent: 'rgb(var(--accent))',
      neutral: 'rgb(var(--neutral))',
    },
  },
}) 