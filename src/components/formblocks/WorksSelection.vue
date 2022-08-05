<template>
  <h3 class="pt-6">Selection {{ workNumber + 1 }}</h3>
  <div class="grid grid-rows-3 grid-cols-12 gap-x-3 gap-y-8 pt-4 items-end">
    <div class="col-span-7">
      {{ work }}
      <BaseInput
        v-model="work.title"
        label="Title (including opus number if applicable)"
        type="text"
        error="This input has an error"
      />
    </div>
    <div class="col-span-5">
      <BaseInput
        v-model="work.composer"
        label="Composer"
        type="text"
        error="This input has an error"
      />
    </div>
    <div class="col-span-5">
      <BaseInput
        v-model="work.largerWork"
        label="Title of Larger Work"
        type="text"
        error="This input has an error"
      />
    </div>
    <div class="col-span-4">
      <BaseInput
        v-model="work.movement"
        label="Movement (if applicable)"
        type="text"
        error="This input has an error"
      />
    </div>
    <div class="col-span-3">
      <BaseInput
        v-model="work.duration"
        label="Duration"
        type="text"
        error="This input has an error"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    workNumber: {
      type: Number,
      default: 1,
    },
  })

  const emits = defineEmits(['update:modelValue'])
  const work = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })
</script>

<style scoped></style>
