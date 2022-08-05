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
		addToStore(data: PerformerInfo | null) {
			if (data) {
				this.performer.push(data)
			} else {
				this.performer.push({
					id: '',
					lastName: '',
					firstName: '',
					address: '',
					city: '',
					province: '',
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
		removePerformer() {},
	},
})
