import { defineStore, acceptHMRUpdate } from 'pinia'

interface Descriptions {
	subdisciplineDescription: string
	categoryDescription: string
	levelDescription: string
	trophyDescriptions: TrophyDescriptions[]
	requiredSelection: string
}
interface TrophyDescriptions {
	name: string
	description: string
}

export const festivalClasses = defineStore('festivalClasses', {
	state: () => ({
		descriptions: [
			{
				subdisciplineDescription: '',
				categoryDescription: '',
				levelDescription: '',
				trophyDescriptions: [{ name: '', description: '' }],
				requiredSelection: '',
			},
		] as Descriptions[],
	}),
	actions: {
		async addDescriptions() {
			this.descriptions.push({} as Descriptions)
		},

		async removeDescriptions(index: number) {
			this.descriptions.splice(index, 1)
		},
	},
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(festivalClasses, import.meta.hot))
}
