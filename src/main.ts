import { createApp, provide, h } from 'vue'
import {
	ApolloClient,
	HttpLink,
	InMemoryCache,
	ApolloLink,
	concat,
} from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './App.vue'
import routes from './router'
import { createPinia } from 'pinia'
import './assets/css/index.css'
import './assets/css/spinner.css'

const httpLink = new HttpLink({
	uri: 'http://localhost:4000/graphql',
})

const authLink = new ApolloLink((operation, forward) => {
	const token = localStorage.getItem('diatonicToken')
	operation.setContext({
		headers: {
			authorization: token ? `${token}` : null,
		},
	})
	return forward(operation)
})

const apolloClient = new ApolloClient({
	link: concat(authLink, httpLink),
	cache: new InMemoryCache(),
	connectToDevTools: true,
})

const app = createApp({
	setup() {
		provide(DefaultApolloClient, apolloClient)
	},
	render() {
		return h(App)
	},
})

app.use(createPinia()).use(routes).mount('#app')
