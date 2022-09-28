import { defineStore, acceptHMRUpdate } from 'pinia'
import {
	useQuery,
	useMutation,
	provideApolloClient,
} from '@vue/apollo-composable'
import apolloClient from '@/utilities/apolloClient'
import COMMUNITY_LOAD_QUERY from '@/graphql/queries/CommunityLoad.query.gql'
import COMMUNITY_CREATE_MUTATION from '@/graphql/mutations/CommunityCreate.mutation.gql'
import COMMUNITY_UPDATE_MUTATION from '@/graphql/mutations/CommunityUpdate.mutation.gql'
import COMMUNITY_DELETE_MUTATION from '@/graphql/mutations/CommunityDelete.mutation.gql'

interface CommunityInfo {
	id?: string
	name: string
	groupSize: number
	chaperones: number
	wheelchairs: number
	conflictPerformers: string
}

provideApolloClient(apolloClient)

export const useCommunity = defineStore('community', {
	state: () => ({
		communityInfo: {
			id: '',
			name: '',
			groupSize: 10,
			chaperones: 0,
			wheelchairs: 0,
			conflictPerformers: '',
		} as CommunityInfo,
	}),

	getters: {},
	actions: {
		addToStore(communityData: CommunityInfo) {
			Object.assign(this.communityInfo, communityData)
		},

		async createCommunity(registrationId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: communityCreate,
					onDone: doneCommunityCreate,
					onError,
				} = useMutation(COMMUNITY_CREATE_MUTATION)
				let clone = Object.assign({}, this.communityInfo)
				delete clone.id
				communityCreate({
					registrationId,
					community: clone,
				})
				doneCommunityCreate((result) => {
					this.communityInfo.id = result.data.communityCreate.community.id
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async loadCommunity(registrationId: string) {
			return new Promise((resolve, reject) => {
				const { onResult: resultLoadCommunity, onError } = useQuery(
					COMMUNITY_LOAD_QUERY,
					{ registrationId },
					{ fetchPolicy: 'network-only' }
				)
				resultLoadCommunity((result) => {
					let clone = Object.assign({}, result.data.registration.communities[0])
					delete clone.__typename
					this.addToStore(clone)
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async updateCommunity() {
			return new Promise((resolve, reject) => {
				const {
					mutate: communityUpdate,
					onDone,
					onError,
				} = useMutation(COMMUNITY_UPDATE_MUTATION, {
					fetchPolicy: 'network-only',
				})
				let clone = Object.assign({}, this.communityInfo)
				delete clone.id
				communityUpdate({
					communityId: this.communityInfo.id,
					community: clone,
				})
				onDone((result) => {
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async deleteCommunity(communityId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: communityDelete,
					onDone,
					onError,
				} = useMutation(COMMUNITY_DELETE_MUTATION)
				communityDelete({ communityId })
				onDone((result) => {
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},
	},
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useCommunity, import.meta.hot))
}
