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

export interface RegisteredClass {
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
export interface Selections {
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
			this.registeredClasses[classIndex].selections!.push({
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
			console.log(
				'Selections Length: ' +
					this.registeredClasses[classIndex].selections?.length
			)
		},

		createClass(registrationId: string) {
			return new Promise((resolve, reject) => {
				const {
					mutate: classCreate,
					onDone: doneClassCreate,
					onError: errorClassCreate,
				} = useMutation(CLASS_CREATE_MUTATION, { fetchPolicy: 'no-cache' })
				this.addClassToStore(null)
				let classLastIndex = this.registeredClasses.length - 1
				let clone = Object.assign({}, this.registeredClasses[classLastIndex])
				delete clone.id
				delete clone.className
				delete clone.selections
				classCreate({ registrationId, registeredClass: clone })
				doneClassCreate((result) => {
					let lastIndex = this.registeredClasses.length - 1
					let returnedId = result.data.registeredClassCreate.registeredClass.id
					this.registeredClasses[lastIndex].id = returnedId
					resolve(result)
				})
				errorClassCreate((error) => {
					reject(error)
				})
			})
		},

		async loadClasses(registrationId: string) {
			return new Promise((resolve, reject) => {
				const { onResult: resultLoadClasses, onError } = useQuery(
					REGISTERED_CLASSES_QUERY,
					{ registrationId },
					{ fetchPolicy: 'no-cache' }
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
					this.checkForExistingSelections()
					resolve(result)
				})
				onError((error) => {
					reject(error)
				})
			})
		},

		async checkForExistingSelections() {
			return new Promise((resolve, reject) => {
				let classIndex = 0
				this.registeredClasses.forEach((item) => {
					if (
						item.numberOfSelections &&
						(!item.selections ||
							item.selections!.length < 1 ||
							(item.numberOfSelections > 0 &&
								item.selections!.length != item.numberOfSelections))
					) {
						if (!item.selections || item.selections!.length < 1) {
							for (let i = 0; i < item.numberOfSelections; i++) {
								this.createSelection(classIndex)
							}
						} else if (
							item.selections!.length > 0 &&
							item.selections!.length < item.numberOfSelections
						) {
							for (
								let i = 1; //item.selections!.length;
								i < 2; //item.numberOfSelections;
								i++
							) {
								this.createSelection(classIndex)
								console.log('This just ran.')
							}
						} else if (item.selections!.length > item.numberOfSelections) {
							for (
								let i = item.selections!.length;
								i > item.numberOfSelections;
								i--
							) {
								this.deleteSelection(classIndex, i)
							}
						}
					}
					classIndex++
				})
			})
		},

		updateClass(classIndex: number) {
			return new Promise((resolve, reject) => {
				const {
					mutate: classUpdate,
					onDone,
					onError,
				} = useMutation(CLASS_UPDATE_MUTATION, { fetchPolicy: 'no-cache' })
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
				classIndex += 1
			}
		},

		deleteClass(classIndex: number, registeredClassId: string) {
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

		createSelection(classIndex: number) {
			return new Promise((resolve, reject) => {
				const {
					mutate: selectionCreate,
					onDone: doneSelectionCreate,
					onError: errorSelectionCreate,
				} = useMutation(SELECTION_CREATE_MUTATION, { fetchPolicy: 'no-cache' })
				this.addSelectionToStore(null, classIndex)
				let classId: string = this.registeredClasses[classIndex].id!
				const selectionsLastIndex =
					this.registeredClasses[classIndex].selections!.length - 1
				const clone = Object.assign(
					{},
					this.registeredClasses[classIndex].selections![selectionsLastIndex]
				)
				delete clone.id
				selectionCreate({ registeredClassId: classId, selection: clone })
				doneSelectionCreate((result) => {
					console.log('Result: ', result)
					let lastIndex =
						this.registeredClasses[classIndex].selections!.length - 1
					console.log('lastIndex: ' + lastIndex)
					let returnedId: string = result.data.selectionCreate.selection.id
					console.log('returnedId: ' + returnedId)
					this.registeredClasses[classIndex].selections![lastIndex].id =
						returnedId
					resolve(returnedId)
				})
				errorSelectionCreate((error) => {
					reject(error)
				})
			})
		},

		updateSelection(
			classIndex: number,
			selectionIndex: number,
			selectionId: string
		) {
			return new Promise((resolve, reject) => {
				const {
					mutate: selectionUpdate,
					onDone,
					onError,
				} = useMutation(SELECTION_UPDATE_MUTATION, { fetchPolicy: 'no-cache' })
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
				selectionIndex += 1
			}
		},

		deleteSelection(classIndex: number, selectionIndex: number) {
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

// if (import.meta.hot) {
// 	import.meta.hot.accept(acceptHMRUpdate(useClasses, import.meta.hot))
// }
