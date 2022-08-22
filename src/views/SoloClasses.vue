<template>
	<!-- Solo Class Information Page -->
	<div class="pb-8">
		<h2 class="pb-4">Solo Class Information</h2>
		<div v-if="loading" class="lds-overlay">
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
		</div>
		<div v-else-if="isError">Error: {{ isError.message }}</div>
		<div
			v-for="(selectedClass, index) in classesStore.registeredClasses"
			v-else
			:key="index"
		>
			<div class="pb-8">
				<h3 class="pb-4">Class {{ index + 1 }}</h3>
				<Class v-model="classesStore.registeredClasses[index]" />
			</div>
			<div class="pt-4">
				<BaseButton
					v-if="
						index + 1 === classesStore.registeredClasses.length ? true : false
					"
					class="btn btn-blue"
					@click="addClass()"
					>Add Class
				</BaseButton>
				<BaseButton
					v-if="classesStore.registeredClasses.length > 1 ? true : false"
					id="index"
					class="btn btn-red"
					@click="removeClass(index)"
					>Remove Class</BaseButton
				>
				<br /><br />
				<svg viewBox="0 0 800 2">
					<line x1="0" x2="800" stroke="black" />
				</svg>
			</div>
		</div>
	</div>

	<BaseRouteButton type="button" to="SoloContactInfo" class="btn btn-blue"
		>Previous</BaseRouteButton
	>
	<BaseRouteButton type="button" to="Summary" class="btn btn-blue"
		>Next</BaseRouteButton
	>
</template>

<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { useQuery, useQueryLoading } from '@vue/apollo-composable'
	import { useClasses } from '@/stores/userClasses'
	import { useAppStore } from '@/stores/appStore.js'
	// import { useRegistration } from '@/stores/userRegistration'
	import SOLO_CLASSES_QUERY from '../graphql/queries/soloClassesQuery.query.gql'

	const appStore = useAppStore()
	const classesStore = useClasses()
	// const registrationStore = useRegistration()
	const loading = useQueryLoading()

	let isError = ref()
	const isResult = ref(false)

	const queryVariables = ref({
		registrationId: appStore.registrationId,
	})

	/**
	 *
	 * Query existing class information on first load
	 *
	 */
	if (appStore.editExisting && !appStore.classContentLoaded) {
		const { error, onResult } = useQuery(SOLO_CLASSES_QUERY, queryVariables)
		isError = computed(() => error.value)

		onResult((result) => {
			isResult.value = true

			if (appStore.editExisting) {
				classesStore.$patch({ registrationId: appStore.registrationId })
				classesStore.addClassToStore()

				// Each registration form can have multiple registered classes
				// with multiple selected works
				result.data.registration.registeredClasses.forEach(
					(classInfo: any, classIndex: number) => {
						classesStore.$patch((state: any) => {
							state.registeredClasses[classIndex] = { ...classInfo }

							// classInfo.selections.forEach(
							// 	(classSelections: any, selectionsIndex: number) => {
							// 		classesStore.addSelectionToStore(classIndex)
							// 		classesStore.$patch((state: any) => {
							// 			state.registeredClasses[classIndex].selections[
							// 				selectionsIndex
							// 			] = {
							// 				...classSelections,
							// 			}
							// 		})
							// 	}
							// )
						})
					}
				)
			}

			appStore.$patch({ classContentLoaded: true })
		})
	} else {
		addClass()
	}

	// Button functions

	function addClass() {
		classesStore.addClassToStore()
	}
	function removeClass(id: number) {
		classesStore.removeClass(id)
	}
</script>

<style scoped></style>
