<template>
	<BaseSpinner v-show="loading"></BaseSpinner>
	<div class="grid grid-rows-2 grid-cols-12 gap-x-3 gap-y-4 items-start">
		<div class="col-span-3">
			<!-- <div v-if="discError">{{ discError.message }}</div> -->
			<BaseSelect
				id=""
				v-model="selectedClasses.discipline"
				label="Discipline"
				:options="disciplines"
				@change="changeSubdisciplineDropdown()" />
		</div>
		<div class="col-span-3">
			<!-- <div v-if="subdiscError">{{ subdiscError.message }}</div> -->
			<BaseSelect
				v-model="selectedClasses.subdiscipline"
				:class="selectedClasses.discipline ? '' : 'off'"
				label="Subdiscipline"
				:options="subdisciplines"
				:disabled="!selectedClasses.discipline"
				@change="changeGradeLevelDropdown()" />
		</div>
		<div class="col-span-3">
			<!-- <div v-if="levelError">{{ levelError.message }}</div> -->
			<BaseSelect
				v-model="selectedClasses.level"
				:class="selectedClasses.subdiscipline ? '' : 'off'"
				label="Grade/Level"
				:options="levels"
				:disabled="!selectedClasses.subdiscipline"
				@change="changeCategoryDropdown()" />
		</div>
		<div class="col-span-3">
			<!-- <div v-if="catError">{{ catError.message }}</div> -->
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
				:v-model="selectedClasses.classNumber"
				:value="
					selectedClasses.classNumber
						? selectedClasses.classNumber
						: (selectedClasses.classNumber = classSelection.classNumber)
				"
				label="Class Number"
				type="text"
				disabled
				aria-disabled="true" />
		</div>
		<div class="col-span-8">
			<!-- <div v-if="classError">{{ classError.message }}</div> -->
			<label for="className">Class Name</label>
			<input
				id="className"
				class="off"
				:v-model="selectedClasses.className"
				:value="
					selectedClasses.className
						? selectedClasses.className
						: (selectedClasses.className = className)
				"
				label="Class Name"
				type="text"
				disabled />
		</div>
		<div class="col-span-2">
			<BaseSelect
				v-model="selectedClasses.numberOfSelections"
				:class="selectedClasses.category ? '' : 'off'"
				label="Selections"
				:options="numberOfAllowedWorks"
				:disabled="!selectedClasses.category"
				@change="changeSelectionNumber(selectedClasses.numberOfSelections)" />
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
	import { computed, onMounted } from 'vue'
	import {
		useQueryLoading,
		useQuery,
		useLazyQuery,
	} from '@vue/apollo-composable'

	import DISCIPLINES_QUERY from '@/graphql/queries/disciplines.query.gql'
	import SUBDISCIPLINES_BY_TYPE_QUERY from '@/graphql/queries/subdisciplinesByType.query.gql'
	import LEVELS_QUERY from '@/graphql/queries/levels.query.gql'
	import CATEGORIES_QUERY from '@/graphql/queries/categories.query.gql'
	import CLASS_SEARCH_QUERY from '@/graphql/queries/classSearch.query.gql'

	import WorksSelection from './WorksSelection.vue'
	import BaseSelect from '../base/BaseSelect.vue'
	import { useClasses } from '@/stores/userClasses'
	import { useAppStore } from '@/stores/appStore'
	import BaseSpinner from '../base/BaseSpinner.vue'

	const props = defineProps({
		modelValue: {
			type: Object,
			default: () => ({}),
		},
		registrationIndexNumber: {
			type: Number,
			default: 0,
		},
	})

	const appStore = useAppStore()
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

	/**
	 * Disciplines
	 */
	const { result: disc, error: discError } = useQuery(DISCIPLINES_QUERY)
	const disciplines = computed(() => disc.value?.disciplines ?? [])
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
		selectedClasses.value.numberOfSelections = null
		selectedClasses.value.className = null
		selectedClasses.value.classNumber = null
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
			sgSlabel: appStore.performerType,
		}),
		{ fetchPolicy: 'network-only' }
	)
	const subdisciplines = computed(
		() => subdisc.value?.subdisciplinesByType ?? []
	)
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
	function changeGradeLevelDropdown() {
		selectedClasses.value.level = null
		selectedClasses.value.category = null
		selectedClasses.value.numberOfSelections = null
		selectedClasses.value.className = null
		selectedClasses.value.classNumber = null
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
		selectedClasses.value.numberOfSelections = null
		selectedClasses.value.className = null
		selectedClasses.value.classNumber = null
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
		selectedClasses.value.numberOfSelections = null
		selectedClasses.value.className = null
		selectedClasses.value.classNumber = null

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
				return classSearch.value?.classSearch[0] ?? []
			} else {
				return ''
			}
		},
		set: (newValue) => newValue,
	})
	// const chosenSelectionNumber = computed({
	// 	get: () => {
	// 		return (
	// 			classSelection.value.find((item: any) => {
	// 				return item.name === selectedClasses.value.numberOfSelections
	// 			}) ?? {}
	// 		)
	// 	},
	// 	set: (newValue) => newValue,
	// })

	const loading = useQueryLoading()

	/**
	 * Number of Allowed Works
	 */
	const minWorks = computed(() => {
		return classSearch.value?.classSearch[0].minSelection ?? null
	})
	const maxWorks = computed(() => {
		return classSearch.value?.classSearch[0].maxSelection ?? null
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
	function changeSelectionNumber(works: number) {
		classesStore.removeSelections(props.registrationIndexNumber, works)
		let currentSelections =
			classesStore.registeredClasses[props.registrationIndexNumber].selections
				.length
		for (let i = currentSelections; i < works; i++) {
			classesStore.addSelection(props.registrationIndexNumber)
		}
	}
</script>

<style scoped></style>
