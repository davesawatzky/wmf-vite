import { defineStore } from 'pinia'
import { ref } from 'vue'

enum EnumPerformerType {
  'SOLO',
  'GROUP',
  'SCHOOL',
  'COMMUNITY',
}
interface AppFlags {
  editExisting: boolean
  performer_type: keyof typeof EnumPerformerType
  registrationExists: boolean
  performerContactLoaded: boolean
  groupInfoLoaded: boolean
  schoolInfoLoaded: boolean
  communityInfoLoaded: boolean
  teacherInfoLoaded: boolean
  classExists: boolean
  selectionExists: boolean
  classContentLoaded: boolean
  dataLoading: boolean
}

export const useAppStore = defineStore(
  'appStore',
  () => {
    const options = ref({
      editExisting: false, // edits an existing registration from the db
      performer_type: 'SOLO', // default performer_type - just in case.
      registrationExists: false, // registration exists in the db
      performerContactLoaded: false, // performer contact already exists and is loaded
      groupInfoLoaded: false,
      schoolInfoLoaded: false,
      communityInfoLoaded: false,
      teacherInfoLoaded: false, // teacher contact already exists and is loaded
      classExists: false, // registered class is fully loaded into class form
      selectionExists: false, // registered selection is fully loaded into class form
      classContentLoaded: false, // Existing class content is loaded from db
      dataLoading: false,
    } as AppFlags)

    function $reset() {
      options.value.editExisting = false
      options.value.performer_type = 'SOLO'
      options.value.registrationExists = false
      options.value.performerContactLoaded = false
      options.value.groupInfoLoaded = false
      options.value.schoolInfoLoaded = false
      options.value.communityInfoLoaded = false
      options.value.teacherInfoLoaded = false
      options.value.classExists = false
      options.value.selectionExists = false
      options.value.classContentLoaded = false
      options.value.dataLoading = false
    }

    return { options, $reset }
  },
  {
    persist: true,
  }
)
