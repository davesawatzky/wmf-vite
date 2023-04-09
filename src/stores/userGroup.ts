import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  useQuery,
  useMutation,
  provideApolloClient,
} from '@vue/apollo-composable'
import apolloClient from '@/utilities/apolloClient'
import GROUP_INFO_QUERY from '@/graphql/queries/GroupInfo.query.gql'
import GROUP_CREATE_MUTATION from '@/graphql/mutations/GroupCreate.mutation.gql'
import GROUP_UPDATE_MUTATION from '@/graphql/mutations/GroupUpdate.mutation.gql'
import GROUP_DELETE_MUTATION from '@/graphql/mutations/GroupDelete.mutation.gql'

interface Group {
  id?: number
  name: string
  groupType: string
  numberOfPerformers: number
  age: number
  instruments: string
}

provideApolloClient(apolloClient)

export const useGroup = defineStore(
  'group',
  () => {
    const groupInfo = ref({
      id: 0,
      name: '',
      groupType: '', //Vocal, Instrumental
      numberOfPerformers: 1,
      age: 10,
      instruments: '',
    } as Group)

    function $reset() {
      groupInfo.value = {
        id: 0,
        name: '',
        groupType: '',
        numberOfPerformers: 1,
        age: 10,
        instruments: '',
      }
    }

    function addToStore(group: Group) {
      Object.assign(groupInfo.value, group)
    }

    async function createGroup(registrationId: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: groupCreate,
          onDone: doneGroupCreate,
          onError,
        } = useMutation(GROUP_CREATE_MUTATION)
        let clone = Object.assign({}, groupInfo.value)
        delete clone.id
        groupCreate({ registrationId, group: clone })
        doneGroupCreate((result) => {
          groupInfo.value.id = result.data.groupCreate.group.id
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function loadGroup(registrationId: number) {
      return await new Promise((resolve, reject) => {
        const { onError, onResult: resultLoadGroup } = useQuery(
          GROUP_INFO_QUERY,
          { registrationId },
          { fetchPolicy: 'no-cache' }
        )
        resultLoadGroup((result) => {
          let clone = Object.assign({}, result.data.registration.groups[0])
          delete clone.__typename
          addToStore(clone)
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function updateGroup() {
      return await new Promise((resolve, reject) => {
        const {
          mutate: groupUpdate,
          onDone,
          onError,
        } = useMutation(GROUP_UPDATE_MUTATION)
        let clone = Object.assign({}, groupInfo.value)
        delete clone.id
        groupUpdate({
          groupId: groupInfo.value.id,
          group: clone,
        })
        onDone((result) => {
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function deleteGroup(groupId: number) {
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
    }
    return {
      groupInfo,
      $reset,
      addToStore,
      createGroup,
      loadGroup,
      updateGroup,
      deleteGroup,
    }
  },
  {
    persist: true,
  }
)
