<template>
  <div v-auto-animate class="grid grid-cols-12 gap-x-3 gap-y-5 items-end">
    <div class="col-span-6 lg:col-span-2">
      <BaseSelect
        id=""
        v-model="selectedClasses.discipline"
        label="Discipline"
        :options="disciplines"
        @change="changeSubdisciplineDropdown()"
      />
    </div>
    <div class="col-span-6 lg:col-span-3">
      <BaseSelect
        v-model="selectedClasses.subdiscipline"
        :class="selectedClasses.discipline ? '' : 'off'"
        label="Subdiscipline"
        :options="subdisciplines"
        :disabled="!selectedClasses.discipline"
        @change="changeGradeLevelDropdown()"
      />
    </div>
    <div class="col-span-6 lg:col-span-3">
      <BaseSelect
        v-model="selectedClasses.level"
        :class="selectedClasses.subdiscipline ? '' : 'off'"
        label="Grade/Level"
        :options="levels"
        :disabled="!selectedClasses.subdiscipline"
        @change="changeCategoryDropdown()"
      />
    </div>
    <div class="col-span-6 lg:col-span-4">
      <BaseSelect
        v-model="selectedClasses.category"
        :class="selectedClasses.level ? '' : 'off'"
        label="Category"
        :options="categories"
        :disabled="!selectedClasses.level"
        @change="changeClass()"
      />
    </div>
    <div class="col-span-6 md:col-span-2">
      <BaseSelect
        v-model.number="selectedClasses.number_of_selections"
        :class="selectedClasses.category ? '' : 'off'"
        label="Selections"
        :options="numberOfAllowedWorks"
        :disabled="!selectedClasses.category"
      />
    </div>
    <div class="col-span-6 md:col-span-2">
      <label for="class_number">Class Number</label>
      <input
        id="class_number"
        class="off"
        :v-model="selectedClasses.class_number"
        :value="(selectedClasses.class_number = classSelection.class_number)"
        label="Class Number"
        type="text"
        disabled
        aria-disabled="true"
      />
    </div>
    <div class="col-span-12 md:col-span-8">
      <label for="className">Class Name</label>
      <input
        id="className"
        class="off"
        :v-model="selectedClasses.className"
        :value="(selectedClasses.className = className)"
        label="Class Name"
        type="text"
        disabled
      />
    </div>
    <div v-if="instrumentRequired" class="col-span-12">
      <BaseSelect
        id="instrument"
        v-model="performerStore.performer[0].instrument"
        :options="instruments"
        label="Instrument"
      ></BaseSelect>
    </div>
    <div v-if="notes" class="col-span-12">
      <h4 class="pb-2">Notes</h4>
      <div v-if="chosenSubdiscipline.description" v-auto-animate>
        <div class="font-bold">Subdiscipline</div>
        <p class="text-sm pb-2">{{ chosenSubdiscipline.description }}</p>
      </div>
      <div v-if="chosenGradeLevel.description" v-auto-animate>
        <div class="font-bold">Grade / Level</div>
        <p class="text-sm pb-2">{{ chosenGradeLevel.description }}</p>
      </div>
      <div v-if="chosenCategory.description" v-auto-animate>
        <div class="font-bold">Category</div>
        <p class="text-sm pb-2">{{ chosenCategory.description }}</p>
      </div>
      <div v-if="(classSelection.trophies ?? []).length > 0" v-auto-animate>
        <div class="font-bold">Trophy Eligibility</div>
        <div v-for="trophy in classSelection.trophies" :key="trophy.id">
          <div class="font-semibold text-sm">{{ trophy.name }}:</div>
          <p class="text-sm pb-2">{{ trophy.description }}</p>
        </div>
      </div>
    </div>
    <div v-if="selectedClasses.category" v-auto-animate class="col-span-12">
      <div v-if="!selectedClasses.number_of_selections">
        <h4>Please choose the number of selections above.</h4>
      </div>
      <div v-else>
        <WorksSelection
          v-for="(selection, selectionIndex) in selectedClasses.selections"
          :key="selectionIndex"
          v-model="selectedClasses.selections[selectionIndex]"
          v-auto-animate
          :work-number="selectionIndex"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch, ref } from 'vue'
