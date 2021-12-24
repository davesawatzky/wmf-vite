<template>
  <div class="grid grid-rows-2 grid-cols-12 gap-x-3 gap-y-4 items-end">
    <div class="col-span-4">
      <InstrumentField />
    </div>
    <div class="col-span-4">
      <GradeLevelField />
    </div>
    <div class="col-span-4">
      <CategoryField />
    </div>
    <div class="col-span-2">
      <BaseInput
        v-model="classes.classes[0].number"
        label="Class Number"
        type="text"
        error="Invalid Class Number"
      />
    </div>
    <div class="col-span-8">
      <BaseInput
        label="Class Name"
        type="text"
        error="This input has an error"
      />
    </div>
    <div class="col-span-2">
      <BaseSelect
        v-model="classes.classes[0].numSelections"
        label="Number of Selections"
        :options="numberOfSelections"
      />
    </div>

    <div class="col-span-12">
      <ClassTitle />
    </div>

    <div>
      <BaseButton class="btn btn-red" type="button">Remove Class</BaseButton>
    </div>
    <div>
      <BaseButton class="btn btn-blue" type="button">Add Class</BaseButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useClasses } from '@/store/userClasses'
  import { storeToRefs } from 'pinia'
  import { useRegistration } from '@/store/userRegistration'

  // const registration = storeToRefs(useRegistration())
  const classes = useClasses()

  const categoryPick = ['German Lieder', 'Italian Art Song', 'Musicals']
  const numberOfSelections = [2, 3]
</script>

<style scoped></style>
