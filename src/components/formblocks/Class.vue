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
				@change="changeSubdisciplineDropdown()"
			/>
		</div>
		<div class="col-span-2">
			<div v-if="subdiscError">{{ subdiscError.message }}</div>
			<BaseSelect
				v-model="selectedClasses.subdiscipline"
				label="Subdiscipline"
				:options="subdisciplines"
				:disabled="!selectedClasses.discipline"
				@change="changeGradeLevelDropdown()"
			/>
		</div>
		<div class="col-span-4">
			<div v-if="levelError">{{ levelError.message }}</div>
			<BaseSelect
				v-model="selectedClasses.level"
				label="Grade/Level"
				:options="levels"
				:disabled="!selectedClasses.subdiscipline"
				@change="changeCategoryDropdown()"
			/>
		</div>
		<div class="col-span-4">
			<div v-if="catError">{{ catError.message }}</div>
			<BaseSelect
				v-model="selectedClasses.category"
				label="Category"
				:options="categories"
				:disabled="!selectedClasses.level"
				@change="changeClass()"
			/>
		</div>
		<div class="col-span-2">
			<label for="classNumber">Class Number</label>
			<input
				id="classNumber"
				class="off"
				:v-model="selectedClasses.classNumber"
				:value="classSelection.classNumber"
				label="Class Number"
				type="text"
				disabled
				aria-disabled="true"
			/>
		</div>
		<div class="col-span-8">
			<div v-if="classError">{{ classError.message }}</div>
			<label for="className">Class Name</label>
			<input
				id="className"
				class="off"
				label="Class Name"
				type="text"
				disabled
				:value="className"
			/>
		</div>
		<!-- <div class="col-span-2">
			<BaseSelect
				v-if="numberOfAllowedWorks.length > 1"
				v-model="selectedClasses.numberOfWorks"
				label="Number of Selections"
				:selected="numberOfAllowedWorks[0].name"
				:options="numberOfAllowedWorks"
				@change="changeSelections()"
			/>
		</div> -->
		<div class="col-span-12">
			<WorksSelection
				v-for="(selection, index) in selectedClasses.selections"
				:key="index"
				v-model="selectedClasses.selections[index]"
				:work-number="index"
			/>
		</div>
	</div>
</template>

<script lang="ts" setup>
	import { computed, ref } from 'vue'
	import { useQuery, useQueryLoading } from '@vue/apollo-composable'

	import DISCIPLINES_QUERY from '@/graphql/queries/disciplines.query.gql'
	import SUBDISCIPLINES_QUERY from '@/graphql/queries/subdisciplines.query.gql'
	import LEVELS_QUERY from '@/graphql/queries/levels.query.gql'
	import CATEGORIES_QUERY from '@/graphql/queries/categories.query.gql'
	import CLASS_SEARCH_QUERY from '@/graphql/queries/classSearch.query.gql'

	import WorksSelection from './WorksSelection.vue'
	import BaseSelect from '../base/BaseSelect.vue'
	// import { useClasses } from '@/stores/userClasses'
	// import { useAppStore } from '@/stores/appStore'

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

	const chosenDiscipline = ref({ id: '', name: '' })
	const chosenSubdiscipline = ref({ id: '', name: '' })
	const chosenGradeLevel = ref({ id: '', name: '' })
	const chosenCategory = ref({ id: '', name: '' })

	// const appStore = useAppStore()
	// const classesStore = useClasses()
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
		selectedClasses.value.numberOfWorks = null
		selectedClasses.value.classNumber = null
		// classSelection.value.classNumber = ''
		// className.value = null

		chosenDiscipline.value = disciplines.value.find((item: any) => {
			return item.name === selectedClasses.value.discipline
		})
	}
	/**
	 * Subdisciplines
	 */
	const { result: subdisc, error: subdiscError } = useQuery(
		SUBDISCIPLINES_QUERY,
		() => ({
			disciplineId: chosenDiscipline.value.id,
		})
	)
	const subdisciplines = computed(() => subdisc.value?.subdisciplines ?? [])
	function changeGradeLevelDropdown() {
		selectedClasses.value.level = null
		selectedClasses.value.category = null
		selectedClasses.value.numberOfWorks = null
		selectedClasses.value.classNumber = null
		// classSelection.value.classNumber = null
		// className.value = null

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
		})
	)
	const levels = computed(() => gradeLevel.value?.levels ?? [])
	function changeCategoryDropdown() {
		selectedClasses.value.category = null
		selectedClasses.value.numberOfWorks = null
		selectedClasses.value.classNumber = null
		// classSelection.value.classNumber = null
		// className.value = null

		chosenGradeLevel.value = levels.value.find((item: any) => {
			return item.name === selectedClasses.value.level
		})
	}
	/**
	 * Categories
	 */
	const { result: cat, error: catError } = useQuery(CATEGORIES_QUERY, () => ({
		subdisciplineId: chosenSubdiscipline.value.id,
		levelId: chosenGradeLevel.value.id,
	}))
	const categories = computed(() => cat.value?.categories ?? [])
	function changeClass() {
		selectedClasses.value.numberOfWorks = null
		selectedClasses.value.classNumber = null
		// classSelection.value.classNumber = null
		// className.value = null

		chosenCategory.value = categories.value.find((item: any) => {
			return item.name === selectedClasses.value.category
		})
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
		})
	)
	const classSelection = computed({
		get: () => classSearch.value?.classSearch[0] ?? [],
		set: (newValue) => (classSearch.value = newValue),
	})

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
	// const numberOfAllowedWorks = computed(() => {
	// 	let min: number = classSearch.value?.classSearch[0].minSelection ?? 1
	// 	let max: number = classSearch.value?.classSearch[0].maxSelection ?? 1
	// 	let numberOfWorks = []
	// 	for (let i = min; i <= max; i++) {
	// 		numberOfWorks.push({ id: i, name: i })
	// 	}
	// 	return numberOfWorks
	// })
</script>

<style scoped></style>
