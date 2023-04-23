import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  useQuery,
  useMutation,
  provideApolloClient,
} from '@vue/apollo-composable'
import apolloClient from '@/utilities/apolloClient'
import PERFORMER_CREATE_MUTATION from '@/graphql/mutations/PerformerCreate.mutation.gql'
import PERFORMER_UPDATE_MUTATION from '@/graphql/mutations/PerformerUpdate.mutation.gql'
import PERFORMER_DELETE_MUTATION from '@/graphql/mutations/PerformerDelete.mutation.gql'
import PERFORMER_INFO_QUERY from '@/graphql/queries/PerformerInfo.query.gql'

interface PerformerInfo {
  id?: number
  last_name: string
  first_name: string
  apartment: string
  street_number: string
  street_name: string
  city: string
  province: string
  postal_code: string
  phone: string
  email: string
  age: number
  instrument: string
  level: string
  other_classes: string
}

provideApolloClient(apolloClient)

export const usePerformers = defineStore(
  'performers',
  () => {
    const performer = ref([] as PerformerInfo[])

    const number_of_performers = computed(() => {
      return performer.value.length
    })
    const fullName = computed(() => {
      let name = performer.value.map((item) => {
        return item.first_name + ' ' + item.last_name
      })
      return name
    })

    function $reset() {
      performer.value = <PerformerInfo[]>[]
    }

    function addToStore(performerContactInfo: PerformerInfo | null) {
      performer.value.push({
        id: 0,
        last_name: '',
        first_name: '',
        age: 10,
        apartment: '',
        street_number: '',
        street_name: '',
        city: 'Winnipeg',
        province: 'MB',
        postal_code: '',
        phone: '',
        email: '',
        instrument: '',
        level: '',
        other_classes: '',
      })
      if (performerContactInfo) {
        Object.assign(
          performer.value[performer.value.length - 1],
          performerContactInfo
        )
      }
    }

    async function createPerformer(registrationId: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: performerCreate,
          onDone: donePerformerCreate,
          onError,
        } = useMutation(PERFORMER_CREATE_MUTATION)
        addToStore(null)
        let clone = Object.assign(
          {},
          performer.value[performer.value.length - 1]
        )
        delete clone.id
        performerCreate({
          registrationId,
          performer: clone,
        })
        donePerformerCreate((result) => {
          performer.value[performer.value.length - 1].id =
            result.data.performerCreate.performer.id
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function loadPerformers(registrationId: number) {
      return await new Promise((resolve, reject) => {
        const { onResult: resultLoadPerformers, onError } = useQuery(
          PERFORMER_INFO_QUERY,
          { registrationId },
          { fetchPolicy: 'no-cache' }
        )
        resultLoadPerformers((result) => {
          let clone = structuredClone(result.data.registration.performers)

          for (let i = 0; i < clone.length; i++) {
            delete clone[i].__typename
            addToStore(clone[i])
          }
          resolve(true)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function updatePerformer(
      performerIndex: number,
      performerId: number
    ) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: performerUpdate,
          onDone,
          onError,
        } = useMutation(PERFORMER_UPDATE_MUTATION, {
          fetchPolicy: 'no-cache',
        })
        let clone = Object.assign({}, performer.value[performerIndex])
        delete clone.id
        performerUpdate({ performerId, performer: clone })
        onDone((result) => {
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function updateAllPerformers() {
      let performerIndex = 0
      for (let eachPerformer of performer.value) {
        await updatePerformer(performerIndex, eachPerformer.id!)
        performerIndex++
      }
    }

    async function deletePerformer(performerId: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: performerDelete,
          onDone: donePerformerDelete,
          onError,
        } = useMutation(PERFORMER_DELETE_MUTATION)
        performerDelete({ performerId })
        donePerformerDelete((result) => {
          let index = performer.value.map((e) => e.id).indexOf(performerId)
          performer.value.splice(index, 1)
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }
    return {
      performer,
      $reset,
      number_of_performers,
      fullName,
      addToStore,
      createPerformer,
      updatePerformer,
      loadPerformers,
      updateAllPerformers,
      deletePerformer,
    }
  },
  {
    persist: true,
  }
)
