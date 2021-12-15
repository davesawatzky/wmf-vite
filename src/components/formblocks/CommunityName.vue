<template>
  <div>
    <BaseInput
      v-model="community.name"
      label="Group Name"
      type="text"
      error="Enter a name for the group"
    />
    <BaseInput
      v-model="community.number"
      label="Total number of participants (incl. chaperones)"
      type="number"
    />
    <BaseInput
      v-model="community.numInWheelchairs"
      label="Number in wheelchairs"
      type="number"
    />
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
      community: {
        name: '',
        number: 0,
        numInWheelchairs: 0
      }
    }
  }
})
</script>

<style scoped></style>
