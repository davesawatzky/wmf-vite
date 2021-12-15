<template>
  <div>
    <BaseSelect
      v-model="recitalClass.class"
      :options="classNumbers"
      label="Class Number"
    />
    <BaseInput
      v-model="recitalClass.className"
      label="Class Name"
      type="text"
      error="This input has an error!"
    />
    <div>
      <h3>Please enter up to three titles</h3>
      <h4>Title One</h4>
      <BaseInput
        v-model="recitalClass.title1"
        label="Title (including opus number if applicable)"
        type="text"
        error="This input has an error"
      />
      <BaseInput
        v-model="recitalClass.composer1"
        label="Composer"
        type="text"
      />
      <h4>Title Two</h4>
      <BaseInput
        v-model="recitalClass.title2"
        label="Title (including opus number if applicable)"
        type="text"
        error="This input has an error"
      />
      <BaseInput
        v-model="recitalClass.composer2"
        label="Composer"
        type="text"
      />
      <h4>Title Three</h4>
      <BaseInput
        v-model="recitalClass.title3"
        label="Title (including opus number if applicable)"
        type="text"
        error="This input has an error"
      />
      <BaseInput
        v-model="recitalClass.composer3"
        label="Composer"
        type="text"
      />
    </div>
    <BaseInput
      v-model="recitalClass.totalDuration"
      label="Total duration of pieces"
      type="text"
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
      classNumbers: ['1756', '86743', '1045-A'],
      recitalClass: {
        class: '',
        className: '',
        title1: '',
        title2: '',
        title3: '',
        composer1: '',
        composer2: '',
        composer3: '',
        totalDuration: ''
      }
    }
  }
})
</script>

<style scoped></style>
