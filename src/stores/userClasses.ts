import { defineStore, acceptHMRUpdate } from 'pinia'
import {
	useQuery,
	useMutation,
	provideApolloClient,
} from '@vue/apollo-composable'
import apolloClient from '@/utilities/apolloClient'
import ADD_CLASS_MUTATION from '@/graphql/mutations/addClass.mutation.gql'
import ADD_WORK_MUTATION from '@/graphql/mutations/addWork.mutation.gql'

interface RegisteredClass {
	id: string
	classNumber: string
	className: string
	discipline: string
	subdiscipline: string
	level: string
	category: string
	numberOfSelections: number
	selections: [Selections]
}
interface Selections {
	id: string
	title: string
	largerWork: string
	movement: string
	composer: string
	duration: string
}

provideApolloClient(apolloClient)

export const useClasses = defineStore('registeredClasses', {
	state: () => ({
		registrationId: '',
		registeredClasses: [] as RegisteredClass[],
	}),
	getters: {},
	actions: {
		/**
		 * Add empty class variables to store. Used when loading
		 * existing classes
		 */
		addClassToStore() {
			this.registeredClasses.push(<RegisteredClass>{
				id: '',
				classNumber: '',
				className: '',
				discipline: '',
				subdiscipline: '',
				level: '',
				category: '',
				numberOfSelections: 0,
				selections: [] as Selections[],
			})
		},

		/**
		 * Removes a specific class from the database in the current registration
		 *
		 * @param index The array index of the specific registered class
		 */
		removeClassFromStore(classIndex: number) {
			this.registeredClasses.splice(classIndex, 1)
		},

		/**
		 * Add empty works variables to specific class in store. Used
		 * when loading existing works to existing classes
		 *
		 * @param index Index of specific class in array
		 */
		addSelection(classIndex: number) {
			this.registeredClasses[classIndex].selections.push({
				id: '',
				title: '',
				largerWork: '',
				movement: '',
				composer: '',
				duration: '',
			} as Selections)
		},

		/**
		 * Removes a musical work from a specific class
		 * @param classIndex The array index of the specific class
		 * @param selectionIndex The array index of the specific work
		 */
		removeSelection(classIndex: number, selectionIndex: number) {
			this.registeredClasses[classIndex].selections.splice(selectionIndex, 1)
		},

		removeSelections(classIndex: number, remainingSelections: number) {
			this.registeredClasses[classIndex].selections.splice(remainingSelections)
		},

		/**
		 * Saves All class information for a registration
		 *
		 * @param registrationID The registration ID
		 * @param registeredClass The new Class information
		 * @param works The works of the new class
		 */
		saveClasses(registrationID: number) {
			// const { mutate: mutationSaveClasses, onDone } = useMutation(
			// 	ADD_CLASS_MUTATION,
			// 	() => ({
			// 		variables: {
			// 			registrationID,
			// 			registeredClass: {
			// 				...this.registeredClasses,
			// 			},
			// 		},
			// 	})
			// )
			// const {
			// 	mutate: mutationAddWork,
			// 	loading,
			// 	error,
			// 	onDone,
			// } = useMutation(ADD_WORK_MUTATION, () => ({
			// 	fetchPolicy: 'no-cache',
			// 	variables: {
			// 		registrationClassId,
			// 		selections: {
			// 			title: '', // Only need to include this to create the database record
			// 		},
			// 	},
			// }))
		},
	},
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useClasses, import.meta.hot))
}

// const { mutate: mutationAddClasses, onDone } = useMutation(
// 	ADD_CLASS_MUTATION,
// 	() => ({
// 		fetchPolicy: 'no-cache',
// 		variables: {
// 			registrationID,
// 			registeredClass: {
// 				classNumber, // Only need to include this to create database record
// 			},
// 		},
// 	})
// )

// mutationAddClasses({ registrationID, registeredClass: { classNumber } })
// onDone((result) => {
// 	this.registeredClasses.push({
// 		// This needs to be returned from the database through the mutation
// 		// so that we have the right id number.
// 		id: result.data.registeredClassCreate.registeredClass.id,
// 		classNumber: '',
// 		discipline: '',
// 		disciplineId: '',
// 		subdiscipline: '',
// 		subdisciplineId: '',
// 		level: '',
// 		levelId: '',
// 		category: '',
// 		categoryId: '',
// 		numberOfSelections: 1,
// 		selections: [
// 			{
// 				id: '',
// 				title: '',
// 				largerWork: '',
// 				movement: '',
// 				composer: '',
// 				duration: '',
// 			},
// 		],
// 	})
// })
