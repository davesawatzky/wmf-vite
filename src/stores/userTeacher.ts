import { defineStore } from 'pinia'
import {
	useQuery,
	useMutation,
	provideApolloClient,
} from '@vue/apollo-composable'
import apolloClient from '@/utilities/apolloClient'
import TEACHER_LOAD_QUERY from '@/graphql/queries/TeacherLoad.query.gql'
import TEACHER_CREATE_MUTATION from '@/graphql/mutations/TeacherCreate.mutation.gql'
import TEACHER_UPDATE_MUTATION from '@/graphql/mutations/TeacherUpdate.mutation.gql'
import TEACHER_DELETE_MUTATION from '@/graphql/mutations/TeacherDelete.mutation.gql'

interface TeacherInfo {
	id?: string
	prefix: string
	lastName: string
	firstName: string
	apartment?: string
	streetNumber: string
	streetName: string
	city: string
	province: string
	postalCode: string
	phone: string
	email: string
}

provideApolloClient(apolloClient)

export const useTeacher = defineStore('teacher', {
	state: () => ({
		// registrationId: '',
		teacherInfo: {
			id: '',
			prefix: '',
			lastName: '',
			firstName: '',
			apartment: '',
			streetNumber: '',
			streetName: '',
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
		addToStore(teacherInfo: TeacherInfo) {
			Object.assign(this.teacherInfo, teacherInfo)
		},

		async createTeacher(registrationId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: teacherCreate,
					onDone: doneTeacherCreate,
					onError,
				} = useMutation(TEACHER_CREATE_MUTATION)
				let clone = Object.assign({}, this.teacherInfo)
				delete clone.id
				teacherCreate({
					registrationId,
					teacher: clone,
				})
				doneTeacherCreate((result) => {
					this.teacherInfo.id = result.data.teacherCreate.teacher.id
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async loadTeacher(registrationId: string) {
			return new Promise((resolve, reject) => {
				const { onError, onResult: resultLoadTeacher } = useQuery(
					TEACHER_LOAD_QUERY,
					{ registrationId },
					{ fetchPolicy: 'network-only' }
				)
				resultLoadTeacher((result) => {
					let clone = Object.assign({}, result.data.registration.teacher)
					delete clone.__typename
					this.addToStore(clone)
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async updateTeacher() {
			return new Promise((resolve, reject) => {
				const {
					mutate: teacherUpdate,
					onError,
					onDone,
				} = useMutation(TEACHER_UPDATE_MUTATION, {
					fetchPolicy: 'network-only',
				})
				let clone = Object.assign({}, this.teacherInfo)
				delete clone.id
				teacherUpdate({
					teacherId: this.teacherInfo.id,
					teacher: clone,
				})
				onDone((result) => {
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async deleteTeacher(teacherId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: teacherDelete,
					onDone,
					onError,
				} = useMutation(TEACHER_DELETE_MUTATION)
				teacherDelete({ teacherId })
				onDone((result) => {
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},
	},
	persist: true,
})

// if (import.meta.hot) {
// 	import.meta.hot.accept(acceptHMRUpdate(useTeacher, import.meta.hot))
// }
