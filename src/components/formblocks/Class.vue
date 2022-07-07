<template>
  <div v-show="loading">Loading...</div>
  <div class="grid grid-rows-2 grid-cols-12 gap-x-3 gap-y-4 items-end">
    <div class="col-span-2">
      <BaseSelect
        v-model="selectedClasses.discipline"
        class=""
        label="Discipline"
        :options="disciplines"
        @change="changeSubdisc(selectedClasses.discipline)"
      />
    </div>
    <div class="col-span-2">
      <BaseSelect
        v-model="selectedClasses.subdiscipline"
        class=""
        label="Subdiscipline"
        :options="subdisciplines"
        @change="changeGradeLevel(selectedClasses.subdiscipline)"
      />
    </div>
    <div class="col-span-4">
      <BaseSelect
        v-model="selectedClasses.level"
        class=""
        label="Grade/Level"
        :options="levels"
        @change="
          changeCategory(selectedClasses.subdiscipline, selectedClasses.level)
        "
      />
    </div>
    <div class="col-span-4">
      <BaseSelect
        v-model="selectedClasses.category"
        class=""
        label="Category"
        :options="categories"
        @change="
          changeClass(
            selectedClasses.subdiscipline,
            selectedClasses.level,
            selectedClasses.category
          )
        "
      />
    </div>

    <div class="col-span-2">
      <BaseInput
        v-model="selectedClasses.number"
        label="Class Number"
        :placeholder="classSelection.classNumber"
        :value="classSelection.classNumber"
        type="text"
        readonly
      />
    </div>

    <div class="col-span-8">
      <BaseInput label="Class Name" type="text" readonly />
    </div>
    <div class="col-span-2">
      <!-- Need Options down below-->
      <BaseSelect
        v-model="selectedClasses.numSelections"
        label="Number of Selections"
      />
    </div>

    <div class="col-span-12">
      <ClassSelection />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useQuery, useQueryLoading } from '@vue/apollo-composable'
  import DISCIPLINES_QUERY from '@/graphql/queries/disciplines.query.gql'
  import SUBDISCIPLINES_QUERY from '@/graphql/queries/subdisciplines.query.gql'
  import LEVELS_QUERY from '@/graphql/queries/levels.query.gql'
  import CATEGORIES_QUERY from '@/graphql/queries/categories.query.gql'
  import CLASS_SEARCH_QUERY from '@/graphql/queries/classSearch.query.gql'

  import ClassSelection from './ClassSelection.vue'
  import BaseSelect from '../base/BaseSelect.vue'

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    performerType: {
      type: String,
      default: 'SOLO',
    },
  })
  const emits = defineEmits(['update:modelValue'])

  const selectedClasses = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })

  const { result: disc } = useQuery(DISCIPLINES_QUERY)
  const { result: subdisc, variables: changeSubdiscipline } = useQuery(
    SUBDISCIPLINES_QUERY,
    {
      disciplineId: '1',
    }
  )
  function changeSubdisc(id: string) {
    changeSubdiscipline.value = {
      disciplineId: id,
    }
    selectedClasses.value.subdiscipline = ''
    selectedClasses.value.level = ''
    selectedClasses.value.category = ''
    selectedClasses.value.number = ''
  }

  const { result: gradeLevel, variables: changeLevel } = useQuery(
    LEVELS_QUERY,
    {
      subdisciplineId: 1,
    }
  )
  function changeGradeLevel(id: string) {
    changeLevel.value = {
      subdisciplineId: Number(id),
    }
  }

  const { result: cat, variables: changeCat } = useQuery(CATEGORIES_QUERY, {
    subdisciplineId: '',
    levelId: '',
  })
  function changeCategory(subId: string, levelId: string) {
    changeCat.value = {
      subdisciplineId: subId,
      levelId: levelId,
    }
  }
  const { result: classSearch, variables: findClass } = useQuery(
    CLASS_SEARCH_QUERY,
    {
      classSearchArgs: {
        subdisciplineID: '',
        levelID: '',
        categoryID: '',
      },
    }
  )
  function changeClass(subId: string, levelId: string, catId: string) {
    findClass.value = {
      classSearchArgs: {
        subdisciplineID: subId,
        levelID: levelId,
        categoryID: catId,
      },
    }
  }

  const loading = useQueryLoading()

  const disciplines = computed(() => disc.value?.disciplines ?? [])
  const subdisciplines = computed(() => subdisc.value?.subdisciplines ?? [])
  const levels = computed(() => gradeLevel.value?.levels ?? [])
  const categories = computed(() => cat.value?.categories ?? [])
  const classSelection = computed(() => classSearch.value?.classSearch[0] ?? [])

  // const { result, loading, error } = useQuery(gql`
  //   query Subdiscipline {
  //     subdisciplines {
  //       id
  //       name
  //     }
  //     levels {
  //       id
  //       name
  //     }
  //     categories {
  //       id
  //       name
  //     }
  //   }
  // `)
  // const instruments: string[] = useResult(
  //   result,
  //   [],
  //   (data) => data.subdisciplines
  // )
  // const gradelevel: string[] = useResult(result, [], (data) => data.levels)
  // const categories: string[] = useResult(result, [], (data) => data.categories)
  // const numberOfSelections = [
  //   { id: 1, name: '1' },
  //   { id: 2, name: '2' },
  //   { id: 3, name: '3' },
  // ]
</script>

<style scoped></style>
