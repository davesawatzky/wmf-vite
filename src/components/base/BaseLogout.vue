<template>
  <div>
    <a class="hover:cursor-pointer" @click="signout">Logout</a>
  </div>
</template>

<script setup lang="ts">
import { removeToken } from '@/composables/setTokens'
import { useAppStore } from '@/stores/appStore'
import { useRegistration } from '@/stores/userRegistration'
import { usePerformers } from '@/stores/userPerformer'
import { useTeacher } from '@/stores/userTeacher'
import { useClasses } from '@/stores/userClasses'
import { useGroup } from '@/stores/userGroup'
import { useSchool } from '@/stores/userSchool'
import router from '@/router'

const appStore = useAppStore()
const registratinStore = useRegistration()
const performerStore = usePerformers()
const teacherStore = useTeacher()
const classStore = useClasses()
const groupStore = useGroup()
const schoolStore = useSchool()

function signout() {
  appStore.$reset()
  registratinStore.$reset()
  performerStore.$reset()
  teacherStore.$reset()
  classStore.$reset()
  groupStore.$reset()
  schoolStore.$reset()
  removeToken()
  router.push({ name: 'Login' })
}
</script>

<style scoped></style>
