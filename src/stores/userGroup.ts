import { defineStore, acceptHMRUpdate } from 'pinia'
import {
	useQuery,
	useMutation,
	provideApolloClient,
} from '@vue/apollo-composable'
import apolloClient from '@/utilities/apolloClient'
import GROUP_LOAD_QUERY from '@/graphql/queries/GroupLoad.query.gql'
import GROUP_CREATE_MUTATION from '@/graphql/mutations/GroupCreate.mutation.gql'
import GROUP_UPDATE_MUTATION from '@/graphql/mutations/GroupUpdate.mutation.gql'
import GROUP_DELETE_MUTATION from '@/graphql/mutations/GroupDelete.mutation.gql'

interface Group {
	id?: string
	name: string
	groupType: string
	numberOfPerformers: number
	age: number
	instruments: string
}

provideApolloClient(apolloClient)

export const useGroup = defineStore('group', {
	state: () => ({
		groupInfo: {
			id: '',
			name: '',
			groupType: '', //Vocal, Instrumental
			numberOfPerformers: 1,
			age: 10,
			instruments: '',
		} as Group,
	}),
	getters: {},
	actions: {
		addToStore(groupInfo: Group) {
			Object.assign(this.groupInfo, groupInfo)
		},

		async createGroup(registrationId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: groupCreate,
					onDone: doneGroupCreate,
					onError,
				} = useMutation(GROUP_CREATE_MUTATION)
				let clone = Object.assign({}, this.groupInfo)
				delete clone.id
				groupCreate({ registrationId, group: clone })
				doneGroupCreate((result) => {
					this.groupInfo.id = result.data.groupCreate.group.id
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async loadGroup(registrationId: string) {
			return new Promise((resolve, reject) => {
				const { onError, onResult: resultLoadGroup } = useQuery(
					GROUP_LOAD_QUERY,
					{ registrationId },
					{ fetchPolicy: 'no-cache' }
				)
				resultLoadGroup((result) => {
					let clone = Object.assign({}, result.data.registration.groups[0])
					delete clone.__typename
					this.addToStore(clone)
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async updateGroup() {
			return new Promise((resolve, reject) => {
				const {
					mutate: groupUpdate,
					onDone,
					onError,
				} = useMutation(GROUP_UPDATE_MUTATION)
				let clone = Object.assign({}, this.groupInfo)
				delete clone.id
				groupUpdate({
					groupId: this.groupInfo.id,
					group: clone,
				})
				onDone((result) => {
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async deleteGroup(groupId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: groupDelete,
					onDone,
					onError,
				} = useMutation(GROUP_DELETE_MUTATION)
				groupDelete({ groupId })
				onDone((result) => {
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},
	},
})

// if (import.meta.hot) {
// 	import.meta.hot.accept(acceptHMRUpdate(useGroup, import.meta.hot))
// }
