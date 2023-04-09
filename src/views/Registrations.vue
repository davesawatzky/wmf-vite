<template>
  <div v-auto-animate>
    <h1 class="mt-3 mb-2">Winnipeg Music Festival</h1>
    <h2>Registration Forms</h2>
    <div class="border border-sky-500 rounded-lg text-left mt-10 md:mt-15">
      <div class="p-4">
        <h3 class="pb-3">Registering for the Winnipeg Music Festival</h3>
        <ul class="list-disc pl-5">
          <li>
            Begin registration by creating an account (account can be for an
            individual; a teacher for all their individual students, or for all
            their choirs; a parent for their family etc.)
          </li>
          <li>
            Only one teacher/discipline allowed per form. Performers with
            multiple disciplines and/or teachers require separate forms.
          </li>
          <li>
            Applications can be saved and completed/edited later before
            submission. Once submitted, applications can no longer be edited.
          </li>
          <li>
            You can view submitted entries by clicking on the 'eye' link to the
            left of the table.
          </li>
          <li>A copy can be printed for your records.</li>
        </ul>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4">
        <BaseCard
          :label="soloOpen ? 'Solo' : 'Solo - Closed'"
          :photo="soloOpen ? soloPhoto : soloPhotoBW"
          alt-text="Opera Singer on stage"
          @click="soloOpen ? newRegistration('SOLO') : ''"
        >
        </BaseCard>
        <BaseCard
          :label="groupOpen ? 'Group' : 'Group - Closed'"
          :photo="groupOpen ? groupPhoto : groupPhotoBW"
          alt-text="String Instruments"
          @click="groupOpen ? newRegistration('GROUP') : ''"
        >
        </BaseCard>
        <BaseCard
          :label="schoolOpen ? 'School' : 'School - Closed'"
          :photo="schoolOpen ? schoolPhoto : schoolPhotoBW"
          alt-text="Orff Instruments"
          @click="schoolOpen ? newRegistration('SCHOOL') : ''"
        >
        </BaseCard>
        <BaseCard
          :label="communityOpen ? 'Community' : 'Community - Closed'"
          :photo="communityOpen ? communityPhoto : communityPhotoBW"
          alt-text="Community Choir"
          @click="communityOpen ? newRegistration('COMMUNITY') : ''"
        >
        </BaseCard>
      </div>
    </div>
    <br />
    <h3>Submitted and In-Process Applications</h3>
    <table
      v-auto-animate
      class="bg-white table_auto border-collapse w-full text-xs sm:text-base mt-3"
    >
      <thead class="bg-sky-600 text-white">
        <tr class="py-2 px-2">
          <th class="rounded-tl-lg">View</th>
          <th v-if="sm">ID</th>
          <th>Label</th>
          <th v-if="lg">Created</th>
          <th>Type</th>
          <th v-if="md">Submitted</th>
          <th>Total</th>
          <th>Conf. #</th>
          <th class="rounded-tr-lg">Del</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(registration, index) in registrations"
          :key="index"
          class=""
        >
          <td class="">
            <BaseButton
              class="text-sky-600 text-xl md:ml-4 ml-3"
              @click="
                registration.confirmation ||
                openEditor(registration.performer_type)
                  ? loadRegistration(
                      registration.id,
                      registration.performer_type,
                      index
                    )
                  : ''
              "
              ><font-awesome-icon
                v-if="
                  !registration.confirmation &&
                  openEditor(registration.performer_type)
                "
                icon="fa-solid fa-file-pen" />
              <font-awesome-icon
                v-else-if="
                  !registration.confirmation &&
                  !openEditor(registration.performer_type)
                "
                icon="fa-solid fa-ban" />
              <font-awesome-icon v-else icon="fa-solid fa-eye"
            /></BaseButton>
          </td>
          <td v-if="sm" class="">{{ registration.id }}</td>
          <td class="">{{ registration.label }}</td>
          <td v-if="lg" class="">
            {{ dateFunction(registration.created_at) }}
          </td>
          <td class="">{{ registration.performer_type }}</td>
          <td v-if="md">
            {{ dateFunction(registration.submitted_at) }}
          </td>
          <td>${{ registration.totalAmt }}.00</td>
          <td>{{ registration.confirmation }}</td>
          <td>
            <BaseButton
              v-if="!registration.confirmation"
              class="text-red-600 text-xl md:ml-4 ml-3 my-3"
              @click="deleteRegistration(registration.id)"
              ><font-awesome-icon icon="fa-regular fa-trash-can"
            /></BaseButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts" setup>
