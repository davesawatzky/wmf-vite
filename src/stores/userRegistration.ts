import { defineStore, acceptHMRUpdate } from 'pinia'
import { provideApolloClient, useMutation } from '@vue/apollo-composable'
import apolloClient from '@/utilities/apolloClient'
import ADD_REGISTRATION_MUTATION from '@/graphql/mutations/addRegistration.mutation.gql'

/**
 * Items get added to the Registration store when they're
 * chosen from the Registration display, not before.
 * The application only works on individual forms, therefore
 * only one registration should be in the store at any one time.
 */
interface Registration {
	id: string
	label: string
	performerType: string
	submittedAt: string
	totalAmt: number
	payedAmt: number
	transactionInfo: string
	confirmation: string
}

provideApolloClient(apolloClient)

export const useRegistration = defineStore('registrations', {
	state: () => ({
		registrations: [] as Registration[],
	}),
	getters: {},
	actions: {
		loadRegistrationInfo() {},

		addToStore(data: Registration) {
			if (this.registrations.length > 0) {
				this.registrations.splice(0, 1, data)
			} else {
				this.registrations.push(data)
			}
		},

		async createRegistration(performerType: 'SOLO' | 'GROUP' | 'SCHOOL') {
			const { mutate: newReg, onDone: doneNewReg } = useMutation(
				ADD_REGISTRATION_MUTATION
			)
			newReg({ performerType })
			doneNewReg((result) => {
				this.addToStore(result.data.registrationCreate.registration)
			})
		},

		removeRegistration(): void {},
		saveRegistration() {},
	},
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useRegistration, import.meta.hot))
}
