<template>
  <div v-auto-animate>
    <h1 class="pt-8">Registration Summary</h1>

    <!-- Community Groups-->
    <div v-if="appStore.performer_type === 'COMMUNITY'">
      <h2 class="pt-8 pb-4">Community Group Information</h2>

      <div>
        Community Group Name: {{ communityStore.communityInfo[0].name }}
      </div>
      <div>
        Community Group Size: {{ communityStore.communityInfo[0].group_size }}
      </div>
      <div v-if="communityStore.communityInfo[0].chaperones">
        Number of Chaperones: {{ communityStore.communityInfo[0].chaperones }}
      </div>
      <div v-if="communityStore.communityInfo[0].wheelchairs">
        Number of Wheelchairs: {{ communityStore.communityInfo[0].wheelchairs }}
      </div>
      <div v-if="communityStore.communityInfo[0].conflict_performers">
        Performers participating in other classes
        {{ communityStore.communityInfo[0].conflict_performers }}
      </div>
    </div>

    <!-- School Groups -->
    <div v-if="appStore.performer_type === 'SCHOOL'">
      <h2 class="pt-8 pb-4">School Information</h2>
      <div>School Name: {{ schoolStore.schoolInfo.name }}</div>
      <div>School Division: {{ schoolStore.schoolInfo.division }}</div>
      <div>Address:</div>
      {{ schoolStore.schoolInfo.street_number }}
      {{ schoolStore.schoolInfo.street_name }}
      <div>
        {{ schoolStore.schoolInfo.city }}, {{ schoolStore.schoolInfo.province }}
      </div>
      <div>{{ schoolStore.schoolInfo.postal_code }}</div>
      <div>Phone: {{ schoolStore.schoolInfo.phone }}</div>
      <h3 class="pt-6 pb-2">School Group(s)</h3>
      <div
        v-for="(group, index) in communityStore.communityInfo"
        :key="group.id"
      >
        <h4>Group {{ index + 1 }}:</h4>
        <div>Name: {{ group.name }}</div>
        <div>Size: {{ group.group_size }}</div>
        <div v-if="group.chaperones">Chaperones: {{ group.chaperones }}</div>
        <div v-if="group.wheelchairs">Wheelchairs: {{ group.wheelchairs }}</div>
        <div v-if="group.earliest_time">
          Earliest Time: {{ group.earliest_time }}
        </div>
        <div v-if="group.latest_time">Latest Time: {{ group.latest_time }}</div>
        <div v-if="group.unavailable">
          Unavailable Times: {{ group.unavailable }}
        </div>
        <div v-if="group.conflict_performers">
          Multiple Class Participants: {{ group.conflict_performers }}
        </div>
      </div>
    </div>

    <!-- Registered Classes -->
    <h2 class="pt-8 pb-4">Registered Classes</h2>
    <div
      v-for="registeredClass in classesStore.registeredClasses"
      :key="registeredClass.id"
    >
      <h4 class="py-2">
        Festival Class Number: {{ registeredClass.class_number }}
      </h4>
      <h5 v-if="appStore.performer_type === 'SCHOOL'">
        {{ schoolClassGroup(registeredClass.school_groupID!)?.name }}
      </h5>
      <div>Festival Class: {{ registeredClass.className }}</div>
      <div>
        Number of Selections: {{ registeredClass.number_of_selections }}
      </div>
      <div
        v-for="(selection, index) in registeredClass.selections"
        :key="selection.id"
        class="ml-8"
      >
        <h5 class="py-2">Selection {{ index + 1 }}</h5>
        <div>Title: {{ selection.title }}</div>
        <div>Composer: {{ selection.composer }}</div>
        <div v-if="selection.larger_work">
          from Work: {{ selection.larger_work }}
        </div>
        <div v-if="selection.movement">Movement: {{ selection.movement }}</div>
        <div>Duration: {{ selection.duration }}</div>
      </div>
    </div>

    <!-- Solo and Group Performers -->
    <div v-if="appStore.performer_type === 'GROUP'">
      <h2 class="pt-8 pb-4">Group Information</h2>
      <div>Name: {{ groupStore.groupInfo.name }}</div>
      <div>Type of Group: {{ groupStore.groupInfo.group_type }}</div>
      <div>
        Number of Performers: {{ groupStore.groupInfo.number_of_performers }}
      </div>
      <div>Age of the Group: {{ groupStore.groupInfo.age }}</div>
    </div>
    <div
      v-if="
        appStore.performer_type === 'GROUP' ||
        appStore.performer_type === 'SOLO'
      "
    >
      <h2 class="pt-8 pb-4">Performer(s)</h2>
      <div
        v-for="(performer, index) in performerStore.performer"
        :key="performer.id"
      >
        <SummaryContactInfo
          :contact="performer"
          :full-name="performerStore.fullName[index]"
        />
      </div>
    </div>

    <!-- Teacher -->
    <div>
      <h2 class="pt-8 pb-4">Teacher</h2>
      <SummaryContactInfo
        :contact="teacherStore.teacherInfo"
        :full-name="teacherStore.fullName"
      />
    </div>
    <h3 class="pt-8 pb-4">Class Summary</h3>
    <SummaryTable />
  </div>
  <BaseButton
    v-if="!registrationStore.registrations[0].confirmation"
    class="btn btn-blue"
    @click="prepareRegistration"
    >Prepare to Submit</BaseButton
  >
  <BaseButton class="btn btn-blue" @click="printWindow"
    >Print this page</BaseButton
  >
</template>

<script setup lang="ts">
import { usePerformers } from '@/stores/userPerformer'
import { useTeacher } from '@/stores/userTeacher'
import { useGroup } from '@/stores/userGroup'
import { useSchool } from '@/stores/userSchool'
import { useCommunity } from '@/stores/userCommunity'
import { useClasses } from '@/stores/userClasses'
import { useRegistration } from '@/stores/userRegistration'
import { useAppStore } from '@/stores/appStore'
import { useForm } from 'vee-validate'
import router from '@/router'

const performerStore = usePerformers()
const teacherStore = useTeacher()
const groupStore = useGroup()
const schoolStore = useSchool()
const communityStore = useCommunity()
const classesStore = useClasses()
const appStore = useAppStore()
const registrationStore = useRegistration()

const schoolClassGroup = (id: number) => {
  return communityStore.communityInfo.find((item) => item.id === String(id))
}

// async function prepareRegistration() {
// 	await saveRegistration()
// 	router.push('Submission')
// }

// Trying to get validations to work
const { handleSubmit } = useForm()

function onInvalidSubmit({ values, errors, results }: any) {
  console.log(values)
  console.log(errors)
  console.log(results)
}

const prepareRegistration = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2))
  router.push('Submission')
}, onInvalidSubmit)

function printWindow() {
  window.print()
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
