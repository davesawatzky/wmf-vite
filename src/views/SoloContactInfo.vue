<template>
  <!-- Solo Performer Contact Information	-->
  <div class="pb-8">
    <h2 class="pb-4">Solo Performer Information</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <form v-else @submit.prevent>
      <div>
        <div>
          <ContactInfo v-model="performer" />
        </div>
        <div class="pt-4">
          <BaseTextarea :label="textAreaLabel" />
        </div>
      </div>

      <!-- Solo Teacher Contact Information -->
      <div class="pb-8">
        <h2 class="pb-4">Teacher Information</h2>
        <ContactInfo v-model="teacher" />
      </div>
    </form>
  </div>

  <!-- Previous and Next Buttons on the page. Uses custom routes -->
  <BaseRouteButton to="Registrations" class="btn btn-blue"
    >Previous</BaseRouteButton
  >
  <BaseRouteButton
    id="registrationId"
    to="SoloClasses"
    performer-type="performerType"
    edit="edit"
    class="btn btn-blue"
    >Next</BaseRouteButton
  >
</template>

<script lang="ts" setup>
  import { textAreaLabel } from '@/composables/formData'
  import { useQuery } from '@vue/apollo-composable'
  import { computed } from 'vue'
  import SOLO_CONTACT_INFO_QUERY from '../graphql/queries/soloContactInfo.query.gql'

  const props = defineProps({
    edit: {
      type: String,
      default: 'false',
    },
    registrationId: {
      type: String,
      default: '',
    },
    performerType: {
      type: String,
      default: 'SOLO',
    },
  })

  const { result, loading, error } = useQuery(SOLO_CONTACT_INFO_QUERY, {
    registrationId: props.registrationId,
  })
  const performer = computed(
    () => result.value?.registration.performers[0] ?? []
  )
  const teacher = computed(() => result.value?.registration.teacher ?? [])
</script>

<style lang="scss" scoped></style>
