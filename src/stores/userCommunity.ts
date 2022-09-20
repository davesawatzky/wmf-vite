import { defineStore, acceptHMRUpdate } from 'pinia'

interface CommunityInfo {
	id: string
	name: string
	groupSize: number
	chaperones: number
	wheelchairs: number
	conflictPerformers: string
}

export const useCommunity = defineStore('community', {
	state: () => ({
		group: {
			id: '',
			name: '',
			groupSize: 10,
			chaperones: 0,
			wheelchairs: 0,
			conflictPerformers: '',
		} as CommunityInfo,
	}),

	getters: {},
	actions: {
		addToStore(communityData: CommunityInfo) {
			if (communityData) {
				Object.assign(this.group, communityData)
			}
		},
	},
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useCommunity, import.meta.hot))
}
