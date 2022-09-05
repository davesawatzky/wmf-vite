<template>
	<div v-if="loading">Loading...</div>
	<!-- <div v-if="loading" class="lds-overlay">
		<div class="lds-spinner">
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</div>
	</div> -->
	<div class="grid grid-rows-2 grid-cols-12 gap-x-3 gap-y-4 items-end">
		<div class="col-span-2">
			<div v-if="discError">{{ discError.message }}</div>

			<BaseSelect
				id=""
				v-model="selectedClasses.discipline"
				label="Discipline"
				:options="disciplines"
				@change="changeSubdisciplineDropdown()" />
		</div>
		<div class="col-span-2">
			<div v-if="subdiscError">{{ subdiscError.message }}</div>
			<BaseSelect
				v-model="selectedClasses.subdiscipline"
				:class="selectedClasses.discipline ? '' : 'off'"
				label="Subdiscipline"
				:options="subdisciplines"
				:disabled="!selectedClasses.discipline"
				@change="changeGradeLevelDropdown()" />
		</div>
		<div class="col-span-4">
			<div v-if="levelError">{{ levelError.message }}</div>
			<BaseSelect
				v-model="selectedClasses.level"
				:class="selectedClasses.subdiscipline ? '' : 'off'"
				label="Grade/Level"
				:options="levels"
				:disabled="!selectedClasses.subdiscipline"
				@change="changeCategoryDropdown()" />
		</div>
		<div class="col-span-4">
			<div v-if="catError">{{ catError.message }}</div>
			<BaseSelect
				v-model="selectedClasses.category"
				:class="selectedClasses.level ? '' : 'off'"
				label="Category"
				:options="categories"
				:disabled="!selectedClasses.level"
				@change="changeClass()" />
		</div>
		<div class="col-span-2">
			<label for="classNumber">Class Number</label>
			<input
				id="classNumber"
				class="off"
				:v-model="(selectedClasses.classNumber = classSelection.classNumber)"
				:value="classSelection.classNumber"
				label="Class Number"
				type="text"
				disabled
				aria-disabled="true" />
		</div>
		<div class="col-span-8">
			<div v-if="classError">{{ classError.message }}</div>
			<label for="className">Class Name</label>
			<input
				id="className"
				class="off"
				:v-model="(selectedClasses.className = className)"
				label="Class Name"
				type="text"
				disabled
				:value="className" />
		</div>
		<div class="col-span-2">
			<BaseSelect
				v-model="selectedClasses.numberOfSelections"
				label="Number of Selections"
				:selected="numberOfAllowedWorks[0].id"
				:options="numberOfAllowedWorks"
				@change="addSelections(selectedClasses.numberOfSelections)" />
		</div>
		<div class="col-span-12">
			<WorksSelection
				v-for="(selection, index) in selectedClasses.selections"
				:key="index"
				v-model="selectedClasses.selections[index]"
				:work-number="index" />
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { computed, ref, watch } from 'vue'
	import { useQuery, useQueryLoading } from '@vue/apollo-composable'

	import DISCIPLINES_QUERY from '@/graphql/queries/disciplines.query.gql'
	import SUBDISCIPLINES_BY_TYPE_QUERY from '@/graphql/queries/subdisciplinesByType.query.gql'
	import LEVELS_QUERY from '@/graphql/queries/levels.query.gql'
	import CATEGORIES_QUERY from '@/graphql/queries/categories.query.gql'
	import CLASS_SEARCH_QUERY from '@/graphql/queries/classSearch.query.gql'

	import WorksSelection from './WorksSelection.vue'
	import BaseSelect from '../base/BaseSelect.vue'
	import { useClasses } from '@/stores/userClasses'
	import { useAppStore } from '@/stores/appStore'

	const props = defineProps({
		modelValue: {
			type: Object,
			default: () => ({}),
		},
		performerType: {
			type: String,
			default: 'SOLO',
		},
		indexNumber: {
			type: Number,
			default: 0,
		},
	})

	const className = ref()
	const chosenDiscipline = ref({ id: '', name: '' })
	const chosenSubdiscipline = ref({ id: '', name: '' })
	const chosenGradeLevel = ref({ id: '', name: '' })
	const chosenCategory = ref({ id: '', name: '' })

	const appStore = useAppStore()
	const classesStore = useClasses()
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
	function changeSubdisciplineDropdown() {
		selectedClasses.value.subdiscipline = null
		selectedClasses.value.level = null
		selectedClasses.value.category = null
		selectedClasses.value.numberOfSelections = null
		selectedClasses.value.classNumber = null
		chosenSubdiscipline.value = { id: '', name: '' }
		chosenGradeLevel.value = { id: '', name: '' }
		chosenCategory.value = { id: '', name: '' }
		className.value = ''
		classSelection.value = null

		chosenDiscipline.value = disciplines.value.find((item: any) => {
			return item.name === selectedClasses.value.discipline
		})
	}

	/**
	 * Subdisciplines
	 */
	const { result: subdisc, error: subdiscError } = useQuery(
		SUBDISCIPLINES_BY_TYPE_QUERY,
		() => ({
			disciplineId: chosenDiscipline.value.id,
			sgSlabel: props.performerType,
		}),
		{ fetchPolicy: 'network-only' }
	)
	const subdisciplines = computed(
		() => subdisc.value?.subdisciplinesByType ?? []
	)
	function changeGradeLevelDropdown() {
		selectedClasses.value.level = null
		selectedClasses.value.category = null
		selectedClasses.value.numberOfSelections = null
		selectedClasses.value.classNumber = null
		chosenGradeLevel.value = { id: '', name: '' }
		chosenCategory.value = { id: '', name: '' }
		className.value = null
		classSelection.value = null

		chosenSubdiscipline.value = subdisciplines.value.find((item: any) => {
			return item.name === selectedClasses.value.subdiscipline
		})
	}

	/**
	 * Grades / Levels
	 */
	const { result: gradeLevel, error: levelError } = useQuery(
		LEVELS_QUERY,
		() => ({
			subdisciplineId: chosenSubdiscipline.value.id,
		}),
		{ fetchPolicy: 'network-only' }
	)
	const levels = computed(() => gradeLevel.value?.levels ?? [])
	function changeCategoryDropdown() {
		selectedClasses.value.category = null
		selectedClasses.value.numberOfSelections = null
		selectedClasses.value.classNumber = null
		chosenCategory.value = { id: '', name: '' }
		className.value = null
		classSelection.value = null

		chosenGradeLevel.value = levels.value.find((item: any) => {
			return item.name === selectedClasses.value.level
		})
	}

	/**
	 * Categories
	 */
	const { result: cat, error: catError } = useQuery(
		CATEGORIES_QUERY,
		() => ({
			subdisciplineId: chosenSubdiscipline.value.id,
			levelId: chosenGradeLevel.value.id,
		}),
		{ fetchPolicy: 'network-only' }
	)
	const categories = computed(() => cat.value?.categories ?? [])
	function changeClass() {
		selectedClasses.value.numberOfSelections = null
		selectedClasses.value.classNumber = null
		chosenCategory.value = categories.value.find((item: any) => {
			return item.name === selectedClasses.value.category
		})

		// ClassName
		className.value =
			chosenSubdiscipline.value.name +
			' - ' +
			chosenGradeLevel.value.name +
			' - ' +
			chosenCategory.value.name
	}

	/**
	 * Class Number
	 */
	const { result: classSearch, error: classError } = useQuery(
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
		get: () => classSearch.value?.classSearch[0] ?? [],
		set: (newValue) => newValue,
	})

	const loading = useQueryLoading()

	/**
	 * Number of Allowed Works
	 */
	const minWorks = computed(() => {
		return classSearch.value?.classSearch[0].minSelection ?? 1
	})
	const maxWorks = computed(() => {
		return classSearch.value?.classSearch[0].maxSelection ?? 1
	})
	const numberOfAllowedWorks = computed(() => {
		if (minWorks.value === maxWorks.value) {
			return [{ id: minWorks.value, name: minWorks.value }]
		} else {
			let selections = []
			for (let i = minWorks.value; i <= maxWorks.value; i++) {
				selections.push({ id: i, name: i })
			}
			return selections
		}
	})

	/**
	 * Updating number of selections
	 */
	function addSelections(works: number) {
		classesStore.removeSelections(props.indexNumber, works)
		let currentSelections =
			classesStore.registeredClasses[props.indexNumber].selections.length
		for (let i = currentSelections; i < works; i++) {
			classesStore.addSelection(props.indexNumber)
		}
	}
</script>

<style scoped></style>
