import { defineStore } from 'pinia'
import { ref } from 'vue'
import { provideApolloClient, useMutation } from '@vue/apollo-composable'
import apolloClient from '@/utilities/apolloClient'
import REGISTRATION_CREATE_MUTATION from '@/graphql/mutations/RegistrationCreate.mutation.gql'
import REGISTRATION_DELETE_MUTATION from '@/graphql/mutations/RegistrationDelete.mutation.gql'
import REGISTRATION_UPDATE_MUTATION from '@/graphql/mutations/RegistrationUpdate.mutation.gql'

/**
 * Items get added to the Registration store when they're
 * chosen from the Registration display, not before.
 * The application only works on individual forms, therefore
 * only one registration should be in the store at any one time.
 */

enum EnumPerformerType {
  'SOLO',
  'GROUP',
  'SCHOOL',
  'COMMUNITY',
}
interface Registration {
  id?: number
  label: string
  performer_type: keyof typeof EnumPerformerType
  submitted_at?: Date
  totalAmt: number
  payedAmt: number
  transactionInfo: string
  confirmation: string
  created_at?: Date
  __typename?: string
}

provideApolloClient(apolloClient)

export const useRegistration = defineStore(
  'registrations',
  () => {
    const registrationId = ref(0)
    const registrations = ref([] as Registration[])

    function $reset() {
      registrationId.value = 0
      registrations.value = <Registration[]>[]
    }

    function addToStore(data: Registration) {
      if (registrations.value.length > 0) {
        registrations.value.splice(0, 1, data)
      } else {
        registrations.value.push(data)
      }
    }

    async function createRegistration(
      performer_type: Registration['performer_type'],
      label: string
    ) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: registrationCreate,
          onDone: doneNewReg,
          onError,
        } = useMutation(REGISTRATION_CREATE_MUTATION)
        registrationCreate({ performer_type, label })
        doneNewReg((result) => {
          addToStore(result.data.registrationCreate.registration)
          registrationId.value = result.data.registrationCreate.registration.id
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function updateRegistration() {
      return await new Promise((resolve, reject) => {
        const {
          mutate: registrationUpdate,
          onDone,
          onError,
        } = useMutation(REGISTRATION_UPDATE_MUTATION, {
          fetchPolicy: 'network-only',
        })
        let clone = Object.assign({}, registrations.value[0])
        delete clone.id
        delete clone.__typename
        delete clone.created_at
        registrationUpdate({
          registrationId: registrationId.value,
          registration: clone,
        })
        onDone((result) => {
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function deleteRegistration(registrationId: number) {
      const { mutate: registrationDelete } = useMutation(
        REGISTRATION_DELETE_MUTATION
      )
      await registrationDelete({ registrationDeleteId: registrationId })
    }
    return {
      registrationId,
      registrations,
      $reset,
      addToStore,
      createRegistration,
      updateRegistration,
      deleteRegistration,
    }
  },
  {
    persist: true,
  }
)
