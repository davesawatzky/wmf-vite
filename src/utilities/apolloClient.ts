import {
	ApolloClient,
	HttpLink,
	InMemoryCache,
	ApolloLink,
	concat,
} from '@apollo/client/core'

const httpLink = new HttpLink({
	uri: 'https://wmf-registration-38bfy.ondigitalocean.app/graphql',
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

export default apolloClient
