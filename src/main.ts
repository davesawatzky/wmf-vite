import { createApp, provide, h } from 'vue'
import apolloClient from './utilities/apolloClient'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './App.vue'
import routes from './router'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFilePen, faEye, faBan } from '@fortawesome/free-solid-svg-icons'
import { faTrashCan } from '@fortawesome/free-regular-svg-icons'
// import Maska from 'maska'
import './assets/css/index.css'

library.add(faFilePen, faTrashCan, faEye, faBan)

const app = createApp({
	setup() {
		provide(DefaultApolloClient, apolloClient)
	},
	render() {
		return h(App)
	},
})

const pinia = createPinia()
pinia.use(createPersistedState({ storage: sessionStorage }))

app
	.use(pinia)
	// .use(Maska)
	.use(routes)
	.use(autoAnimatePlugin)
	.component('font-awesome-icon', FontAwesomeIcon)
	.mount('#app')
