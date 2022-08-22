import { defineStore } from 'pinia'

interface PerformerInfo {
	id: string
	lastName: string
	firstName: string
	address: string
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

export const usePerformers = defineStore('performers', {
	state: () => ({
		registrationId: '',
		performer: [] as PerformerInfo[],
	}),
	getters: {
		fullName() {},
		numberOfPerformers(): Number {
			return this.performer.length
		},
	},
	actions: {
		addToStore(performerContactInfo: PerformerInfo | null) {
			if (performerContactInfo) {
				this.performer.push(performerContactInfo)
			} else {
				this.performer.push({
					id: '',
					lastName: '',
					firstName: '',
					address: '',
					city: 'Winnipeg',
					province: 'MB',
					postalCode: '',
					phone: '',
					email: '',
					age: 0,
					instrument: '',
					level: '',
					otherClasses: '',
				})
			}
		},
		removePerformer(index: number) {
			this.performer.splice(index, 1)
		},
	},
})
