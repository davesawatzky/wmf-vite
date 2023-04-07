import { defaultColors, defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
  setupFile: './src/histoire.setup.ts',
  plugins: [
    HstVue(),
  ],
   theme: {
    title: 'WMF',
    logo: {
      square: './src/assets/images/wmf-logo-banner.jpg',
      light: './src/assets/images/wmf-logo-banner.jpg',
      dark: './src/assets/images/wmf-logo-banner.jpg'
    },
    logoHref: 'https://winnipegmusicfestival.ca',
     favicon: 'favicon.ico',
     colors: {
      primary: defaultColors.blue,
    }
  }
})
