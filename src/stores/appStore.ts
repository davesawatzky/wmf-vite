import { defineStore } from 'pinia'

interface AppFlags {
	editExisting: boolean
	performerType: 'SOLO' | 'GROUP' | 'SCHOOL'
	registrationId: string
	registrationExists: boolean
	performerContactLoaded: boolean
	teacherContactLoaded: boolean
	classExists: boolean
	selectionExists: boolean
	classContentLoaded: boolean
}

export const useAppStore = defineStore('appStore', {
	state: () =>
		<AppFlags>{
			editExisting: false, // edits an existing registration from the db
			registrationId: '', // The registration Id
			performerType: 'SOLO', // default performertype - just in case.
			registrationExists: false, // registration exists in the db
			performerContactLoaded: false, // performer contact already exists and is loaded
			teacherContactLoaded: false, // teacher contact already exists and is loaded
			classExists: false, // registered class is fully loaded into class form
			selectionExists: false, // registered selection is fully loaded into class form
			classContentLoaded: false, // Existing class content is loaded from db
		},
})
