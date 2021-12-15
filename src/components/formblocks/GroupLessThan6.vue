<template>
  <div>
    <BaseInput
      v-model="groupName"
      type="text"
      label="Group Name (if applicable)"
    />

    <!-- Needs to show up to 6 times
		Perhaps place in an array of objects
		partipant 1... 6  -->
    <ParticipantInfo />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  import ParticipantInfo from './PerformerInfo.vue'

  export default defineComponent({
    components: {
      ParticipantInfo,
    },
    setup() {
      return {}
    },
    data() {
      return {
        groupName: '',
      }
    },
  })
</script>

<style scoped></style>
