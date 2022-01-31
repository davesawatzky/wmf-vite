import { createApp, provide, h } from 'vue'
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client/core'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './App.vue'
import routes from './router'
import { createPinia } from 'pinia'
import './assets/css/index.css'

const httpLink = createHttpLink({
  uri: 'http://localhost:8080/graphql',
})

const cache = new InMemoryCache()

const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
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
