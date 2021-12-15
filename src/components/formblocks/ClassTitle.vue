<template>
  <h3 class="pt-6">Selection 1</h3>
  <div class="grid grid-rows-3 grid-cols-12 gap-x-3 gap-y-8 pt-4 items-end">
    <div class="col-span-7">
      <BaseInput
        v-model="classes.classes[0].selections[0].title"
        label="Title (including opus number if applicable)"
        type="text"
        error="This input has an error"
      />
    </div>
    <div class="col-span-5">
      <BaseInput
        v-model="classes.classes[0].selections[0].composer"
        label="Composer"
        type="text"
        error="This input has an error"
      />
    </div>
    <div class="col-span-5">
      <BaseInput
        v-model="classes.classes[0].selections[0].titleOfLargerWork"
        label="Title of Larger Work"
        type="text"
        error="This input has an error"
      />
    </div>
    <div class="col-span-4">
      <BaseInput
        v-model="classes.classes[0].selections[0].movement"
        label="Movement (if applicable)"
        type="text"
        error="This input has an error"
      />
    </div>
    <div class="col-span-3">
      <BaseInput
        v-model="classes.classes[0].selections[0].duration"
        label="Duration"
        type="text"
        error="This input has an error"
      />
    </div>
    <div class="col-span-2">
      <BaseInput
        v-model="classes.classes[0].selections[0].level"
        label="Grade/Level"
        type="text"
        error="This input has an error"
      />
    </div>
    <div class="col-span-2">
      <BaseInput
        v-model="classes.classes[0].selections[0].instrument"
        label="Instrument"
        type="text"
        error="This input has an error"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useClasses } from '@/store/userClasses'
  const props = defineProps({
    selectionNumber: {
      type: Number,
      default: 0,
    },
  })
  const classes = useClasses()
</script>

<style scoped></style>
