import { defineStore, acceptHMRUpdate } from 'pinia'

enum EnumPerformerType {
	'SOLO',
	'GROUP',
	'SCHOOL',
	'COMMUNITY',
}
interface AppFlags {
	editExisting: boolean
	performerType: keyof typeof EnumPerformerType
	registrationExists: boolean
	performerContactLoaded: boolean
	groupInfoLoaded: boolean
	schoolInfoLoaded: boolean
	communityInfoLoaded: boolean
	teacherLoaded: boolean
	classExists: boolean
	selectionExists: boolean
	classContentLoaded: boolean
}

export const useAppStore = defineStore('appStore', {
	state: () =>
		<AppFlags>{
			editExisting: false, // edits an existing registration from the db
			performerType: 'SOLO', // default performertype - just in case.
			registrationExists: false, // registration exists in the db
			performerContactLoaded: false, // performer contact already exists and is loaded
			groupInfoLoaded: false,
			schoolInfoLoaded: false,
			communityInfoLoaded: false,
			teacherLoaded: false, // teacher contact already exists and is loaded
			classExists: false, // registered class is fully loaded into class form
			selectionExists: false, // registered selection is fully loaded into class form
			classContentLoaded: false, // Existing class content is loaded from db
		},
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAppStore, import.meta.hot))
}
