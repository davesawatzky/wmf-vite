import { createApp } from 'vue'
import App from './App.vue'
import routes from './router'
import { createPinia } from 'pinia'
import './assets/css/index.css'

createApp(App).use(createPinia()).use(routes).mount('#app')
