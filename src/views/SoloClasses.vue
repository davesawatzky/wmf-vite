<template>
	<!-- Solo Class Information Page -->
	<div v-auto-animate>
		<h2 class="pt-8">Solo Class Information</h2>
		<div>
			<BaseSelect
				v-model="appStore.disciplineName"
				label="Discipline"
				:options="disciplines"></BaseSelect>
		</div>

		<div
			v-for="(selectedClass, classIndex) in classesStore.registeredClasses"
			:key="classIndex">
			<div class="py-4">
				<h3 class="pb-4">Class {{ classIndex + 1 }}</h3>
				<Class
					v-model="classesStore.registeredClasses[classIndex]"
					:class-index="classIndex" />
			</div>
			<div class="pt-4">
				<BaseButton
					v-if="
						classIndex + 1 === classesStore.registeredClasses.length
							? true
							: false
					"
					class="btn btn-blue mb-6"
					@click="addClass(registrationStore.registrationId)"
					>Add Class
				</BaseButton>
				<BaseButton
					v-if="classesStore.registeredClasses.length > 1 ? true : false"
					id="index"
					class="btn btn-red mb-6"
					@click="
						removeClass(
							classIndex,
							classesStore.registeredClasses[classIndex].id!
						)
					"
					>Remove Class</BaseButton
				>
				<br /><br />
				<svg viewBox="0 0 800 2">
					<line x1="0" x2="800" stroke="black" />
				</svg>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { computed, onBeforeMount } from 'vue'
	import { useQuery } from '@vue/apollo-composable'
	import { useClasses } from '@/stores/userClasses'
	import { useAppStore } from '@/stores/appStore'
	import { useRegistration } from '@/stores/userRegistration'
	import DISCIPLINES_BY_TYPE_QUERY from '@/graphql/queries/DisciplinesByType.query.gql'

	const classesStore = useClasses()
	const registrationStore = useRegistration()
	const appStore = useAppStore()

	onBeforeMount(() => {
		appStore.disciplineName = classesStore.registeredClasses[0].discipline
	})

	function addClass(registrationId: string) {
		classesStore.createClass(registrationId)
	}
	function removeClass(classIndex: number, classId: string) {
		classesStore.deleteClass(classIndex, classId)
	}

	/**
	 * Disciplines
	 */
	const { result: disc, error: discError } = useQuery(
		DISCIPLINES_BY_TYPE_QUERY,
		() => ({ sgSlabel: appStore.performerType })
	)
	const disciplines = computed(() => disc.value?.disciplinesByType ?? [])
	const chosenDiscipline = computed(() => {
		return (
			disciplines.value.find((item: any) => {
				return item.name === appStore.disciplineName
			}) ?? {}
		)
	})
	function changeDiscipline() {
		appStore.disciplineId = chosenDiscipline.value.id
		async function deleteAllClassesButOne() {
			let numberOfClasses = classesStore.registeredClasses.length
			let registeredClassId = ''
			for (let i = 1; i < numberOfClasses; i++) {
				registeredClassId = classesStore.registeredClasses[0].id!
				await classesStore.deleteClass(0, registeredClassId)
			}
			// await classesStore.createClass()
		}
		deleteAllClassesButOne().then(() => {
			classesStore.registeredClasses[0].subdiscipline = ''
			classesStore.registeredClasses[0].level = ''
			classesStore.registeredClasses[0].category = ''
			classesStore.registeredClasses[0].numberOfSelections = 0
			classesStore.registeredClasses[0].className = ''
			classesStore.registeredClasses[0].classNumber = ''
		})
	}
</script>

<style scoped></style>
