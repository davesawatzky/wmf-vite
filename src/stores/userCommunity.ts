import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  useQuery,
  useMutation,
  provideApolloClient,
} from '@vue/apollo-composable'
import apolloClient from '@/utilities/apolloClient'
import COMMUNITY_INFO_QUERY from '@/graphql/queries/CommunityInfo.query.gql'
import COMMUNITY_CREATE_MUTATION from '@/graphql/mutations/CommunityCreate.mutation.gql'
import COMMUNITY_UPDATE_MUTATION from '@/graphql/mutations/CommunityUpdate.mutation.gql'
import COMMUNITY_DELETE_MUTATION from '@/graphql/mutations/CommunityDelete.mutation.gql'

interface CommunityInfo {
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

export const useCommunity = defineStore(
  'community',
  () => {
    const communityInfo = ref({} as CommunityInfo[])

    function $reset() {
      communityInfo.value = <CommunityInfo[]>{}
    }

    function addToStore(communityData: CommunityInfo | null) {
      communityInfo.value.push({
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

      if (communityData) {
        Object.assign(
          communityInfo.value[communityInfo.value.length - 1],
          communityData
        )
      }
    }

    async function createCommunity(registrationId: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: communityCreate,
          onDone: doneCommunityCreate,
          onError,
        } = useMutation(COMMUNITY_CREATE_MUTATION, { fetchPolicy: 'no-cache' })
        addToStore(null)
        let clone = Object.assign(
          {},
          communityInfo.value[communityInfo.value.length - 1]
        )
        delete clone.id
        communityCreate({
          registrationId,
          community: clone,
        })
        doneCommunityCreate((result) => {
          communityInfo.value[communityInfo.value.length - 1].id =
            result.data.communityCreate.community.id
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function loadCommunities(registrationId: number) {
      return await new Promise((resolve, reject) => {
        const { onResult: resultLoadCommunity, onError } = useQuery(
          COMMUNITY_INFO_QUERY,
          { registrationId },
          { fetchPolicy: 'no-cache' }
        )
        resultLoadCommunity((result) => {
          let clone = structuredClone(result.data.registration.communities)
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

    async function updateCommunity(
      communityIndex: number,
      communityId: number
    ) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: communityUpdate,
          onDone,
          onError,
        } = useMutation(COMMUNITY_UPDATE_MUTATION, {
          fetchPolicy: 'no-cache',
        })
        let clone = Object.assign({}, communityInfo.value[communityIndex])
        delete clone.id
        delete clone.__typename
        communityUpdate({
          communityId,
          community: clone,
        })
        onDone((result) => {
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function updateAllCommunities() {
      let communityIndex = 0
      for (let eachCommunity of communityInfo.value) {
        await updateCommunity(communityIndex, eachCommunity.id!)
        communityIndex++
      }
    }

    async function deleteCommunity(communityId: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: communityDelete,
          onDone: doneCommunityDelete,
          onError,
        } = useMutation(COMMUNITY_DELETE_MUTATION)
        communityDelete({ communityId })
        doneCommunityDelete((result) => {
          let index = communityInfo.value.map((e) => e.id).indexOf(communityId)
          communityInfo.value.splice(index, 1)
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }
    return {
      $reset,
      deleteCommunity,
      updateCommunity,
      communityInfo,
      updateAllCommunities,
      addToStore,
      createCommunity,
      loadCommunities,
    }
  },
  {
    persist: true,
  }
)
