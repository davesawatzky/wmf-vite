<template>
	<!-- Solo Class Information Page -->
	<div v-auto-animate>
		<h2 class="pt-8">Solo Class Information</h2>
		<div>
			<BaseSelect
				v-model="registrationStore.registrations[0].discipline"
				label="Discipline"
				:options="disciplines"></BaseSelect>
		</div>
		{{ registrationStore.registrations[0].discipline }}
		{{ chosenDiscipline.id }}
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
	import { computed, watch } from 'vue'
	import { useQuery } from '@vue/apollo-composable'
	import { useClasses } from '@/stores/userClasses'
	import { useAppStore } from '@/stores/appStore'
	import { useRegistration } from '@/stores/userRegistration'
	import DISCIPLINES_BY_TYPE_QUERY from '@/graphql/queries/DisciplinesByType.query.gql'

	const classesStore = useClasses()
	const registrationStore = useRegistration()
	const appStore = useAppStore()

	function addClass(registrationId: string) {
		classesStore.createClass(registrationId)
	}
	function removeClass(classIndex: number, classId: string) {
		classesStore.deleteClass(classIndex, classId)
	}

	/**
	 * Disciplines
	 * Drop Down Menu selections
	 */
	const { result: disc, error: discError } = useQuery(
		DISCIPLINES_BY_TYPE_QUERY,
		() => ({ sgSlabel: appStore.performerType })
	)
	const disciplines = computed(() => disc.value?.disciplinesByType ?? [])
	const chosenDiscipline = computed(() => {
		return disciplines.value.find((item: any) => {
			// Sets the discipline name in the registration store
			return item.name === registrationStore.registrations[0].discipline ?? []
		})
	})
	watch(chosenDiscipline, (newValue) => {
		appStore.disciplineId = newValue.id
		console.log('newValue: ' + newValue.name, newValue.id)
	})

	// Sets the discipline id in the appStore
	/**
	 * Adds the chosen discipline id to the appStore for use.
	 */
	// function changeDiscipline() {
	// 	appStore.disciplineId = chosenDiscipline.value?.id ?? ''
	// }
</script>

<style scoped></style>
