import { createApp, provide, h } from 'vue'
import apolloClient from './utilities/apolloClient'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './App.vue'
import routes from './router'
import { createPinia } from 'pinia'
import './assets/css/index.css'

const app = createApp({
	setup() {
		provide(DefaultApolloClient, apolloClient)
	},
	render() {
		return h(App)
	},
})

app.use(createPinia()).use(routes).mount('#app')
