import { defineStore } from 'pinia'
import { useQuery, useMutation } from '@vue/apollo-composable'
import ADD_CLASS_MUTATION from '@/graphql/mutations/addClass.mutation.gql'
import ADD_WORK_MUTATION from '@/graphql/mutations/addWork.mutation.gql'

interface RegisteredClass {
	id: string
	classNumber: string
	discipline: string
	disciplineId: string
	subdiscipline: string
	subdisciplineId: string
	level: string
	levelId: string
	category: string
	categoryId: string
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

export const useClasses = defineStore('registeredClasses', {
	state: () => ({
		registrationId: '',
		registeredClasses: [
			{
				id: '',
				classNumber: '',
				discipline: '',
				disciplineId: '',
				subdiscipline: '',
				subdisciplineId: '',
				level: '',
				levelId: '',
				category: '',
				categoryId: '',
				numberOfSelections: 0,
				selections: [
					{
						id: '',
						title: '',
						largerWork: '',
						movement: '',
						composer: '',
						duration: '',
					},
				],
			},
		] as RegisteredClass[],
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
				discipline: '',
				disciplineId: '',
				subdiscipline: '',
				subdisciplineId: '',
				level: '',
				levelId: '',
				category: '',
				categoryId: '',
				numberOfSelections: 0,
				selections: [
					{
						id: '',
						title: '',
						largerWork: '',
						movement: '',
						composer: '',
						duration: '',
					},
				] as Selections[],
			})
		},
		/**
		 * Add empty works variables to specific class in store. Used
		 * when loading existing works to existing classes
		 *
		 * @param index Index of specific class in array
		 */
		addSelectionToStore(index: number) {
			if ('selections' in this.registeredClasses[index]) {
				this.registeredClasses[index].selections.push(<Selections>{
					id: '',
					title: '',
					largerWork: '',
					movement: '',
					composer: '',
					duration: '',
				})
			}
		},

		/**
		 * Creates a new class to the current registered Class list and saves
		 * it to the database
		 *
		 * @param registrationID The Id of the current registration
		 * @param classNumber The current class number
		 */
		createClass(registrationID: string, classNumber: string) {
			console.log(registrationID, classNumber)

			const { mutate: mutationAddClasses, onDone } = useMutation(
				ADD_CLASS_MUTATION,
				() => ({
					fetchPolicy: 'no-cache',
					variables: {
						registrationID,
						registeredClass: {
							classNumber, // Only need to include this to create database record
						},
					},
				})
			)

			mutationAddClasses({ registrationID, registeredClass: { classNumber } })
			onDone((result) => {
				this.registeredClasses.push({
					// This needs to be returned from the database through the mutation
					// so that we have the right id number.
					id: result.data.registeredClassCreate.registeredClass.id,
					classNumber: '',
					discipline: '',
					disciplineId: '',
					subdiscipline: '',
					subdisciplineId: '',
					level: '',
					levelId: '',
					category: '',
					categoryId: '',
					numberOfSelections: 1,
					selections: [
						{
							id: '',
							title: '',
							largerWork: '',
							movement: '',
							composer: '',
							duration: '',
						},
					],
				})
			})

			// await this.addWork(0)
		},

		/**
		 * Removes a specific class from the database in the current registration
		 *
		 * @param index The array index of the specific registered class
		 */
		removeClass(index: number) {
			this.registeredClasses.splice(index, 1)
		},

		/**
		 * Loads existing classes.
		 */
		loadClasses() {},

		/**
		 * Saves All class information for a registration
		 *
		 * @param registrationID The registration ID
		 * @param registeredClass The new Class information
		 * @param works The works of the new class
		 */
		saveClasses(registrationID: number) {
			const { mutate: mutationSaveClasses, onDone } = useMutation(
				ADD_CLASS_MUTATION,
				() => ({
					variables: {
						registrationID,
						registeredClass: {
							...this.registeredClasses,
						},
					},
				})
			)
		},

		/**
		 * Add a music work to a class
		 * @param registrationClassID The ID index of the specific registered class
		 */
		addSelection(registrationClassID: number) {
			const {
				mutate: mutationAddWork,
				loading,
				error,
				onDone,
			} = useMutation(ADD_WORK_MUTATION, () => ({
				fetchPolicy: 'no-cache',
				variables: {
					registrationClassID,
					selections: {
						title: '', // Only need to include this to create the database record
					},
				},
			}))
			this.registeredClasses[registrationClassID].selections.push(<Selections>{
				id: '', // Needs to be returned from the database
				title: '',
				largerWork: '',
				movement: '',
				composer: '',
				duration: '',
			})
		},

		/**
		 * Removes a musical work from a specific class
		 * @param classIndex The array index of the specific class
		 * @param selectionIndex The array index of the specific work
		 */
		removeSelection(classIndex: number, selectionIndex: number) {
			this.registeredClasses[classIndex].selections.splice(selectionIndex, 1)
		},
	},
})
