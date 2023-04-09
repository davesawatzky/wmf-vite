import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  useQuery,
  useMutation,
  provideApolloClient,
} from '@vue/apollo-composable'
import apolloClient from '@/utilities/apolloClient'
import TEACHER_INFO_QUERY from '@/graphql/queries/TeacherInfo.query.gql'
import TEACHER_CREATE_MUTATION from '@/graphql/mutations/TeacherCreate.mutation.gql'
import TEACHER_UPDATE_MUTATION from '@/graphql/mutations/TeacherUpdate.mutation.gql'
import TEACHER_DELETE_MUTATION from '@/graphql/mutations/TeacherDelete.mutation.gql'

interface TeacherInfo {
  id?: number
  prefix: string
  last_name: string
  first_name: string
  apartment?: string
  street_number: string
  street_name: string
  city: string
  province: string
  postal_code: string
  phone: string
  email: string
}

provideApolloClient(apolloClient)

export const useTeacher = defineStore(
  'teacher',
  () => {
    // registrationId: '',
    const teacherInfo = ref({
      id: 0,
      prefix: '',
      last_name: '',
      first_name: '',
      apartment: '',
      street_number: '',
      street_name: '',
      city: 'Winnipeg',
      province: 'MB',
      postal_code: '',
      phone: '',
      email: '',
    } as TeacherInfo)

    const fullName = computed(() => {
      return teacherInfo.value.first_name + ' ' + teacherInfo.value.last_name
    })

    function $reset() {
      teacherInfo.value = <TeacherInfo>{
        id: 0,
        prefix: '',
        last_name: '',
        first_name: '',
        apartment: '',
        street_number: '',
        street_name: '',
        city: 'Winnipeg',
        province: 'MB',
        postal_code: '',
        phone: '',
        email: '',
      }
    }

    function addToStore(teacher: TeacherInfo) {
      Object.assign(teacherInfo.value, teacher)
    }

    async function createTeacher(registrationId: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: teacherCreate,
          onDone: doneTeacherCreate,
          onError,
        } = useMutation(TEACHER_CREATE_MUTATION)
        let clone = Object.assign({}, teacherInfo.value)
        delete clone.id
        teacherCreate({
          registrationId,
          teacher: clone,
        })
        doneTeacherCreate((result) => {
          teacherInfo.value.id = result.data.teacherCreate.teacher.id
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function loadTeacher(registrationId: number) {
      return await new Promise((resolve, reject) => {
        const { onError, onResult: resultLoadTeacher } = useQuery(
          TEACHER_INFO_QUERY,
          { registrationId },
          { fetchPolicy: 'network-only' }
        )
        resultLoadTeacher((result) => {
          let clone = Object.assign({}, result.data.registration.teacher)
          delete clone.__typename
          addToStore(clone)
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function updateTeacher() {
      return await new Promise((resolve, reject) => {
        const {
          mutate: teacherUpdate,
          onError,
          onDone,
        } = useMutation(TEACHER_UPDATE_MUTATION, {
          fetchPolicy: 'network-only',
        })
        let clone = Object.assign({}, teacherInfo.value)
        delete clone.id
        teacherUpdate({
          teacherId: teacherInfo.value.id,
          teacher: clone,
        })
        onDone((result) => {
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }

    async function deleteTeacher(teacherId: number) {
      return await new Promise((resolve, reject) => {
        const {
          mutate: teacherDelete,
          onDone,
          onError,
        } = useMutation(TEACHER_DELETE_MUTATION)
        teacherDelete({ teacherId })
        onDone((result) => {
          resolve(result)
        })
        onError((error) => {
          reject(error)
        })
      })
    }
    return {
      teacherInfo,
      $reset,
      deleteTeacher,
      updateTeacher,
      createTeacher,
      loadTeacher,
      addToStore,
      fullName,
    }
  },
  {
    persist: true,
  }
)
