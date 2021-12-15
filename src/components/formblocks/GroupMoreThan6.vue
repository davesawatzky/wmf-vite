<template>
  <div>
    <BaseInput
      v-model="group.groupName"
      label="Group Name"
      type="text"
      error="Enter a group name"
    />
    <BaseInput
      v-model="group.participantNumber"
      label="Number of participants in the group"
      type="number"
      error="Enter a number"
    />
    <BaseTextarea v-model="group.instruments" label="Instrument(s)" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  },
  data() {
    return {
      group: {
        groupName: '',
        participantNumber: 0,
        instruments: ''
      }
    }
  }
})
</script>

<style scoped></style>
