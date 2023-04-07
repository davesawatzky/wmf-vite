import { defineStore } from 'pinia'
import {
	useQuery,
	useMutation,
	provideApolloClient,
} from '@vue/apollo-composable'
import apolloClient from '@/utilities/apolloClient'
import SCHOOL_LOAD_QUERY from '@/graphql/queries/SchoolLoad.query.gql'
import SCHOOL_CREATE_MUTATION from '@/graphql/mutations/SchoolCreate.mutation.gql'
import SCHOOL_UPDATE_MUTATION from '@/graphql/mutations/SchoolUpdate.mutation.gql'
import SCHOOL_DELETE_MUTATION from '@/graphql/mutations/SchoolDelete.mutation.gql'

interface SchoolInfo {
	id?: string
	name: string
	division: string
	street_number: string
	street_name: string
	city: string
	province: string
	postal_code: string
	phone: string
	__typename?: string
}

provideApolloClient(apolloClient)

export const useSchool = defineStore('school', {
	state: () => ({
		schoolInfo: {
			id: '',
			name: '',
			division: '',
			street_number: '',
			street_name: '',
			city: 'Winnipeg',
			province: 'MB',
			postal_code: '',
			phone: '',
		} as SchoolInfo,
	}),
	getters: {},
	actions: {
		addToStore(schoolInfo: SchoolInfo) {
			Object.assign(this.schoolInfo, schoolInfo)
		},

		async createSchool(registrationId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: schoolCreate,
					onDone: doneSchoolCreate,
					onError,
				} = useMutation(SCHOOL_CREATE_MUTATION)
				let clone = Object.assign({}, this.schoolInfo)
				delete clone.id
				schoolCreate({
					registrationId,
					school: clone,
				})
				doneSchoolCreate((result) => {
					this.schoolInfo.id = result.data.schoolCreate.school.id
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async loadSchool(registrationId: string) {
			return new Promise((resolve, reject) => {
				const { onResult: resultLoadSchool, onError } = useQuery(
					SCHOOL_LOAD_QUERY,
					{ registrationId },
					{ fetchPolicy: 'network-only' }
				)
				resultLoadSchool((result) => {
					let clone = Object.assign({}, result.data.registration.school)
					delete clone.__typename
					this.addToStore(clone)
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async updateSchool() {
			return new Promise((resolve, reject) => {
				const {
					mutate: schoolUpdate,
					onDone,
					onError,
				} = useMutation(SCHOOL_UPDATE_MUTATION, { fetchPolicy: 'network-only' })
				let clone = Object.assign({}, this.schoolInfo)
				delete clone.id
				delete clone.__typename
				schoolUpdate({
					schoolId: this.schoolInfo.id,
					school: clone,
				})
				onDone((result) => {
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async deleteSchool(schoolId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: schoolDelete,
					onDone,
					onError,
				} = useMutation(SCHOOL_DELETE_MUTATION)
				schoolDelete({ schoolId })
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
// 	import.meta.hot.accept(acceptHMRUpdate(useSchool, import.meta.hot))
// }
