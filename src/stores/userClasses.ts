import { defineStore } from 'pinia'
import { useQuery, useMutation } from '@vue/apollo-composable'
import ADD_CLASS_MUTATION from '@/graphql/mutations/addClass.mutation.gql'
import ADD_WORK_MUTATION from '@/graphql/mutations/addWork.mutation.gql'

interface RegisteredClass {
  id: number
  classNumber: string
  discipline: string
  subdiscipline: string
  level: string
  category: string
  numberOfSelections: number
}
interface Works {
  id: number
  title: string
  largerWork: string
  movement: string
  composer: string
  duration: string
}

export const useClasses = defineStore('registeredClasses', {
  state: () => ({
    registrationID: 0,
    registeredClasses: [
      {
        id: 0,
        classNumber: '',
        discipline: '',
        subdiscipline: '',
        level: '',
        category: '',
        numberOfSelections: 0,
        works: [
          {
            id: 0,
            title: '',
            largerWork: '',
            movement: '',
            composer: '',
            duration: '',
          },
        ],
      },
    ],
  }),
  getters: {},
  actions: {
    /**
     * Adds a class to the current registered Class list
     */
    addClass(registrationID: string, classNumber: string) {
      console.log(registrationID, classNumber)

      const {
        mutate: mutationAddClasses,
        loading,
        error,
        onDone,
      } = useMutation(ADD_CLASS_MUTATION, () => ({
        fetchPolicy: 'no-cache',
        variables: {
          registrationID,
          registeredClass: {
            classNumber, // Only need to include this to create database record
          },
        },
      }))
      mutationAddClasses({ registrationID, registeredClass: { classNumber } })
      onDone((result) => {
        this.registeredClasses.push({
          id: result.data.registeredClassCreate.registeredClass.id,
          // This needs to be returned from the database through the mutation
          classNumber: '',
          discipline: '',
          subdiscipline: '',
          level: '',
          category: '',
          numberOfSelections: 0,
          works: [],
        })
      })

      // await this.addWork(0)
    },

    /**
     * Removes a specific class from the current registration
     * @param classIndex The array index of the specific class
     */
    removeClass(classIndex: number) {
      this.registeredClasses.splice(classIndex, 1)
    },
    loadClasses() {},

    /**
     * Saves All class information for a registration
     *
     * @param registrationID The registration ID
     * @param registeredClass The new Class information
     * @param works The works of the new class
     */
    saveClasses(registrationID: number) {
      const {
        mutate: mutationSaveClasses,
        loading,
        error,
        onDone,
      } = useMutation(ADD_CLASS_MUTATION, () => ({
        fetchPolicy: 'no-cache',
        variables: {
          registrationID,
          registeredClass: {
            classNumber: this.registeredClasses.classNumber,
          },
        },
      }))
    },

    /**
     * Add a music work to a class
     * @param registrationClassID The ID index of the specific registered class
     */
    addWork(registrationClassID: number) {
      const {
        mutate: mutationAddWork,
        loading,
        error,
        onDone,
      } = useMutation(ADD_WORK_MUTATION, () => ({
        fetchPolicy: 'no-cache',
        variables: {
          registrationClassID,
          work: {
            title: '', // Only need to include this to create the database record
          },
        },
      }))
      this.registeredClasses[registrationClassID].works.push({
        id: 0, // Needs to be returned from the database
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
     * @param workIndex The array index of the specific work
     */
    removeWork(classIndex: number, Index: number) {
      this.registeredClasses[classIndex].works.splice(workIndex, 1)
    },
  },
})
