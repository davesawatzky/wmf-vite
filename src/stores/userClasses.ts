import { defineStore, acceptHMRUpdate } from 'pinia'
import {
	useQuery,
	useMutation,
	provideApolloClient,
} from '@vue/apollo-composable'
import apolloClient from '@/utilities/apolloClient'
import REGISTERED_CLASSES_QUERY from '@/graphql/queries/RegisteredClasses.query.gql'
import CLASS_CREATE_MUTATION from '@/graphql/mutations/ClassCreate.mutation.gql'
import CLASS_UPDATE_MUTATION from '@/graphql/mutations/ClassUpdate.mutation.gql'
import CLASS_DELETE_MUTATION from '@/graphql/mutations/ClassDelete.mutation.gql'
import SELECTION_CREATE_MUTATION from '@/graphql/mutations/SelectionCreate.mutation.gql'
import SELECTION_DELETE_MUTATION from '@/graphql/mutations/SelectionDelete.mutation.gql'
import SELECTION_UPDATE_MUTATION from '@/graphql/mutations/SelectionUpdate.mutation.gql'

interface RegisteredClass {
	id?: string
	classNumber: string
	className?: string
	discipline: string
	subdiscipline: string
	level: string
	category: string
	numberOfSelections: number
	price: number
	schoolCommunityId?: number
	__typename?: string
	selections?: [Selections]
}
interface Selections {
	id?: string
	title: string
	largerWork: string
	movement: string
	composer: string
	duration: string
	__typename?: string
}

provideApolloClient(apolloClient)

export const useClasses = defineStore('registeredClasses', {
	state: () => ({
		registeredClasses: [] as RegisteredClass[],
	}),
	getters: {},
	actions: {
		/**
		 * Add empty class variables to store. Used when requiring a new
		 * class entry existing classes
		 */
		addClassToStore(registeredClass: RegisteredClass | null) {
			this.registeredClasses.push(<RegisteredClass>{
				id: '',
				classNumber: '',
				className: '',
				discipline: '',
				subdiscipline: '',
				level: '',
				category: '',
				numberOfSelections: 0,
				price: 0,
				schoolCommunityId: 0,
				selections: [] as Selections[],
			})
			if (registeredClass) {
				Object.assign(
					this.registeredClasses[this.registeredClasses.length - 1],
					registeredClass
				)
			}
		},

		/**
		 * Add empty works variables to specific class in store. Used
		 * when loading existing works to existing classes
		 *
		 * @param index Index of specific class in array
		 */
		addSelectionToStore(classSelection: Selections | null, classIndex: number) {
			this.registeredClasses[classIndex].selections!.push(<Selections>{
				id: '',
				title: '',
				largerWork: '',
				movement: '',
				composer: '',
				duration: '0:00',
			})
			if (classSelection) {
				Object.assign(
					this.registeredClasses[classIndex].selections![
						this.registeredClasses[classIndex].selections!.length - 1
					],
					classSelection
				)
			}
		},

		async createClass(registrationId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: classCreate,
					onDone: doneClassCreate,
					onError,
				} = useMutation(CLASS_CREATE_MUTATION)
				this.addClassToStore(null)
				let classLastIndex = this.registeredClasses.length - 1
				let clone = Object.assign({}, this.registeredClasses[classLastIndex])
				delete clone.id
				delete clone.className
				delete clone.selections

				classCreate({ registrationId, registeredClass: clone })
				doneClassCreate((result) => {
					this.registeredClasses[classLastIndex].id =
						result.data.registeredClassCreate.registeredClass.id
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async loadClasses(registrationId: string) {
			return new Promise((resolve, reject) => {
				const { onResult: resultLoadClasses, onError } = useQuery(
					REGISTERED_CLASSES_QUERY,
					{ registrationId },
					{ fetchPolicy: 'network-only' }
				)
				resultLoadClasses((result) => {
					if (
						!result.data.registration.registeredClasses ||
						result.data.registration.registeredClasses.length === 0
					) {
						this.createClass(registrationId)
						return
					}
					this.registeredClasses = structuredClone(
						result.data.registration.registeredClasses
					)
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async updateClass(classIndex: number) {
			return new Promise((resolve, reject) => {
				const {
					mutate: classUpdate,
					onDone,
					onError,
				} = useMutation(CLASS_UPDATE_MUTATION)
				let clone = Object.assign({}, this.registeredClasses[classIndex])
				let classId = clone.id!
				delete clone.id
				delete clone.className
				delete clone.selections
				delete clone.__typename
				classUpdate({
					registeredClassId: classId,
					registeredClass: clone,
				})
				onDone((result) => {
					resolve(result)
				})
				onError((error) => reject(error))
			})
		},

		async updateAllClasses() {
			let classIndex = 0
			while (classIndex < this.registeredClasses.length) {
				await this.updateClass(classIndex)
				if (this.registeredClasses[classIndex].selections![0]) {
					await this.updateAllSelections(classIndex)
				}
				classIndex++
			}
		},

		async deleteClass(classIndex: number, registeredClassId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: classDelete,
					onDone: doneClassDelete,
					onError,
				} = useMutation(CLASS_DELETE_MUTATION)
				classDelete({ registeredClassId })
				doneClassDelete((result) => {
					this.registeredClasses.splice(classIndex, 1)
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async createSelection(classIndex: number) {
			return new Promise((resolve, reject) => {
				const {
					mutate: selectionCreate,
					onDone: doneSelectionCreate,
					onError,
				} = useMutation(SELECTION_CREATE_MUTATION)
				this.addSelectionToStore(null, classIndex)
				let classId = this.registeredClasses[classIndex].id
				let selectionsLastIndex =
					this.registeredClasses[classIndex].selections!.length - 1
				let clone = Object.assign(
					{},
					this.registeredClasses[classIndex].selections![selectionsLastIndex]
				)
				delete clone.id
				selectionCreate({ registeredClassId: classId, selection: clone })
				doneSelectionCreate((result) => {
					this.registeredClasses[classIndex].selections![
						selectionsLastIndex
					].id = result.data.selectionCreate.selection.id
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async updateSelection(
			classIndex: number,
			selectionIndex: number,
			selectionId: string
		) {
			return new Promise((resolve, reject) => {
				const {
					mutate: selectionUpdate,
					onDone,
					onError,
				} = useMutation(SELECTION_UPDATE_MUTATION)
				let clone = Object.assign(
					{},
					this.registeredClasses[classIndex].selections![selectionIndex]
				)
				delete clone.id
				delete clone.__typename
				selectionUpdate({ selectionId, selection: clone })
				onDone((result) => {
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async updateAllSelections(classIndex: number) {
			let selectionIndex = 0
			for (let selection of this.registeredClasses[classIndex].selections!) {
				await this.updateSelection(classIndex, selectionIndex, selection.id!)
				selectionIndex++
			}
		},

		async deleteSelection(classIndex: number, selectionIndex: number) {
			return new Promise((resolve, reject) => {
				const {
					mutate: selectionDelete,
					onDone: doneSelectionDelete,
					onError,
				} = useMutation(SELECTION_DELETE_MUTATION)
				let selectionNum =
					this.registeredClasses[classIndex].selections![selectionIndex].id
				selectionDelete({ selectionId: selectionNum })
				doneSelectionDelete((result) => {
					this.registeredClasses[classIndex].selections?.splice(
						selectionIndex,
						1
					)
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},
	},
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useClasses, import.meta.hot))
}