import { useQuery, useLazyQuery } from '@vue/apollo-composable'
import DISCIPLINES_BY_TYPE_QUERY from '@/graphql/queries/DisciplinesByType.query.gql'
import SUBDISCIPLINES_BY_TYPE_QUERY from '@/graphql/queries/subdisciplinesByType.query.gql'
import LEVELS_QUERY from '@/graphql/queries/levels.query.gql'
import CATEGORIES_QUERY from '@/graphql/queries/categories.query.gql'
import CLASS_SEARCH_QUERY from '@/graphql/queries/classSearch.query.gql'
import INSTRUMENTS_QUERY from '@/graphql/queries/instruments.query.gql'

import WorksSelection from './WorksSelection.vue'
import BaseSelect from '../base/BaseSelect.vue'
import { useClasses } from '@/stores/userClasses'
import { useAppStore } from '@/stores/appStore'
import { usePerformers } from '@/stores/userPerformer'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  classIndex: {
    type: Number,
    default: 0,
  },
})

const instrumentRequired = ref(false)
const appStore = useAppStore()
const performerStore = usePerformers()
const classesStore = useClasses()
const emits = defineEmits(['update:modelValue'])
const selectedClasses = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})

onMounted(() => {
  subdiscLoad()
  gradeLevelLoad()
  catLoad()
  classNumberLoad()
})

const notes = computed(() => {
  if (
    chosenSubdiscipline.value.description ||
    chosenGradeLevel.value.description ||
    chosenCategory.value.description ||
    (classSelection.value.trophies ?? []).length > 0
  ) {
    return true
  }
  return false
})

const { result: instrumentQuery, error: instrumentsError } =
  useQuery(INSTRUMENTS_QUERY)
const instruments = computed(() => instrumentQuery.value.instruments ?? [])

watch(
  () => selectedClasses.value.class_number,
  (class_number) => {
    instrumentRequired.value = classesStore.mozartClasses.includes(class_number)
  }
)
/**
 * Disciplines
 */
const { result: disc, error: discError } = useQuery(
  DISCIPLINES_BY_TYPE_QUERY,
  () => ({ SGS_label: appStore.performer_type })
)
const disciplines = computed(() => disc.value?.disciplinesByType ?? [])
const chosenDiscipline = computed({
  get: () => {
    return (
      disciplines.value.find((item: any) => {
        return item.name === selectedClasses.value.discipline
      }) ?? {}
    )
  },
  set: (newValue) => newValue,
})
function changeSubdisciplineDropdown() {
  selectedClasses.value.subdiscipline = null
  selectedClasses.value.level = null
  selectedClasses.value.category = null
  selectedClasses.value.number_of_selections = null
  selectedClasses.value.className = null
  selectedClasses.value.class_number = null
  chosenSubdiscipline.value = { id: '', name: '' }
  chosenGradeLevel.value = { id: '', name: '' }
  chosenCategory.value = { id: '', name: '' }
  className.value = ''
  classSelection.value = null

  subdiscLoad()
}

/**
 * Subdisciplines
 */
const {
  result: subdisc,
  load: subdiscLoad,
  error: subdiscError,
} = useLazyQuery(
  SUBDISCIPLINES_BY_TYPE_QUERY,
  () => ({
    disciplineId: chosenDiscipline.value.id,
    SGS_label: appStore.performer_type,
  }),
  { fetchPolicy: 'network-only' }
)
const subdisciplines = computed(() => subdisc.value?.subdisciplinesByType ?? [])
const chosenSubdiscipline = computed({
  get: () => {
    return (
      subdisciplines.value.find((item: any) => {
        return item.name === selectedClasses.value.subdiscipline
      }) ?? {}
    )
  },
  set: (newValue) => newValue,
})

// watch(chosenSubdiscipline, (newSubdiscipline) => {
// 	classesStore.registeredClasses[props.classIndex].price =
// 		newSubdiscipline.price
// })
function changeGradeLevelDropdown() {
  selectedClasses.value.level = null
  selectedClasses.value.category = null
  selectedClasses.value.number_of_selections = null
  selectedClasses.value.className = null
  selectedClasses.value.class_number = null
  chosenGradeLevel.value = { id: '', name: '' }
  chosenCategory.value = { id: '', name: '' }
  className.value = ''
  classSelection.value = null

  gradeLevelLoad()
}

/**
 * Grades / Levels
 */
