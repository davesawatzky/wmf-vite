<template>
	<form>
		<div class="pt-8">
			<div>
				<h2 class="pb-4">Performer Information</h2>
				<div v-if="performerStore.performer[0]">
					<ContactInfo v-model="performerStore.performer[0]" />
				</div>
				<div class="pt-4">
					<BaseTextarea :label="textAreaLabel" />
				</div>
			</div>
			<div>
				<BaseSelect
					v-model="appStore.disciplineName"
					label="Discipline"
					:options="disciplines"></BaseSelect>
			</div>
			<div class="pt-8">
				<h2 class="pb-4">Teacher Information</h2>
				<div>
					<contact-info v-model="teacherStore.teacherInfo" teacher />
				</div>
			</div>
		</div>
	</form>
</template>

<script lang="ts" setup>
	import { computed } from 'vue'
	import { useQuery } from '@vue/apollo-composable'
	import { textAreaLabel } from '@/composables/formData'
	import { usePerformers } from '@/stores/userPerformer'
	import { useAppStore } from '@/stores/appStore'
	import { useTeacher } from '@/stores/userTeacher'
	import DISCIPLINES_BY_TYPE_QUERY from '@/graphql/queries/DisciplinesByType.query.gql'

	const appStore = useAppStore()
	const performerStore = usePerformers()
	const teacherStore = useTeacher()

	/**
	 * Disciplines
	 */
	const { result: disc, error: discError } = useQuery(
		DISCIPLINES_BY_TYPE_QUERY,
		() => ({ sgSlabel: appStore.performerType })
	)
	const disciplines = computed(() => disc.value?.disciplinesByType ?? [])
</script>

<style lang="scss" scoped></style>
