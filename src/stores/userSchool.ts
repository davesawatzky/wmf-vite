import { defineStore, acceptHMRUpdate } from 'pinia'

interface SchoolInfo {
	id: string
	name: string
	division: string
	streetNumber: string
	streetName: string
	city: string
	province: string
	postalCode: string
	phone: string
	earliestTime: string
	latestTime: string
	unavailable: string
	conflictStudents: string
}

export const useSchool = defineStore('school', {
	state: () =>
		({
			id: '',
			name: '',
			division: '',
			streetNumber: '',
			streetName: '',
			city: 'Winnipeg',
			province: 'MB',
			postalCode: '',
			phone: '',
			earliestTime: '',
			latestTime: '',
			unavailable: '',
			conflictStudents: '',
		} as SchoolInfo),
	getters: {},
	actions: {
		addToStore(schoolData: SchoolInfo) {
			if (schoolData) {
				Object.assign(this.$state, schoolData)
			}
		},
	},
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useSchool, import.meta.hot))
}
