import { defineStore, acceptHMRUpdate } from 'pinia'
import { provideApolloClient, useMutation } from '@vue/apollo-composable'
import apolloClient from '@/utilities/apolloClient'
import REGISTRATION_CREATE_MUTATION from '@/graphql/mutations/RegistrationCreate.mutation.gql'
import REGISTRATION_DELETE_MUTATION from '@/graphql/mutations/RegistrationDelete.mutation.gql'
import REGISTRATION_UPDATE_MUTATION from '@/graphql/mutations/RegistrationUpdate.mutation.gql'

/**
 * Items get added to the Registration store when they're
 * chosen from the Registration display, not before.
 * The application only works on individual forms, therefore
 * only one registration should be in the store at any one time.
 */

export enum EnumPerformerType {
	'SOLO',
	'GROUP',
	'SCHOOL',
	'COMMUNITY',
}
export interface Registration {
	id?: string
	label: string
	performerType: keyof typeof EnumPerformerType
	submittedAt?: Date
	totalAmt: number
	payedAmt: number
	transactionInfo: string
	discipline: string
	confirmation: string
	createdAt?: Date
	__typename?: string
}

provideApolloClient(apolloClient)

export const useRegistration = defineStore('registrations', {
	state: () => ({
		registrationId: '',
		registrations: [] as Registration[],
	}),
	getters: {},
	actions: {
		addToStore(data: Registration) {
			if (this.registrations.length > 0) {
				this.registrations.splice(0, 1, data)
			} else {
				this.registrations.push(data)
			}
		},

		async createRegistration(
			performerType: Registration['performerType'],
			label: string
		) {
			return new Promise((resolve, reject) => {
				const {
					mutate: registrationCreate,
					onDone: doneNewReg,
					onError,
				} = useMutation(REGISTRATION_CREATE_MUTATION)
				registrationCreate({ performerType, label })
				doneNewReg((result) => {
					let clone = Object.assign(
						{},
						result.data.registrationCreate.registration
					)
					this.addToStore(clone)
					this.registrationId = clone.id
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		updateRegistration() {
			return new Promise((resolve, reject) => {
				const {
					mutate: registrationUpdate,
					onDone,
					onError,
				} = useMutation(REGISTRATION_UPDATE_MUTATION, {
					fetchPolicy: 'network-only',
				})
				let clone = Object.assign({}, this.registrations[0])
				delete clone.id
				delete clone.__typename
				delete clone.createdAt
				registrationUpdate({
					registrationId: this.registrationId,
					registration: clone,
				})
				onDone((result) => {
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async deleteRegistration(registrationId: string) {
			const { mutate: registrationDelete } = useMutation(
				REGISTRATION_DELETE_MUTATION
			)
			await registrationDelete({ registrationDeleteId: registrationId })
		},
	},
})

// if (import.meta.hot) {
// 	import.meta.hot.accept(acceptHMRUpdate(useRegistration, import.meta.hot))
// }
