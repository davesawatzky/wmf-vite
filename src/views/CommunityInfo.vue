<template>
	<BaseSpinner v-show="loading"></BaseSpinner>
	<div v-if="isError">Error: {{ isError.message }}</div>
	<form v-else>
		<div class="pb-8">
			<h2 class="pb-4">Community Group Information</h2>
			<div>
				<BaseInput
					v-model="communityStore.group.name"
					name="name"
					type="text"
					label="Community Group Name" />
			</div>
			<div>
				<BaseInput
					v-model="communityStore.group.groupSize"
					name="groupSize"
					type="number"
					label="Group Size" />
			</div>
			<div>
				<BaseInput
					v-model="communityStore.group.chaperones"
					name="numberOfChaperones"
					type="number"
					label="Number of chaperones" />
			</div>
			<div>
				<BaseInput
					v-model="communityStore.group.wheelchairs"
					name="numberOfWheelchairs"
					type="number"
					label="Number of wheelchairs" />
			</div>
			<h2 class="pb-4">Conductor/Contact Information</h2>
			<div>
				<contact-info v-model="teacherStore.teacherInfo" />
			</div>
		</div>
		<div class="grid grid-rows-1 grid-cols-12 gap-x-3 gap-y-2 items-start">
			<div class="col-span-12">
				<p>
					If there are any performers in the group participating in other
					festival classes, list the performers' names so that we can do our
					best to avoid scheduling conflicts:
				</p>
				<BaseTextarea
					v-model="communityStore.group.conflictPerformers"
					name="conflictPerformers"
					label="Performers participating in other classes."
					rows="5"></BaseTextarea>
			</div>
		</div>
	</form>
</template>

<script lang="ts" setup>
	import { useAppStore } from '@/stores/appStore'
	import { useCommunity } from '@/stores/userCommunity'
	import { useTeacher } from '@/stores/userTeacher'
	import * as yup from 'yup'
	import { useField, useForm } from 'vee-validate'
	import BaseTextarea from '@/components/base/BaseTextarea.vue'

	const appStore = useAppStore()
	const teacherStore = useTeacher()
	const communityStore = useCommunity()

	const validationSchema = yup.object({
		name: yup.string().trim().required('Enter a name for the community group'),
		groupSize: yup
			.number()
			.integer()
			.nullable()
			.required('Give the size of the group'),
		numberOfChaperones: yup
			.number()
			.integer()
			.nullable()
			.required('Indicate the number of chaperones'),
		numberOfWheelchairs: yup
			.number()
			.integer()
			.nullable()
			.required('Indicate the number of wheelchairs'),
		conflictPerformers: yup.string().trim().nullable(),
	})

	useForm({
		validationSchema,
	})
</script>

<style scoped></style>
