<template>
  <h3 class="pt-6">Selection 1</h3>
  <div class="grid grid-rows-3 grid-cols-12 gap-x-3 gap-y-8 pt-4 items-end">
    <div class="col-span-7">
      <BaseInput
        v-model="selections.selection[0].title"
        label="Title (including opus number if applicable)"
        type="text"
        error="This input has an error"
      />
    </div>
    <div class="col-span-5">
      <BaseInput
        v-model="selections.selection[0].composer"
        label="Composer"
        type="text"
        error="This input has an error"
      />
    </div>
    <div class="col-span-5">
      <BaseInput
        v-model="selections.selection[0].largerWork"
        label="Title of Larger Work"
        type="text"
        error="This input has an error"
      />
    </div>
    <div class="col-span-4">
      <BaseInput
        v-model="selections.selection[0].movement"
        label="Movement (if applicable)"
        type="text"
        error="This input has an error"
      />
    </div>
    <div class="col-span-3">
      <BaseInput
        v-model="selections.selection[0].duration"
        label="Duration"
        type="text"
        error="This input has an error"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useClasses } from '@/store/userClasses'
  import { useSelections } from '@/store/userSelections'

  const classes = useClasses()
  const selections = useSelections()
</script>

<style scoped></style>
