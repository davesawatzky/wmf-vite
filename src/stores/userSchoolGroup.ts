import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  useQuery,
  useMutation,
  provideApolloClient,
} from '@vue/apollo-composable'
import apolloClient from '@/utilities/apolloClient'
import SCHOOLGROUP_INFO_QUERY from '@/graphql/queries/SchoolGroupInfo.query.gql'
import SCHOOLGROUP_CREATE_MUTATION from '@/graphql/mutations/SchoolGroupCreate.mutation.gql'
import SCHOOLGROUP_UPDATE_MUTATION from '@/graphql/mutations/SchoolGroupUpdate.mutation.gql'
import SCHOOLGROUP_DELETE_MUTATION from '@/graphql/mutations/SchoolGroupDelete.mutation.gql'

interface SchoolGroupInfo {
  id?: number
  name: string
  group_size: number
  chaperones: number
  wheelchairs: number
  earliest_time: string
  latest_time: string
  unavailable: string
  conflict_performers: string
  __typename?: string
}

provideApolloClient(apolloClient)

export const useSchoolGroup = defineStore(
  'schoolGroup',
  () => {
    const schoolGroupInfo = ref([] as SchoolGroupInfo[])

    function $reset() {
      schoolGroupInfo.value = <SchoolGroupInfo[]>[]
    }

    function addToStore(schoolGroupData: SchoolGroupInfo | null) {
      schoolGroupInfo.value.push({
        id: 0,
        name: '',
        group_size: 10,
        chaperones: 0,
        wheelchairs: 0,
        earliest_time: '',
        latest_time: '',
        unavailable: '',
        conflict_performers: '',
      })

      if (schoolGroupData) {
        Object.assign(
          schoolGroupInfo.value[schoolGroupInfo.value.length - 1],
          schoolGroupData
        )
      }
    }

    async function createSchoolGroup(schoolId: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: schoolGroupCreate,
          onDone: doneSchoolGroupCreate,
          onError,
        } = useMutation(SCHOOLGROUP_CREATE_MUTATION, {
          fetchPolicy: 'no-cache',
        })
        addToStore(null)
        let clone = Object.assign(
          {},
          schoolGroupInfo.value[schoolGroupInfo.value.length - 1]
        )
        delete clone.id
        schoolGroupCreate({
          schoolId,
          schoolGroup: clone,
        })
        doneSchoolGroupCreate((result) => {
          schoolGroupInfo.value[schoolGroupInfo.value.length - 1].id =
            result.data.registration.school.school_group.id
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function loadSchoolGroups(registrationId: number) {
      return await new Promise((resolve, reject) => {
        const { onResult: resultLoadSchoolGroup, onError } = useQuery(
          SCHOOLGROUP_INFO_QUERY,
          { registrationId },
          { fetchPolicy: 'no-cache' }
        )
        resultLoadSchoolGroup((result) => {
          let clone = structuredClone(
            result.data.registration.school.school_group.id
          )
          for (let i = 0; i < clone.length; i++) {
            delete clone.__typename
            addToStore(clone[i])
          }
          resolve(true)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function updateSchoolGroup(
      schoolGroupIndex: number,
      schoolGroupId: number
    ) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: schoolGroupUpdate,
          onDone,
          onError,
        } = useMutation(SCHOOLGROUP_UPDATE_MUTATION, {
          fetchPolicy: 'no-cache',
        })
        let clone = Object.assign({}, schoolGroupInfo.value[schoolGroupIndex])
        delete clone.id
        delete clone.__typename
        schoolGroupUpdate({
          schoolGroupId,
          schoolGroup: clone,
        })
        onDone((result) => {
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function updateAllSchoolGroups() {
      let schoolGroupIndex = 0
      for (let eachSchoolGroup of schoolGroupInfo.value) {
        await updateSchoolGroup(schoolGroupIndex, eachSchoolGroup.id!)
        schoolGroupIndex++
      }
    }

    async function deleteSchoolGroup(schoolGroupId: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: schoolGroupDelete,
          onDone: doneSchoolGroupDelete,
          onError,
        } = useMutation(SCHOOLGROUP_DELETE_MUTATION)
        schoolGroupDelete({ schoolGroupId })
        doneSchoolGroupDelete((result) => {
          let index = schoolGroupInfo.value
            .map((e) => e.id)
            .indexOf(schoolGroupId)
          schoolGroupInfo.value.splice(index, 1)
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }
    return {
      $reset,
      deleteSchoolGroup,
      updateSchoolGroup,
      schoolGroupInfo,
      updateAllSchoolGroups,
      addToStore,
      createSchoolGroup,
      loadSchoolGroups,
    }
  },
  {
    persist: true,
  }
)
