<template>
  <!--
	***
	*** Solo Performer Contact Information
	***
	-->
  <div class="pb-8">
    <h2 class="pb-4">Solo Performer Information</h2>
    <ContactInfo v-model="performers.performer[0]" />
    <div class="pt-4">
      <BaseTextarea :label="textAreaLabel" />
    </div>
  </div>
  <!--
	***
	*** Solo Teacher Contact Information
	***
	-->
  <div class="pb-8">
    <h2 class="pb-4">Teacher Information</h2>
    <ContactInfo v-model="teacher" teacher />
  </div>
  <!--
	***
	*** Previous and Next Buttons on the page
	*** Uses custom routes
	***
	-->

  <BaseRouteButton type="button" to="/" class="btn btn-blue"
    >Previous</BaseRouteButton
  >
  <BaseRouteButton type="button" to="/soloclasses" class="btn btn-blue"
    >Next</BaseRouteButton
  >
</template>

<script lang="ts" setup>
  import { useTeacher } from '@/store/userTeacher'
  import { usePerformers } from '@/store/userPerformer'
  import { textAreaLabel } from '@/composables/formData'

  const performers = usePerformers()
  const teacher = useTeacher()
</script>

<style lang="scss" scoped></style>
