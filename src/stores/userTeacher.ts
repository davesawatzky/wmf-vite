import { defineStore, acceptHMRUpdate } from 'pinia'

interface TeacherInfo {
	id: string
	prefix: string
	lastName: string
	firstName: string
	address: string
	city: string
	province: string
	postalCode: string
	phone: string
	email: string
}

export const useTeacher = defineStore('teacher', {
	state: () => ({
		// registrationId: '',
		teacherInfo: {
			id: '',
			prefix: '',
			lastName: '',
			firstName: '',
			address: '',
			city: 'Winnipeg',
			province: 'MB',
			postalCode: '',
			phone: '',
			email: '',
		} as TeacherInfo,
	}),
	getters: {
		fullName(): String {
			return this.teacherInfo.firstName + ' ' + this.teacherInfo.lastName
		},
	},
	actions: {
		addToStore(teacherContactInfo: TeacherInfo | null) {
			if (teacherContactInfo) {
				Object.assign(this.teacherInfo, teacherContactInfo)
			}
		},
	},
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useTeacher, import.meta.hot))
}