const {
  result: gradeLevel,
  load: gradeLevelLoad,
  error: levelError,
} = useLazyQuery(
  LEVELS_QUERY,
  () => ({
    subdisciplineId: chosenSubdiscipline.value.id,
  }),
  { fetchPolicy: 'network-only' }
)
const levels = computed(() => gradeLevel.value?.levels ?? [])
const chosenGradeLevel = computed({
  get: () => {
    return (
      levels.value.find((item: any) => {
        return item.name === selectedClasses.value.level
      }) ?? {}
    )
  },
  set: (newValue) => newValue,
})
function changeCategoryDropdown() {
  selectedClasses.value.category = null
  selectedClasses.value.number_of_selections = null
  selectedClasses.value.className = null
  selectedClasses.value.class_number = null
  chosenCategory.value = { id: '', name: '' }
  className.value = ''
  classSelection.value = null

  catLoad()
}

/**
 * Categories
 */
const {
  result: cat,
  load: catLoad,
  error: catError,
} = useLazyQuery(
  CATEGORIES_QUERY,
  () => ({
    subdisciplineId: chosenSubdiscipline.value.id,
    levelId: chosenGradeLevel.value.id,
  }),
  { fetchPolicy: 'network-only' }
)
const categories = computed(() => cat.value?.categories ?? [])
const chosenCategory = computed({
  get: () => {
    return (
      categories.value.find((item: any) => {
        return item.name === selectedClasses.value.category
      }) ?? {}
    )
  },
  set: (newValue) => newValue,
})
function changeClass() {
  selectedClasses.value.number_of_selections = null
  selectedClasses.value.className = null
  selectedClasses.value.class_number = null

  classNumberLoad()
}

/**
 * ClassName
 */
const className = computed({
  get: () => {
    if (
      selectedClasses.value.subdiscipline &&
      selectedClasses.value.level &&
      selectedClasses.value.category
    ) {
      return (
        selectedClasses.value.subdiscipline +
        ' - ' +
        selectedClasses.value.level +
        ' - ' +
        selectedClasses.value.category
      )
    } else {
      return ''
    }
  },
  set: (newValue) => newValue,
})

/**
 * Class Search for details incl. Number
 */

const {
  result: classSearch,
  load: classNumberLoad,
  error: classError,
} = useLazyQuery(
  CLASS_SEARCH_QUERY,
  () => ({
    classSearchArgs: {
      subdisciplineID: chosenSubdiscipline.value.id,
      levelID: chosenGradeLevel.value.id,
      categoryID: chosenCategory.value.id,
    },
  }),
  { fetchPolicy: 'network-only' }
)
const classSelection = computed({
  get: () => {
    if (
      chosenSubdiscipline.value.id &&
      chosenGradeLevel.value.id &&
      chosenCategory.value.id
    ) {
      return classSearch?.value?.classSearch[0] ?? []
    } else {
      return []
    }
  },
  set: (newValue) => newValue,
})

watch(classSelection, (newClassSelection) => {
  classesStore.registeredClasses[props.classIndex].price =
    newClassSelection.price
})

/**
 * Number of Allowed Works
 */
const minWorks = computed(() => {
  return classSearch.value?.classSearch[0].min_selection ?? null
})
const maxWorks = computed(() => {
  return classSearch.value?.classSearch[0].max_selection ?? null
})
const numberOfAllowedWorks = computed(() => {
  if (minWorks.value === maxWorks.value) {
    return [{ id: minWorks.value, name: minWorks.value }]
  } else {
    let selectionOptions = []
    for (let i = minWorks.value; i <= maxWorks.value; i++) {
      selectionOptions.push({ id: i, name: i })
    }
    return selectionOptions
  }
})

/**
 * Updating number of selections
 */
watch(
  () => selectedClasses.value.number_of_selections,
  async (newNumber) => {
    let oldNumber =
      classesStore.registeredClasses[props.classIndex].selections!.length
    switch (oldNumber < newNumber) {
      case true:
        while (oldNumber < newNumber) {
          await classesStore
            .createSelection(props.classIndex)
            .catch((error) => console.log('There was an error!' + error))
          oldNumber += 1
        }
        break
      case false:
        while (oldNumber > newNumber) {
          await classesStore.deleteSelection(props.classIndex, oldNumber - 1)
          oldNumber -= 1
        }
        break
    }
    await classesStore.updateClass(props.classIndex)
  }
)
</script>

<style scoped></style>