import { DateTime } from 'luxon'
import { useMediaQuery } from '@vueuse/core'
import { onBeforeMount, ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import REGISTRATION_QUERY from '@/graphql/queries/Registrations.query.gql'
import { useRouter } from 'vue-router'
import { useRegistration } from '@/stores/userRegistration'
import { useAppStore } from '@/stores/appStore'
import { usePerformers } from '@/stores/userPerformer'
import { useTeacher } from '@/stores/userTeacher'
import { useClasses } from '@/stores/userClasses'
import { useGroup } from '@/stores/userGroup'
import { useSchool } from '@/stores/userSchool'
import { useCommunity } from '@/stores/userCommunity'
import BaseButton from '@/components/base/BaseButton.vue'
import soloPhoto from '@/assets/images/opera-singer-on-stage.png'
import soloPhotoBW from '@/assets/images/opera-singer-on-stage-BW.png'
import groupPhoto from '@/assets/images/strings.png'
import groupPhotoBW from '@/assets/images/strings-BW.png'
import schoolPhoto from '@/assets/images/orff-instruments.png'
import schoolPhotoBW from '@/assets/images/orff-instruments-BW.png'
import communityPhoto from '@/assets/images/community_choir.png'
import communityPhotoBW from '@/assets/images/community_choir-BW.png'
import {
  soloOpen,
  groupOpen,
  schoolOpen,
  communityOpen,
} from '@/composables/openClosed'

enum EnumPerformerType {
  'SOLO',
  'GROUP',
  'SCHOOL',
  'COMMUNITY',
}
type performer_type = keyof typeof EnumPerformerType

interface Registration {
  id: number
  label: string
  performer_type: keyof typeof EnumPerformerType
  submitted_at?: Date
  totalAmt: number
  payedAmt: number
  transactionInfo: string
  confirmation: string
  created_at: Date
  __typename?: string
}

const registrationStore = useRegistration()
const appStore = useAppStore()
const performerStore = usePerformers()
const teacherStore = useTeacher()
const groupStore = useGroup()
const schoolStore = useSchool()
const communityStore = useCommunity()
const classesStore = useClasses()
const registrationId = ref(0)
const registrations = ref({} as Registration[])

const sm = useMediaQuery('(min-width: 640px)')
const md = useMediaQuery('(min-width: 768px)')
const lg = useMediaQuery('(min-width: 1024px)')

function dateFunction(date: Date | undefined) {
  if (date) {
    let dateString = date.toString()
    return DateTime.fromISO(dateString).toLocaleString(DateTime.DATETIME_MED)
  }
}

onBeforeMount(() => {
  registrationStore.$reset()
  appStore.$reset()
  performerStore.$reset()
  teacherStore.$reset()
  groupStore.$reset()
  communityStore.$reset()
  schoolStore.$reset()
  classesStore.$reset()
})

const router = useRouter()

const { refetch: refetchRegistrations, onResult: doneRegistrationQuery } =
  useQuery(REGISTRATION_QUERY, null, () => ({
    fetchPolicy: 'no-cache',
  }))
// const registrations = computed(() => result.value?.registrations ?? [])
doneRegistrationQuery((result) => {
  let clone = Object.assign({}, result.data.registrations)
  registrations.value = clone
})

function openEditor(performer_type: string): boolean {
  return eval(performer_type.toLowerCase() + 'Open')
}

/**
 * Load and Edit Existing Registration
 *
 * @param registrationId The ID of the registration form
 * @param performer_type SOLO, GROUP, SCHOOL, or COMMUNITY
 * @param index Array Index of retrieved registrations
 */
async function loadRegistration(
  registrationId: number,
  performer_type: performer_type,
  index: number
) {
  registrationStore.registrationId = registrationId
  registrationStore.addToStore(registrations.value[index])
  switch (performer_type) {
    case 'SOLO':
      appStore.options.performer_type = 'SOLO'
      appStore.options.dataLoading = true
      await performerStore.loadPerformers(registrationId)
      await teacherStore.loadTeacher(registrationId)
      await classesStore.loadClasses(registrationId)
      appStore.options.dataLoading = false
      break
    case 'GROUP':
      appStore.options.performer_type = 'GROUP'
      appStore.options.dataLoading = true
      await groupStore.loadGroup(registrationId)
      await teacherStore.loadTeacher(registrationId)
      await performerStore.loadPerformers(registrationId)
      await classesStore.loadClasses(registrationId)
      appStore.options.dataLoading = false
      break
    case 'SCHOOL':
      appStore.options.performer_type = 'SCHOOL'
      appStore.options.dataLoading = true
      await schoolStore.loadSchool(registrationId)
      await communityStore.loadCommunities(registrationId)
      await teacherStore.loadTeacher(registrationId)
      await classesStore.loadClasses(registrationId)
      appStore.options.dataLoading = false
      break
    case 'COMMUNITY':
      appStore.options.performer_type = 'COMMUNITY'
      appStore.options.dataLoading = true
      await communityStore.loadCommunities(registrationId)
      await teacherStore.loadTeacher(registrationId)
      await classesStore.loadClasses(registrationId)
      appStore.options.dataLoading = false
      break
  }
  appStore.options.dataLoading = true
  classesStore.loadClasses(registrationId)
  appStore.options.dataLoading = false
  router.push({ name: 'Form' })
}

/**
 * Creates a new registration in the registration form.
 *
 * @param performer_type SOLO, GROUP, SCHOOL or COMMUNITY
 * @param label A given label for the registration form
 */
async function newRegistration(performer_type: performer_type, label?: string) {
  if (!label || label.length == 0) label = 'Registration Form'

  await registrationStore.createRegistration(performer_type, label)
  registrationId.value = registrationStore.registrationId

  appStore.$patch({
    options: {
      editExisting: false,
      performer_type,
      registrationExists: true,
    },
  })
  switch (performer_type) {
    case 'SOLO':
      appStore.options.performer_type = 'SOLO'
      appStore.options.dataLoading = true
      await performerStore.createPerformer(registrationId.value)
      await teacherStore.createTeacher(registrationId.value)
      await classesStore.createClass(registrationId.value)
      appStore.options.dataLoading = false

      break
    case 'GROUP':
      appStore.options.performer_type = 'GROUP'
      appStore.options.dataLoading = true
      await groupStore.createGroup(registrationId.value)
      await teacherStore.createTeacher(registrationId.value)
      await performerStore.createPerformer(registrationId.value)
      await classesStore.createClass(registrationId.value)
      appStore.options.dataLoading = false

      break
    case 'SCHOOL':
      appStore.options.performer_type = 'SCHOOL'
      appStore.options.dataLoading = true
      await schoolStore.createSchool(registrationId.value)
      await communityStore.createCommunity(registrationId.value)
      await teacherStore.createTeacher(registrationId.value)
      await classesStore.createClass(registrationId.value)
      appStore.options.dataLoading = false

      break
    case 'COMMUNITY':
      appStore.options.performer_type = 'COMMUNITY'
      appStore.options.dataLoading = true
      await communityStore.createCommunity(registrationId.value)
      await teacherStore.createTeacher(registrationId.value)
      await classesStore.createClass(registrationId.value)
      appStore.options.dataLoading = false
  }

  router.push({ name: 'Form' })
}

async function deleteRegistration(regId: number) {
  appStore.options.dataLoading = true
  await registrationStore.deleteRegistration(regId)
  refetchRegistrations()
  appStore.options.dataLoading = false
}
</script>

<style scoped>
th {
  @apply py-1 px-4;
}

td {
  @apply px-2 py-1 border-b border-slate-300;
}
</style>
