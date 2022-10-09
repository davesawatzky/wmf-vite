<template>
	<div v-auto-animate>
		<div class="border border-sky-500 rounded-lg text-center mt-5 md:mt-20">
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
				>Community</BaseButton
			>
		</div>
		<br /><br />
		<table
			v-auto-animate
			class="bg-white table_auto border-collapse w-full text-xs sm:text-base">
			<thead class="bg-sky-500 text-white">
				<tr class="py-2 px-4">
					<th class="rounded-tl-lg">Edit</th>
					<th v-if="sm">ID</th>
					<th>Label</th>
					<th v-if="lg">Created</th>
					<th>Type</th>
					<th v-if="md">Submitted</th>
					<th>Total</th>
					<th>Conf. #</th>
					<th class="rounded-tr-lg">Del</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(registration, index) in registrations" :key="index">
					<td>
						<BaseButton
							class="text-sky-600 sm:ml-4 ml-3"
							@click="
								loadRegistration(
									registration.id,
									registration.performerType,
									index
								)
							"
							><font-awesome-icon
								v-if="!registration.confirmation"
								icon="fa-solid fa-file-pen" />
							<font-awesome-icon v-else icon="fa-solid fa-eye"
						/></BaseButton>
					</td>
					<td v-if="sm">{{ registration.id }}</td>
					<td>{{ registration.label }}</td>
					<td v-if="lg">
						{{ dateFunction(registration.createdAt) }}
					</td>
					<td>{{ registration.performerType }}</td>
					<td v-if="md">
						{{ dateFunction(registration.submittedAt) }}
					</td>
					<td>${{ registration.totalAmt }}.00</td>
					<td>{{ registration.confirmation }}</td>
					<td>
						<BaseButton
							v-if="!registration.confirmation"
							class="text-red-600 ml-4"
							@click="deleteRegistration(registration.id)"
							><font-awesome-icon icon="fa-regular fa-trash-can"
						/></BaseButton>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script lang="ts" setup>
	import { DateTime } from 'luxon'
	import { useMediaQuery } from '@vueuse/core'
	import { onBeforeMount, ref } from 'vue'
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
		submittedAt?: string
		totalAmt: number
		payedAmt: number
		transactionInfo: string
		confirmation: string
		createdAt: string
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

	const sm = useMediaQuery('(min-width: 640px)')
	const md = useMediaQuery('(min-width: 768px)')
	const lg = useMediaQuery('(min-width: 1024px)')

	function dateFunction(date: string) {
		if (date) {
			return DateTime.fromISO(date).toLocaleString(DateTime.DATETIME_MED)
		}
	}

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

	const { refetch: refetchRegistrations, onResult: doneRegistrationQuery } =
		useQuery(REGISTRATION_QUERY, null, () => ({
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
				await communityStore.loadCommunities(registrationId)
				await teacherStore.loadTeacher(registrationId)
				await classesStore.loadClasses(registrationId)
				break
			case 'COMMUNITY':
				appStore.performerType = 'COMMUNITY'
				await communityStore.loadCommunities(registrationId)
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
				await communityStore.createCommunity(registrationId.value)
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
	th {
		@apply py-1 px-4;
	}

	td {
		@apply px-2 py-1 border-b border-slate-300;
	}
</style>
