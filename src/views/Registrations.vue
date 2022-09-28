<template>
	<div v-if="error">Error: {{ error.message }}</div>
	<div v-else>
		<div class="border border-gray-300 rounded-lg text-center mt-20">
			<h3>Create new Registration Form</h3>
			<BaseButton class="btn btn-blue" @click="newRegistration('SOLO')"
				>Solo</BaseButton
			>
			<BaseButton class="btn btn-blue" @click="newRegistration('GROUP')"
				>Group</BaseButton
			>
			<BaseButton class="btn btn-blue" @click="newRegistration('SCHOOL')"
				>School</BaseButton
			>
			<BaseButton class="btn btn-blue" @click="newRegistration('COMMUNITY')"
				>Community Group</BaseButton
			>
		</div>
		<br /><br />
		<table>
			<thead>
				<tr>
					<th>Edit</th>
					<th>Type</th>
					<th>ID</th>
					<th>Created</th>
					<th>Label</th>
					<th>Type</th>
					<th>Submitted</th>
					<th>Payed Amount</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(registration, index) in registrations" :key="index">
					<td>
						<BaseButton
							class="btn btn-blue"
							@click="
								loadRegistration(
									registration.id,
									registration.performerType,
									index
								)
							"
							>Edit</BaseButton
						>
					</td>
					<td v-for="col in registration" :key="registration.id + col">
						{{ col }}
					</td>
					<td>
						<BaseButton
							class="btn btn-red"
							@click="deleteRegistration(registration.id)"
							>Delete</BaseButton
						>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script lang="ts" setup>
	import { computed, onBeforeMount, ref } from 'vue'
	import { useQuery } from '@vue/apollo-composable'
	import REGISTRATION_QUERY from '@/graphql/queries/Registrations.query.gql'
	import { useRouter } from 'vue-router'
	import { useRegistration } from '@/stores/userRegistration'
	import { useAppStore } from '@/stores/appStore'
	import { usePerformers } from '@/stores/userPerformer'
	import { useTeacher } from '@/stores/userTeacher'
	import { useClasses } from '@/stores/userClasses'
	import { useGroup } from '@/stores/userGroup'
	import { useSchool } from '@/stores/userSchool'
	import { useCommunity } from '@/stores/userCommunity'
	import BaseButton from '@/components/base/BaseButton.vue'

	enum EnumPerformerType {
		'SOLO',
		'GROUP',
		'SCHOOL',
		'COMMUNITY',
	}
	type PerformerType = keyof typeof EnumPerformerType

	interface Registration {
		id: string
		label: string
		performerType: keyof typeof EnumPerformerType
		submittedAt: string
		totalAmt: number
		payedAmt: number
		transactionInfo: string
		confirmation: string
		createdAt?: string
		__typename?: string
	}

	const registrationStore = useRegistration()
	const appStore = useAppStore()
	const performerStore = usePerformers()
	const teacherStore = useTeacher()
	const groupStore = useGroup()
	const schoolStore = useSchool()
	const communityStore = useCommunity()
	const classesStore = useClasses()
	const registrationId = ref('')
	const registrations = ref({} as Registration[])

	onBeforeMount(() => {
		registrationStore.$reset()
		appStore.$reset()
		performerStore.$reset()
		teacherStore.$reset()
		groupStore.$reset()
		communityStore.$reset()
		schoolStore.$reset()
		classesStore.$reset()
	})

	const router = useRouter()

	const {
		refetch: refetchRegistrations,
		onResult: doneRegistrationQuery,
		onError,
	} = useQuery(REGISTRATION_QUERY, null, () => ({
		fetchPolicy: 'no-cache',
	}))
	// const registrations = computed(() => result.value?.registrations ?? [])
	doneRegistrationQuery((result) => {
		let clone = Object.assign({}, result.data.registrations)
		registrations.value = clone
	})

	/**
	 * Load and Edit Existing Registration
	 *
	 * @param registrationId The ID of the registration form
	 * @param performerType SOLO, GROUP, SCHOOL, or COMMUNITY
	 * @param index Array Index of retrieved registrations
	 */
	async function loadRegistration(
		registrationId: string,
		performerType: PerformerType,
		index: number
	) {
		registrationStore.registrationId = registrationId
		registrationStore.addToStore(registrations.value[index])
		switch (performerType) {
			case 'SOLO':
				appStore.performerType = 'SOLO'
				await performerStore.loadPerformers(registrationId)
				await teacherStore.loadTeacher(registrationId)
				await classesStore.loadClasses(registrationId)
				break
			case 'GROUP':
				appStore.performerType = 'GROUP'
				await groupStore.loadGroup(registrationId)
				await teacherStore.loadTeacher(registrationId)
				await performerStore.loadPerformers(registrationId)
				await classesStore.loadClasses(registrationId)
				break
			case 'SCHOOL':
				appStore.performerType = 'SCHOOL'
				await schoolStore.loadSchool(registrationId)
				await teacherStore.loadTeacher(registrationId)
				await classesStore.loadClasses(registrationId)
				break
			case 'COMMUNITY':
				appStore.performerType = 'COMMUNITY'
				await communityStore.loadCommunity(registrationId)
				await teacherStore.loadTeacher(registrationId)
				await classesStore.loadClasses(registrationId)
				break
		}
		classesStore.loadClasses(registrationId)
		router.push({ name: 'Form' })
	}

	/**
	 * Creates a new registration in the registration form.
	 *
	 * @param performerType SOLO, GROUP, SCHOOL or COMMUNITY
	 * @param label A given label for the registration form
	 */
	async function newRegistration(performerType: PerformerType, label?: string) {
		if (!label || label.length == 0) label = 'Registration Form'
		await registrationStore.createRegistration(performerType, label)
		registrationId.value = registrationStore.registrationId

		appStore.$patch({
			editExisting: false,
			performerType,
			registrationExists: true,
		})
		switch (performerType) {
			case 'SOLO':
				appStore.performerType = 'SOLO'
				await performerStore.createPerformer(registrationId.value)
				await teacherStore.createTeacher(registrationId.value)
				await classesStore.createClass(registrationId.value)
				break
			case 'GROUP':
				appStore.performerType = 'GROUP'
				await groupStore.createGroup(registrationId.value)
				await teacherStore.createTeacher(registrationId.value)
				await performerStore.createPerformer(registrationId.value)
				await classesStore.createClass(registrationId.value)
				break
			case 'SCHOOL':
				appStore.performerType = 'SCHOOL'
				await schoolStore.createSchool(registrationId.value)
				await teacherStore.createTeacher(registrationId.value)
				await classesStore.createClass(registrationId.value)
				break
			case 'COMMUNITY':
				appStore.performerType = 'COMMUNITY'
				await communityStore.createCommunity(registrationId.value)
				await teacherStore.createTeacher(registrationId.value)
				await classesStore.createClass(registrationId.value)
		}

		router.push({ name: 'Form' })
	}

	async function deleteRegistration(regId: string) {
		await registrationStore.deleteRegistration(regId)
		refetchRegistrations()
	}
</script>

<style scoped>
	table {
		border-radius: 20px;
		overflow: hidden;
		border-collapse: collapse;
	}

	thead {
		background-color: blue;
		color: #fff;
	}
	tr {
		border-bottom: 1px solid #c1c1c1;
	}

	td,
	th {
		padding: 7px 10px;
	}
</style>
