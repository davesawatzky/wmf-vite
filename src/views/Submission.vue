<template>
  <div>
    <h1 class="my-8">Registration Submission</h1>
    <SummaryTable></SummaryTable>

    <p>
      The Festival reserves the right to redirect entries to a more appropriate
      class. These redirections will be listed in the studio registration
      confirmation mailing sent to teachers.
    </p>
    <p>
      If you have not done so already, please print the summary page for your
      own records. You may return to this site in the future to view the summary
      of your submission. In case of any discrepencies between the information
      in this registration form and the official syllabus, the official syllabus
      will always be considered correct.
    </p>
    <p>
      Once submitted, a confirmation number will be displayed on the screen.
      Please take note of this for your records. This number may be requested
      with any communication regarding your application. No changes will be
      permitted once the entry has been submitted. Incomplete entries will not
      be accepted.
    </p>
    <p>
      Notification, including date, time and location of each class will be
      forwarded to the participant's teacher prior to the publication of the
      program. Teachers are responsible to advise their students of this
      information and to notify the office of any errors. Participants and
      teachers are to notify the Festival office of any change of personal
      information following submission of entry form. Participants who wish to
      withdraw must notify the Festival office in writing as early as possible.
    </p>
    <p>
      Payment may be made by cheque or e-transfer to the Winnipeg Music Festival
      (<a href="mailto:wmf@mts.net"><strong>wmf@mts.net</strong></a
      >). Please include the confirmation number as a memo when submitting
      payment. Entry fees are non-refundable.
    </p>
    <h4 class="pt-6 text-center">
      We look forward to having you participate in the this year's
    </h4>
    <h3 class="pb-6 text-center">Winnipeg Music Festival</h3>
    <div class="text-center">
      <BaseButton
        v-if="!submissionComplete"
        class="btn btn-blue"
        @click="submitRegistration"
        >Submit Application</BaseButton
      >
      <BaseRouteButton
        v-if="!submissionComplete"
        class="btn btn-blue"
        to="Registrations"
        @click="saveRegistration"
        >Cancel</BaseRouteButton
      >
      <div v-if="submissionComplete" class="pb-8">
        <strong>
          <h3 class="mx-auto">Confirmation Number</h3>
          <h3 class="mx-auto">{{ confirmationNumber }}</h3>
          <h4 class="mx-auto">{{ formattedDate }}</h4>
        </strong>
      </div>
      <BaseRouteButton
        v-if="submissionComplete"
        class="btn btn-blue h-14"
        to="Registrations"
        @click="saveRegistration"
        >Return to Registrations</BaseRouteButton
      >
      <BaseButton
        v-if="submissionComplete"
        class="btn btn-blue h-14"
        @click="printWindow"
        >Print this page</BaseButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon'
import { ref } from 'vue'
import { random } from 'lodash'
import { useRegistration } from '@/stores/userRegistration'
import { usePerformers } from '@/stores/userPerformer'
import { useAppStore } from '@/stores/appStore'
import { useTeacher } from '@/stores/userTeacher'
import { useClasses } from '@/stores/userClasses'
import { useGroup } from '@/stores/userGroup'
import { useCommunity } from '@/stores/userCommunity'
import { useSchool } from '@/stores/userSchool'

import SummaryTable from '@/components/summaryblocks/SummaryTable.vue'

const registrationStore = useRegistration()
const performerStore = usePerformers()
const teacherStore = useTeacher()
const classesStore = useClasses()
const groupStore = useGroup()
const appStore = useAppStore()
const communityStore = useCommunity()
const schoolStore = useSchool()

const confirmationNumber = ref('')
const submissionComplete = ref(false)

function printWindow() {
  window.print()
}

let date = new Date()
let formattedDate = DateTime.now().toLocaleString(DateTime.DATETIME_MED)

async function submitRegistration() {
  await saveRegistration()
  confirmationNumber.value =
    'WMF-' + registrationStore.registrationId + '-' + random(1000, 9999)
  registrationStore.registrations[0].submitted_at = date
  registrationStore.registrations[0].confirmation = confirmationNumber.value
  await registrationStore.updateRegistration()
  submissionComplete.value = true
}

async function saveRegistration() {
  switch (appStore.performer_type) {
    case 'SOLO':
      appStore.performer_type = 'SOLO'
      appStore.dataLoading = true
      await registrationStore.updateRegistration()
      await performerStore.updatePerformer(0, performerStore.performer[0].id!)
      await teacherStore.updateTeacher()
      await classesStore.updateAllClasses()
      appStore.dataLoading = false
      break
    case 'GROUP':
      appStore.performer_type = 'GROUP'
      appStore.dataLoading = true
      await registrationStore.updateRegistration()
      await groupStore.updateGroup()
      await teacherStore.updateTeacher()
      await performerStore.updateAllPerformers()
      await classesStore.updateAllClasses()
      appStore.dataLoading = false
      break
    case 'SCHOOL':
      appStore.performer_type = 'SCHOOL'
      appStore.dataLoading = true
      await registrationStore.updateRegistration()
      await schoolStore.updateSchool()
      await communityStore.updateAllCommunities()
      await teacherStore.updateTeacher()
      await classesStore.updateAllClasses()
      appStore.dataLoading = false
      break
    case 'COMMUNITY':
      appStore.performer_type = 'COMMUNITY'
      appStore.dataLoading = true
      await registrationStore.updateRegistration()
      await communityStore.updateCommunity(
        0,
        communityStore.communityInfo[0].id!
      )
      await teacherStore.updateTeacher()
      await classesStore.updateAllClasses()
      appStore.dataLoading = false
      break
  }
}
</script>

<style scoped></style>
