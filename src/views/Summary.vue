<template>
  <div>
    <h2>Registration Summary</h2>
    <div>
      <h3 class="pt-10 pb-2">Performer</h3>
      <SummaryContactInfo
        :full-name="performers.fullName"
        :address="performers.performer[0].address"
        :city="performers.performer[0].city"
        :province="performers.performer[0].province"
        :postal-code="performers.performer[0].postalCode"
        :phone="performers.performer[0].phone"
        :email="performers.performer[0].email"
      />
    </div>
    <div>
      <h3 class="pt-10 pb-2">Teacher</h3>
      <SummaryContactInfo
        :full-name="teacher.fullName"
        :address="teacher.address"
        :city="teacher.city"
        :province="teacher.province"
        :postal-code="teacher.postalCode"
        :phone="teacher.phone"
        :email="teacher.email"
      />
    </div>
    <h3 class="pt-10 pb-2">Class Summary</h3>
    <ClassSummary />
  </div>
  <BaseRouteButton type="button" to="/soloclasses" class="btn btn-blue"
    >Previous</BaseRouteButton
  >
</template>

<script setup lang="ts">
  import { useClasses } from '@/store/userClasses'
  import { usePerformers } from '@/store/userPerformer'
  import { useTeacher } from '@/store/userTeacher'
  import { useStore } from '@/store/registration'

  const classes = useClasses()
  const performers = usePerformers()

  const teacher = useTeacher()
  const main = useStore()
</script>

<style scoped></style>
