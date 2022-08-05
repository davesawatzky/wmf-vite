import { defineStore } from 'pinia'

interface AppFlags {
	editExisting: boolean
	performerType: 'SOLO' | 'GROUP' | 'SCHOOL'
	registrationId: string
	registrationExists: boolean
	performerContactExists: boolean
	teacherContactExists: boolean
	classExists: boolean
	worksExists: boolean
}

export const useAppStore = defineStore('appStore', {
	state: () =>
		<AppFlags>{
			editExisting: false,
			registrationId: '',
			performerType: 'SOLO',
			registrationExists: false,
			performerContactExists: false,
			teacherContactExists: false,
			classExists: false,
			worksExists: false,
		},
})
