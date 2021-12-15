<template>
  <div>
    <BaseSelect
      v-model="school.school.division"
      label="School Division"
      :options="divisions"
      error="Please select a school division"
    />
    <BaseSelect
      v-model="school.school.name"
      label="School Name"
      :options="schools"
      error="Please select a school"
    />
  </div>
</template>

<script lang="ts" setup>
  import { useSchool } from '../../store/userSchool'
  const school = useSchool()
  const divisions = [
    'Pembina Trails',
    'Winnipeg',
    'Louis Riel',
    'St. James-Assiniboia',
    'Seven Oaks',
    'River East-Transcona',
  ]
  const schools = ['vincent massey', 'Viscount Alexander', 'Ecole Crane']
</script>

<style scoped></style>
