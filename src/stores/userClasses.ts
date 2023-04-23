import { defineStore } from 'pinia'
import { ref } from 'vue'
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
  id?: number
  class_number: string
  className?: string
  discipline: string
  subdiscipline: string
  level: string
  category: string
  number_of_selections: number
  price: number
  school_groupID: number | null
  __typename?: string
  selections?: Selections[]
}
export interface Selections {
  id?: number
  title: string
  larger_work: string
  movement: string
  composer: string
  duration: string
  __typename?: string
}

provideApolloClient(apolloClient)

export const useClasses = defineStore(
  'registeredClasses',
  () => {
    const registeredClasses = ref([] as RegisteredClass[])
    const MOZART_CLASSES = ['7700', '7701', '7702', '7703', '7704']

    function $reset() {
      registeredClasses.value = <RegisteredClass[]>[]
    }

    /**
     * Add empty class variables to store. Used when requiring a new
     * class entry existing classes
     */
    function addClassToStore(registeredClass: RegisteredClass | null) {
      registeredClasses.value.push({
        id: 0,
        class_number: '',
        className: '',
        discipline: '',
        subdiscipline: '',
        level: '',
        category: '',
        number_of_selections: 0,
        price: 0,
        school_groupID: null,
        selections: [],
      })
      if (registeredClass) {
        Object.assign(
          registeredClasses.value[registeredClasses.value.length - 1],
          registeredClass
        )
      }
    }

    /**
     * Add empty works variables to specific class in store. Used
     * when loading existing works to existing classes
     *
     * @param index Index of specific class in array
     */
    function addSelectionToStore(
      classSelection: Selections | null,
      classIndex: number
    ) {
      registeredClasses.value[classIndex].selections!.push({
        id: 0,
        title: '',
        larger_work: '',
        movement: '',
        composer: '',
        duration: '0:00',
      })
      if (classSelection) {
        Object.assign(
          registeredClasses.value[classIndex].selections![
            registeredClasses.value[classIndex].selections!.length - 1
          ],
          classSelection
        )
      }
    }

    async function createClass(registrationId: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: classCreate,
          onDone: doneClassCreate,
          onError: errorClassCreate,
        } = useMutation(CLASS_CREATE_MUTATION, { fetchPolicy: 'no-cache' })
        addClassToStore(null)
        let classLastIndex = registeredClasses.value.length - 1
        let clone = Object.assign({}, registeredClasses.value[classLastIndex])
        delete clone.id
        delete clone.className
        delete clone.selections
        classCreate({ registrationId, registeredClassInput: clone })
        doneClassCreate((result) => {
          let lastIndex = registeredClasses.value.length - 1
          let returnedId = result.data.registeredClassCreate.registeredClass.id
          registeredClasses.value[lastIndex].id = returnedId
          resolve(result)
        })
        errorClassCreate((error) => {
          reject(error)
        })
      })
    }

    async function loadClasses(registrationId: number) {
      return await new Promise((resolve, reject) => {
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
            createClass(registrationId)
            return
          }
          registeredClasses.value = structuredClone(
            result.data.registration.registeredClasses
          )
          checkForExistingSelections()
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function checkForExistingSelections() {
      let classIndex = 0
      // TODO: must change forEach code.  This is a bug!
      // foreach does not pay attention to async functions
      registeredClasses.value.forEach((item) => {
        if (
          item.selections!.length < 1 ||
          (item.number_of_selections > 0 &&
            item.selections!.length != item.number_of_selections)
        ) {
          if (item.selections!.length < 1) {
            for (let i = 0; i < item.number_of_selections; i++) {
              createSelection(classIndex)
            }
          } else if (
            item.selections!.length > 0 &&
            item.selections!.length < item.number_of_selections
          ) {
            for (
              let i = 1; //item.selections!.length;
              i < 2; //item.number_of_selections;
              i++
            ) {
              createSelection(classIndex)
            }
          } else if (item.selections!.length > item.number_of_selections) {
            for (
              let i = item.selections!.length;
              i > item.number_of_selections;
              i--
            ) {
              deleteSelection(classIndex, i)
            }
          }
        }
        classIndex++
      })
    }

    async function updateClass(classIndex: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: classUpdate,
          onDone,
          onError,
        } = useMutation(CLASS_UPDATE_MUTATION, { fetchPolicy: 'no-cache' })
        let clone = Object.assign({}, registeredClasses.value[classIndex])
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
    }

    async function updateAllClasses() {
      let classIndex = 0
      while (classIndex < registeredClasses.value.length) {
        await updateClass(classIndex)
        if (registeredClasses.value[classIndex].selections![0]) {
          await updateAllSelections(classIndex)
        }
        classIndex += 1
      }
    }

    async function deleteClass(classIndex: number, registeredClassId: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: classDelete,
          onDone: doneClassDelete,
          onError,
        } = useMutation(CLASS_DELETE_MUTATION)
        classDelete({ registeredClassId })
        doneClassDelete((result) => {
          registeredClasses.value.splice(classIndex, 1)
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function createSelection(classIndex: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: selectionCreate,
          onDone: doneSelectionCreate,
          onError: errorSelectionCreate,
        } = useMutation(SELECTION_CREATE_MUTATION, { fetchPolicy: 'no-cache' })
        addSelectionToStore(null, classIndex)
        let classId: number = registeredClasses.value[classIndex].id!
        const selectionsLastIndex =
          registeredClasses.value[classIndex].selections!.length - 1
        const clone = Object.assign(
          {},
          registeredClasses.value[classIndex].selections![selectionsLastIndex]
        )
        delete clone.id
        selectionCreate({ registeredClassId: classId, selection: clone })
        doneSelectionCreate((result) => {
          let lastIndex =
            registeredClasses.value[classIndex].selections!.length - 1
          let returnedId: number = result.data.selectionCreate.selection.id
          registeredClasses.value[classIndex].selections![lastIndex].id =
            returnedId
          resolve(returnedId)
        })
        errorSelectionCreate((error) => {
          reject(error)
        })
      })
    }

    async function updateSelection(
      classIndex: number,
      selectionIndex: number,
      selectionId: number
    ) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: selectionUpdate,
          onDone,
          onError,
        } = useMutation(SELECTION_UPDATE_MUTATION, { fetchPolicy: 'no-cache' })
        let clone = Object.assign(
          {},
          registeredClasses.value[classIndex].selections![selectionIndex]
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
    }

    async function updateAllSelections(classIndex: number) {
      let selectionIndex = 0
      for (let selection of registeredClasses.value[classIndex].selections!) {
        await updateSelection(classIndex, selectionIndex, selection.id!)
        selectionIndex += 1
      }
    }

    async function deleteSelection(classIndex: number, selectionIndex: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: selectionDelete,
          onDone: doneSelectionDelete,
          onError,
        } = useMutation(SELECTION_DELETE_MUTATION)
        let selectionNum =
          registeredClasses.value[classIndex].selections![selectionIndex].id
        selectionDelete({ selectionId: selectionNum })
        doneSelectionDelete((result) => {
          registeredClasses.value[classIndex].selections?.splice(
            selectionIndex,
            1
          )
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }
    return {
      registeredClasses,
      $reset,
      MOZART_CLASSES,
      addClassToStore,
      addSelectionToStore,
      createClass,
      loadClasses,
      updateClass,
      updateAllClasses,
      deleteClass,
      createSelection,
      updateSelection,
      updateAllSelections,
      deleteSelection,
    }
  },
  {
    persist: true,
  }
)
