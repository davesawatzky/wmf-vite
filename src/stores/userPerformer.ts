import { defineStore } from 'pinia'
import {
	useQuery,
	useMutation,
	provideApolloClient,
} from '@vue/apollo-composable'
import apolloClient from '@/utilities/apolloClient'
import PERFORMER_CREATE_MUTATION from '@/graphql/mutations/PerformerCreate.mutation.gql'
import PERFORMER_UPDATE_MUTATION from '@/graphql/mutations/PerformerUpdate.mutation.gql'
import PERFORMER_DELETE_MUTATION from '@/graphql/mutations/PerformerDelete.mutation.gql'
import PERFORMER_LOAD_QUERY from '@/graphql/queries/PerformerLoad.query.gql'

interface PerformerInfo {
	id?: string
	lastName: string
	firstName: string
	apartment: string
	streetNumber: string
	streetName: string
	city: string
	province: string
	postalCode: string
	phone: string
	email: string
	age: number
	instrument: string
	level: string
	otherClasses: string
}

provideApolloClient(apolloClient)

export const usePerformers = defineStore('performers', {
	state: () => ({
		performer: [] as PerformerInfo[],
	}),
	getters: {
		numberOfPerformers(state) {
			return state.performer.length
		},
		fullName(state): string[] {
			let name = state.performer.map((item) => {
				return item.firstName + ' ' + item.lastName
			})
			return name
		},
	},
	actions: {
		addToStore(performerContactInfo: PerformerInfo | null) {
			this.performer.push({
				id: '',
				lastName: '',
				firstName: '',
				age: 10,
				apartment: '',
				streetNumber: '',
				streetName: '',
				city: 'Winnipeg',
				province: 'MB',
				postalCode: '',
				phone: '',
				email: '',
				instrument: '',
				level: '',
				otherClasses: '',
			})
			if (performerContactInfo) {
				Object.assign(
					this.performer[this.performer.length - 1],
					performerContactInfo
				)
			}
		},

		async createPerformer(registrationId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: performerCreate,
					onDone: donePerformerCreate,
					onError,
				} = useMutation(PERFORMER_CREATE_MUTATION)
				this.addToStore(null)
				let clone = Object.assign({}, this.performer[this.performer.length - 1])
				delete clone.id
				performerCreate({
					registrationId,
					performer: clone,
				})
				donePerformerCreate((result) => {
					this.performer[this.performer.length - 1].id =
						result.data.performerCreate.performer.id
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async loadPerformers(registrationId: string) {
			return new Promise((resolve, reject) => {
				const { onResult: resultLoadPerformers, onError } = useQuery(
					PERFORMER_LOAD_QUERY,
					{ registrationId },
					{ fetchPolicy: 'no-cache' }
				)
				resultLoadPerformers((result) => {
					let clone = structuredClone(result.data.registration.performers)

					for (let i = 0; i < clone.length; i++) {
						delete clone[i].__typename
						this.addToStore(clone[i])
					}
					resolve(true)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async updatePerformer(performerIndex: number, performerId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: performerUpdate,
					onDone,
					onError,
				} = useMutation(PERFORMER_UPDATE_MUTATION, {
					fetchPolicy: 'no-cache',
				})
				let clone = Object.assign({}, this.performer[performerIndex])
				delete clone.id
				performerUpdate({ performerId, performer: clone })
				onDone((result) => {
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async updateAllPerformers() {
			let performerIndex = 0
			for (let eachPerformer of this.performer) {
				await this.updatePerformer(performerIndex, eachPerformer.id!)
				performerIndex++
			}
		},

		async deletePerformer(performerId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: performerDelete,
					onDone: donePerformerDelete,
					onError,
				} = useMutation(PERFORMER_DELETE_MUTATION)
				performerDelete({ performerId })
				donePerformerDelete((result) => {
					let index = this.performer.map((e) => e.id).indexOf(performerId)
					this.performer.splice(index, 1)
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},
	},
	persist: true,
})

// if (import.meta.hot) {
// 	import.meta.hot.accept(acceptHMRUpdate(usePerformers, import.meta.hot))
// }
