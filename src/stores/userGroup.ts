import { defineStore } from 'pinia'

interface Group {
	id: string
	name: string
	type: string
	numPerformers: number
	age: number
	instruments: string
}

export const useGroup = defineStore('group', {
	state: () =>
		({
			id: '',
			name: '',
			type: '', //Vocal, Instrumental
			numPerformers: 2,
			age: 10,
			instruments: '',
		} as Group),
	getters: {},
	actions: {
		addToStore(groupData: Group | null) {
			if (groupData) {
				Object.assign(this.$state, groupData)
			}
		},
	},
})
