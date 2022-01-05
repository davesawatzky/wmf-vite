<template>
  <div class="grid grid-rows-2 grid-cols-12 gap-x-3 gap-y-4 items-end">
    <div class="col-span-4">
      <BaseSelect
        v-model="classes.subdiscipline"
        class=""
        label="Instruments"
        :options="instruments"
      />
    </div>
    <div class="col-span-4">
      <BaseSelect
        v-model="classes.level"
        class=""
        label="Grade/Level"
        :options="gradelevel"
      />
    </div>
    <div class="col-span-4">
      <BaseSelect
        v-model="classes.category"
        class=""
        label="Category"
        :options="categories"
      />
    </div>

    <!-- The array "classes" needs fixing
		***  This isn't working as a component
		 -->
    <div class="col-span-2">
      <BaseInput
        v-model="classes.number"
        label="Class Number"
        type="text"
        error="Invalid Class Number"
      />
    </div>
    <div class="col-span-8">
      <BaseInput label="Class Name" type="text" />
    </div>
    <div class="col-span-2">
      <BaseSelect
        v-model="classes.numSelections"
        label="Number of Selections"
        :options="numberOfSelections"
      />
    </div>

    <div class="col-span-12">
      <ClassSelection />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useQuery, useResult } from '@vue/apollo-composable'
  import gql from 'graphql-tag'
  import ClassSelection from './ClassSelection.vue'
  import BaseSelect from '../base/BaseSelect.vue'

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({}),
    },
  })
  const emits = defineEmits(['update:modelValue'])

  const classes = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

  const { result, loading, error } = useQuery(gql`
    query {
      subdisciplines {
        id
        name
      }
      levels {
        id
        name
      }
      categories {
        id
        name
      }
    }
  `)
  const instruments: string[] = useResult(
    result,
    [],
    (data) => data.subdisciplines
  )
  const gradelevel: string[] = useResult(result, [], (data) => data.levels)
  const categories: string[] = useResult(result, [], (data) => data.categories)
  const numberOfSelections = [
    { id: 1, name: '1' },
    { id: 2, name: '2' },
    { id: 3, name: '3' },
  ]
</script>

<style scoped></style>
