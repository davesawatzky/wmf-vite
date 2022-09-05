import { defineStore } from 'pinia'

export const useGroup = defineStore('groups', {
	state: () => ({
		group: [
			{
				id: 0,
				name: '',
				type: '', //Vocal, Instrumental
				numPerformers: 0,
				age: 0,
				instruments: '',
				perfInOtherClasses: '',
				numOfChaperones: 0,
				numWheelchairs: 0,
				earliestTime: '',
				latestTime: '',
				unavailable: [
					{
						id: 0,
						date: '',
						time: '',
					},
				],
			},
		],
	}),
	getters: {},
	actions: {},
})
