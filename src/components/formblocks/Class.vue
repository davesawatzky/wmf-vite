<template>
  <div class="grid grid-rows-2 grid-cols-12 gap-x-3 gap-y-4 items-end">
    <div class="col-span-4">
      <BaseSelect class="" label="Instrument" :options="instrumentPick" />
    </div>
    <div class="col-span-4">
      <BaseSelect label="Grade/Level" :options="gradeLevelPick" />
    </div>
    <div class="col-span-4">
      <BaseSelect label="Category" :options="categoryPick" />
    </div>
    <div class="col-span-2">
      <BaseInput
        v-model="classes.classes[0].classNumber"
        label="Class Number"
        type="text"
        error="Invalid Class Number"
      />
    </div>
    <div class="col-span-8">
      <BaseInput
        v-model="classes.classes[0].className"
        label="Class Name"
        type="text"
        error="This input has an error"
      />
    </div>
    <div class="col-span-2">
      <BaseSelect
        v-model="classes.classes[0].numberOfSelections"
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
  import { useStore } from '@/store/registration'

  const classes = useClasses()
  const numberOfSelections = [2, 3]
  const instrumentPick = ['Voice', 'Bassoon', 'Violin', 'Cello']
  const gradeLevelPick = [
    '16 years and under',
    '19 years and under',
    'adult',
    'diploma',
  ]
  const categoryPick = ['German Lieder', 'Italian Art Song', 'Musicals']
  const { registrationType } = storeToRefs(useStore())
</script>

<style scoped></style>
