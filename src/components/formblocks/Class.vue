<template>
  <div v-show="loading">Loading...</div>
  <div class="grid grid-rows-2 grid-cols-12 gap-x-3 gap-y-4 items-end">
    <div class="col-span-2">
      <div v-if="discError">{{ discError.message }}</div>

      <BaseSelect
        v-model="selectedClasses.discipline"
        label="Discipline"
        :options="disciplines"
        @change="changeSubdisc(selectedClasses.discipline)"
      />
    </div>
    <div class="col-span-2">
      <div v-if="subdiscError">{{ subdiscError.message }}</div>
      <BaseSelect
        v-model="selectedClasses.subdiscipline"
        label="Subdiscipline"
        :options="subdisciplines"
        @change="changeGradeLevel(selectedClasses.subdiscipline)"
      />
    </div>
    <div class="col-span-4">
      <div v-if="levelError">{{ levelError.message }}</div>
      <BaseSelect
        v-model="selectedClasses.level"
        label="Grade/Level"
        :options="levels"
        @change="
          changeCategory(selectedClasses.subdiscipline, selectedClasses.level)
        "
      />
    </div>
    <div class="col-span-4">
      <div v-if="catError">{{ catError.message }}</div>
      <BaseSelect
        v-model="selectedClasses.category"
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
      <input
        class="off"
        :v-model="(selectedClasses.classNumber = classSelection.classNumber)"
        :value="classSelection.classNumber"
        label="Class Number"
        type="text"
        disabled
        aria-disabled="true"
      />
    </div>
    <div class="col-span-8">
      <div v-if="classError">{{ classError.message }}</div>
      <input
        class="off"
        label="Class Name"
        type="text"
        disabled
        :value="className"
      />
    </div>
    <div class="col-span-2">
      <BaseSelect
        v-if="numberOfAllowedWorks.length > 1"
        v-model="selectedClasses.numberOfWorks"
        label="Number of Selections"
        :selected="numberOfAllowedWorks[0].name"
        :options="numberOfAllowedWorks"
        @change="changeSelections()"
      />
    </div>
    <div class="col-span-12">
      <WorksSelection
        v-for="(work, index) in selectedClasses.works"
        :key="index"
        v-model="selectedClasses.works[index]"
        :work-number="index"
      />
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

  import WorksSelection from './WorksSelection.vue'
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

  /**
   * Disciplines
   */
  const { result: disc, error: discError } = useQuery(DISCIPLINES_QUERY)
  const disciplines = computed(() => disc.value?.disciplines ?? [])

  /**
   * Subdisciplines
   */
  const {
    result: subdisc,
    variables: changeSubdiscipline,
    error: subdiscError,
  } = useQuery(SUBDISCIPLINES_QUERY, {
    disciplineId: '',
  })
  const subdisciplines = computed(() => subdisc.value?.subdisciplines ?? [])
  function changeSubdisc(id: string) {
    selectedClasses.value.subdiscipline = null
    selectedClasses.value.level = null
    selectedClasses.value.category = null
    classSelection.value = null
    selectedClasses.value.numberOfWorks = null
    className.value = ''
    changeSubdiscipline.value = {
      disciplineId: id,
    }
  }

  /**
   * Grades / Levels
   */
  const {
    result: gradeLevel,
    variables: changeLevel,
    error: levelError,
  } = useQuery(LEVELS_QUERY, {
    subdisciplineId: '',
  })
  const levels = computed(() => gradeLevel.value?.levels ?? [])
  function changeGradeLevel(id: string) {
    selectedClasses.value.level = null
    selectedClasses.value.category = null
    classSelection.value = null
    selectedClasses.value.numberOfWorks = null
    className.value = ''
    changeLevel.value = {
      subdisciplineId: id,
    }
  }

  /**
   * Categories
   */
  const {
    result: cat,
    variables: changeCat,
    error: catError,
  } = useQuery(CATEGORIES_QUERY, {
    subdisciplineId: '',
    levelId: '',
  })
  const categories = computed(() => cat.value?.categories ?? [])
  function changeCategory(subId: string, levelId: string) {
    selectedClasses.value.category = null
    classSelection.value = null
    selectedClasses.value.numberOfWorks = null
    className.value = ''
    changeCat.value = {
      subdisciplineId: subId,
      levelId: levelId,
    }
  }

  /**
   * Class Number
   */
  const {
    result: classSearch,
    variables: findClass,
    error: classError,
  } = useQuery(CLASS_SEARCH_QUERY, {
    classSearchArgs: {
      subdisciplineID: '',
      levelID: '',
      categoryID: '',
    },
  })
  const classSelection = computed({
    get: () => classSearch.value?.classSearch[0] ?? [],
    set: (newValue) => (classSearch.value = newValue),
  })
  function changeClass(subId: string, levelId: string, catId: string) {
    classSelection.value = null
    selectedClasses.value.numberOfWorks = null
    className.value = ''
    findClass.value = {
      classSearchArgs: {
        subdisciplineID: subId,
        levelID: levelId,
        categoryID: catId,
      },
    }
  }

  const loading = useQueryLoading()

  /**
   * ClassName - Only used for text box
   */
  const className = computed({
    get: () =>
      (classSearch.value?.classSearch[0].subdiscipline.name ?? '') +
      ' - ' +
      (classSearch.value?.classSearch[0].level.name ?? '') +
      ' - ' +
      (classSearch.value?.classSearch[0].category.name ?? ''),

    set: (newValue) => newValue,
  })

  /**
   * Number of Allowed Works - not quite right
   */
  const numberOfAllowedWorks = computed(() => {
    let min: number = classSearch.value?.classSearch[0].minSelection ?? 1
    let max: number = classSearch.value?.classSearch[0].maxSelection ?? 1
    let numberOfWorks = []
    for (let i = 0; i < max; i++) {
      numberOfWorks.push({ id: i, name: i })
    }
    return numberOfWorks
  })

  /*******
   * Not finished
   *
   */
  function changeSelections() {}
</script>

<style scoped></style>
