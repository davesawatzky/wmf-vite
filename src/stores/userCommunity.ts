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
	earliestTime: string
	latestTime: string
	unavailable: string
	conflictPerformers: string
	__typename?: string
}

provideApolloClient(apolloClient)

export const useCommunity = defineStore('community', {
	state: () => ({
		communityInfo: [] as CommunityInfo[],
	}),

	getters: {},
	actions: {
		addToStore(communityData: CommunityInfo | null) {
			this.communityInfo.push({
				id: '',
				name: '',
				groupSize: 10,
				chaperones: 0,
				wheelchairs: 0,
				earliestTime: '',
				latestTime: '',
				unavailable: '',
				conflictPerformers: '',
			})
			if (communityData) {
				Object.assign(
					this.communityInfo[this.communityInfo.length - 1],
					communityData
				)
			}
		},

		async createCommunity(registrationId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: communityCreate,
					onDone: doneCommunityCreate,
					onError,
				} = useMutation(COMMUNITY_CREATE_MUTATION)
				this.addToStore(null)
				let clone = Object.assign(
					{},
					this.communityInfo[this.communityInfo.length - 1]
				)
				delete clone.id
				communityCreate({
					registrationId,
					community: clone,
				})
				doneCommunityCreate((result) => {
					this.communityInfo[this.communityInfo.length - 1].id =
						result.data.communityCreate.community.id
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async loadCommunities(registrationId: string) {
			return new Promise((resolve, reject) => {
				const { onResult: resultLoadCommunity, onError } = useQuery(
					COMMUNITY_LOAD_QUERY,
					{ registrationId },
					{ fetchPolicy: 'no-cache' }
				)
				resultLoadCommunity((result) => {
					let clone = structuredClone(result.data.registration.communities)
					for (let i = 0; i < clone.length; i++) {
						delete clone.__typename
						this.addToStore(clone[i])
					}
					resolve(true)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async updateCommunity(communityIndex: number, communityId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: communityUpdate,
					onDone,
					onError,
				} = useMutation(COMMUNITY_UPDATE_MUTATION, {
					fetchPolicy: 'no-cache',
				})
				let clone = Object.assign({}, this.communityInfo[communityIndex])
				delete clone.id
				delete clone.__typename
				communityUpdate({
					communityId,
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

		async updateAllCommunities() {
			let communityIndex = 0
			for (let eachCommunity of this.communityInfo) {
				await this.updateCommunity(communityIndex, eachCommunity.id!)
				communityIndex++
			}
		},

		async deleteCommunity(communityId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: communityDelete,
					onDone: doneCommunityDelete,
					onError,
				} = useMutation(COMMUNITY_DELETE_MUTATION)
				communityDelete({ communityId })
				doneCommunityDelete((result) => {
					let index = this.communityInfo.map((e) => e.id).indexOf(communityId)
					this.communityInfo.splice(index, 1)
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},
	},
})

// if (import.meta.hot) {
// 	import.meta.hot.accept(acceptHMRUpdate(useCommunity, import.meta.hot))
// }
