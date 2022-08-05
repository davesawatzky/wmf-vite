import { defineStore } from 'pinia'

/**
 * Items get added to the Registration store when they're
 * chosen from the Registration display, not before.
 * The application only works on individual forms, therefore
 * only one registration should be in the store at any one time.
 */
interface Registration {
	id: number
	label: string
	performerType: string
	submittedAt: string
	totalAmt: number
	payedAmt: number
	transactionInfo: string
	confirmation: string
}

export const useRegistration = defineStore('registrations', {
	state: () => ({
		registrations: [] as Registration[],
	}),
	getters: {},
	actions: {
		loadRegistrationInfo() {},

		// Only one registration allowed to be worked on at a time
		// Therefore the currentitem is replaced.
		addToStore(data: Registration) {
			if (this.registrations.length > 0) {
				this.registrations.splice(0, 1, data)
			} else {
				this.registrations.push(data)
			}
		},

		removeRegistration() {},
		saveRegistration() {},
	},
})
