import { defineStore } from 'pinia'
import {
  useQuery,
  useMutation,
  provideApolloClient,
} from '@vue/apollo-composable'
import { ref } from 'vue'
import apolloClient from '@/utilities/apolloClient'
import SCHOOL_INFO_QUERY from '@/graphql/queries/SchoolInfo.query.gql'
import SCHOOL_CREATE_MUTATION from '@/graphql/mutations/SchoolCreate.mutation.gql'
import SCHOOL_UPDATE_MUTATION from '@/graphql/mutations/SchoolUpdate.mutation.gql'
import SCHOOL_DELETE_MUTATION from '@/graphql/mutations/SchoolDelete.mutation.gql'

interface SchoolInfo {
  id?: number
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

export const useSchool = defineStore(
  'school',
  () => {
    const schoolInfo = ref({
      id: undefined,
      name: '',
      division: '',
      street_number: '',
      street_name: '',
      city: 'Winnipeg',
      province: 'MB',
      postal_code: '',
      phone: '',
    } as SchoolInfo)

    function $reset() {
      schoolInfo.value = <SchoolInfo>{
        id: undefined,
        name: '',
        division: '',
        street_number: '',
        street_name: '',
        city: 'Winnipeg',
        province: 'MB',
        postal_code: '',
        phone: '',
      }
    }

    function addToStore(school: SchoolInfo) {
      Object.assign(schoolInfo.value, school)
    }

    async function createSchool(registrationId: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: schoolCreate,
          onDone: doneSchoolCreate,
          onError,
        } = useMutation(SCHOOL_CREATE_MUTATION)
        let clone = Object.assign({}, schoolInfo.value)
        delete clone.id
        console.log('----->clone: ', clone)
        schoolCreate({
          registrationId,
          schoolInput: clone,
        })
        doneSchoolCreate((result) => {
          console.log('----->Result: ', result)
          schoolInfo.value.id = result.data.schoolCreate.school.id
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function loadSchool(registrationId: number) {
      return await new Promise((resolve, reject) => {
        const { onResult: resultLoadSchool, onError } = useQuery(
          SCHOOL_INFO_QUERY,
          { registrationId },
          { fetchPolicy: 'network-only' }
        )
        resultLoadSchool((result) => {
          let clone = Object.assign({}, result.data.registration.school)
          delete clone.__typename
          addToStore(clone)
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function updateSchool() {
      return await new Promise((resolve, reject) => {
        const {
          mutate: schoolUpdate,
          onDone,
          onError,
        } = useMutation(SCHOOL_UPDATE_MUTATION, { fetchPolicy: 'network-only' })
        let clone = Object.assign({}, schoolInfo.value)
        delete clone.id
        delete clone.__typename
        schoolUpdate({
          schoolId: schoolInfo.value.id,
          school: clone,
        })
        onDone((result) => {
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function deleteSchool(schoolId: number) {
      return await new Promise((resolve, reject) => {
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
    }

    return {
      deleteSchool,
      $reset,
      updateSchool,
      loadSchool,
      createSchool,
      schoolInfo,
      addToStore,
    }
  },
  {
    persist: true,
  }
)
