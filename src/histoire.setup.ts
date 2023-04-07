// src/histoire.setup.ts

import { createPinia } from 'pinia'
import { defineSetupVue3 } from '@histoire/plugin-vue'
import '/src/assets/css/index.css'

export const setupVue3 = defineSetupVue3(({ app }) => {
  const pinia = createPinia()
  app.use(pinia) // Add Pinia store
})
