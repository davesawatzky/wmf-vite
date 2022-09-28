<template>
	<form>
		<div class="pb-8">
			<h2 class="pb-4">Group Information</h2>
			<div>
				<BaseInput
					v-model="groupStore.groupInfo.name"
					name="groupname"
					label="Group Name"
					type="text" />
			</div>
			<div>
				<BaseInput
					v-model="groupStore.groupInfo.numberOfPerformers"
					:value="
						(groupStore.groupInfo.numberOfPerformers =
							performerStore.numberOfPerformers)
					"
					disabled
					class="off"
					aria-disabled
					name="numberOfPerformers"
					label="Number of Performers"
					type="number" />
			</div>

			<h3>Group Type</h3>
			<div>
				<BaseRadioGroup
					v-model="groupStore.groupInfo.groupType"
					name="groupType"
					:options="typeOptions" />
			</div>

			<div class="pb-8">
				<h3 class="pb-4">Teacher Information</h3>
				<ContactInfo v-model="teacherStore.teacherInfo" teacher />
			</div>
			<h3>Performer Information</h3>
			<div
				v-for="(person, personIndex) in performerStore.performer"
				:key="personIndex">
				<div class="pb-8">
					<h4 class="pb-4">Performer #{{ personIndex + 1 }}</h4>
					<ContactInfo
						v-model="performerStore.performer[personIndex]"
						groupperformer />
				</div>
				<div class="pt-4">
					<BaseButton
						v-if="
							personIndex + 1 === performerStore.performer.length ? true : false
						"
						class="btn btn-blue"
						@click="addPerformer"
						>Add Performer
					</BaseButton>
					<BaseButton
						v-if="performerStore.performer.length > 1 ? true : false"
						id="index"
						class="btn btn-red"
						@click="removePerformer(personIndex)"
						>Remove Performer</BaseButton
					>
					<br /><br />
					<svg viewBox="0 0 800 2">
						<line x1="0" x2="800" stroke="black" />
					</svg>
				</div>
			</div>
		</div>
	</form>
</template>

<script setup lang="ts">
	// import { ref, reactive, computed, watch } from 'vue'
	import { useTeacher } from '@/stores/userTeacher'
	import { useGroup } from '@/stores/userGroup'
	import { usePerformers } from '@/stores/userPerformer'
	import { useRegistration } from '@/stores/userRegistration'
	import { useForm, useField } from 'vee-validate'
	import * as yup from 'yup'

	const registrationStore = useRegistration()
	const teacherStore = useTeacher()
	const groupStore = useGroup()
	const performerStore = usePerformers()

	async function addPerformer() {
		await performerStore.createPerformer(registrationStore.registrationId)
	}
	async function removePerformer(index: number) {
		await performerStore.deletePerformer(performerStore.performer[index].id!)
	}

	const typeOptions = [
		{
			label: 'Vocal Group',
			description: 'Duets, Trios, Quartets, and Ensembles',
			value: 'vocal',
		},
		{
			label: 'Instrumental Group',
			description: 'Duets, Trios, Ensembles, and Chamber Groups',
			value: 'instrumental',
		},
		{
			label: 'Mixed Group',
			description:
				'Mixed instrument chamber groups which include both instruments and voice.  Includes class 1945, "Family and/or Friends"',
			value: 'mixed',
		},
	]

	const validationSchema = yup.object({
		groupname: yup.string().trim().required('Enter a group name'),
		numberOfPerformers: yup
			.number()
			.integer('Only whole numbers')
			.positive('Must be a positive number')
			.nullable()
			.required('Enter number of performers'),
		instrument: yup.string().trim().nullable().required(),
		level: yup.string().max(20).nullable().required(),
		otherClasses: yup.string().nullable(),
	})

	// const validateGroupType = {
	// 	groupType: (value: any) => {
	// 		if (value) {
	// 			return true
	// 		}
	// 		return 'Please select a group type'
	// 	},
	// }
	// const { value: groupType, errorMessage } = useField(
	// 	'groupStore.groupInfo.groupType',
	// 	validateGroupType
	// )

	useForm({ validationSchema })
</script>

<style scoped></style>
