<template>
  <div>
    <BaseInput
      v-model="school.earlyTime"
      label="Earliest time your group can perform"
      type="time"
      error="Please enter a time"
    />
    <BaseInput
      v-model="school.lateTime"
      label="Latest time your group can perform"
      type="time"
      error="Please enter a time"
    />
    <!--
	**
	** Enter Unavailable time
  **
 -->
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
      school: {
        earlyTime: '',
        lateTime: ''
      }
    }
  }
})
</script>

<style scoped></style>
