<template>
	<BaseSpinner v-show="loading"></BaseSpinner>
	<div v-if="isError">Error: {{ isError.message }}</div>
	<form v-else>
		<div class="pb-8">
			<h2 class="pb-4">School Information</h2>
			<div class="grid grid-rows-1 grid-cols-12 gap-x-3 gap-y-2">
				<div class="col-span-6">
					<BaseInput
						v-model="schoolStore.name"
						name="schoolName"
						type="text"
						label="School Name" />
				</div>
				<div class="col-span-6">
					<BaseSelect
						v-model="schoolStore.division"
						name="schoolDivision"
						label="School Division"
						:options="divisions" />
				</div>
			</div>
			<contact-info
				v-model="schoolStore"
				:teacher="false"
				:schoolteacher="false"
				:school="true">
			</contact-info>

			<h2 class="pb-4">Teacher Information</h2>
			<div>
				<contact-info
					v-model="teacherStore.teacherInfo"
					:teacher="true"
					:schoolteacher="true" />
			</div>
		</div>
		<div class="grid grid-rows-1 grid-cols-12 gap-x-3 gap-y-2 items-center">
			<div class="col-span-6">
				<BaseInput
					v-model="schoolStore.earliestTime"
					name="earliestTime"
					label="Earliest time your group can perform"
					type="time" />
			</div>

			<div class="col-span-6">
				<BaseInput
					v-model="schoolStore.latestTime"
					name="latestTime"
					label="Latest time your group can perform"
					type="time" />
			</div>
		</div>
		<div class="grid grid-rows-2 grid-cols-12 gap-x-3 gap-y-2">
			<div class="col-span-12">
				<!-- Change dates below into constants -->
				<p>
					List any date/time when you are unavailable for performance, including
					school in-service days, using <strong>calendar dates</strong>, not
					school cycle days, between February 23 and March 20, 2023.
				</p>
				<BaseTextarea
					v-model="schoolStore.unavailable"
					name="unavailable"
					label="Unavailable Dates/Times"
					rows="5"></BaseTextarea>
			</div>
			<div class="col-span-12">
				<p>
					If there are any students in your group participating in other
					festival classes, list the students' names so that we can do our best
					to avoid scheduling conflicts:
				</p>
				<BaseTextarea
					v-model="schoolStore.conflictStudents"
					name="conflictStudents"
					label="Students participating in other classes."
					rows="5"></BaseTextarea>
			</div>
		</div>
	</form>
</template>

<script lang="ts" setup>
	import { ref } from 'vue'
	import { useAppStore } from '@/stores/appStore'
	import { useSchool } from '@/stores/userSchool'
	import { useTeacher } from '@/stores/userTeacher'
	import { useForm } from 'vee-validate'
	import * as yup from 'yup'

	const appStore = useAppStore()
	const teacherStore = useTeacher()
	const schoolStore = useSchool()

	const divisions = ref([
		{ name: 'Pembina Trails School Division', id: '1' },
		{ name: 'Winnipeg School Division', id: '2' },
		{ name: 'Louis Riel School Division', id: '3' },
		{ name: 'St. James-Assiniboia School Division', id: '4' },
		{ name: 'Seven Oaks School Division', id: '5' },
		{ name: 'River East-Transcona School Division', id: '6' },
	])

	const validationSchema = yup.object({
		schoolName: yup
			.string()
			.trim()
			.nullable()
			.required('Enter the name of the school'),
		schoolDivision: yup
			.string()
			.trim()
			.nullable()
			.required('Enter the name of the school divison'),
		earliestTime: yup.string().nullable().required('Enter a time'),
		latestTime: yup.string().nullable().required('Enter a time'),
		unavailable: yup.string().trim().nullable(),
		conflictStudents: yup.string().trim().nullable(),
	})

	useForm({ validationSchema })
</script>

<style scoped></style>
