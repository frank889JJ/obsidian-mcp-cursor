declare module '*.json' {
  const value: any
  export default value
}

declare module 'unocss' {
  import { Theme } from 'unocss/preset-uno'
  
  export function defineConfig(config: {
    presets?: any[]
    theme?: Partial<Theme>
  }): any
  
  export function presetUno(): any
}

declare module 'unocss/preset-uno' {
  export interface Theme {
    colors: {
      primary: string
      secondary: string
      accent: string
      neutral: string
    }
  }
} 