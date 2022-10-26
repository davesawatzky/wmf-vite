<template>
	<div v-auto-animate>
		<h1 class="mt-3 mb-2">Winnipeg Music Festival</h1>
		<h2>Registration Forms</h2>
		<div class="border border-sky-500 rounded-lg text-left mt-10 md:mt-15">
			<div class="p-4">
				<h3 class="pb-3">Registering for the Winnipeg Music Festival</h3>
				<ul class="list-disc pl-5">
					<li>
						Begin registration by creating an account (account can be for an
						individual; a teacher for all their individual students, or for all
						their choirs; a parent for their family etc.)
					</li>
					<li>
						Only one teacher/discipline allowed per form. Performers with
						multiple disciplines and/or teachers require separate forms.
					</li>
					<li>
						Applications can be saved and completed/edited later before
						submission. Once submitted, applications can no longer be edited.
					</li>
					<li>
						You can view submitted entries by clicking on the 'eye' link to the
						left of the table.
					</li>
					<li>A copy can be printed for your records.</li>
				</ul>

				<!-- <p>
					You can create many different festival applications. To create the
					registration form, you will need the complete participant and teacher
					information, as well as provide the appropriate information for each
					class. Applications can be saved and edited at a later time before
					submission. Once submitted, applications can no longer be edited,
					although you will be able to return and view the summary page. For
					example, if you're a private teacher who will be submitting
					applications for your students, you can create several applications
					and submit them once all required information is complete.
				</p> -->
			</div>
			<div class="grid grid-cols-2 lg:grid-cols-4">
				<BaseCard
					label="Solo"
					:photo="soloPhoto"
					alt-text="Opera Singer on stage"
					@click="newRegistration('SOLO')">
					Solo
				</BaseCard>
				<BaseCard
					label="Group"
					:photo="groupPhoto"
					alt-text="String Instruments"
					@click="newRegistration('GROUP')">
					Solo
				</BaseCard>
				<BaseCard
					label="School"
					:photo="schoolPhoto"
					alt-text="Orff Instruments"
					@click="newRegistration('SCHOOL')">
					Solo
				</BaseCard>
				<BaseCard
					label="Community"
					:photo="communityPhoto"
					alt-text="Community Choir"
					@click="newRegistration('COMMUNITY')">
					Solo
				</BaseCard>
			</div>
		</div>
		<br />
		<h3>Submitted and In-Process Applications</h3>
		<table
			v-auto-animate
			class="bg-white table_auto border-collapse w-full text-xs sm:text-base mt-3">
			<thead class="bg-sky-600 text-white">
				<tr class="py-2 px-2">
					<th class="rounded-tl-lg">View</th>
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
				<tr
					v-for="(registration, index) in registrations"
					:key="index"
					class="">
					<td class="">
						<BaseButton
							class="text-sky-600 text-xl md:ml-4 ml-3"
							@click="
								loadRegistration(
									registration.id!,
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
					<td v-if="sm" class="">{{ registration.id }}</td>
					<td class="">{{ registration.label }}</td>
					<td v-if="lg" class="">
						{{ dateFunction(registration.createdAt) }}
					</td>
					<td class="">{{ registration.performerType }}</td>
					<td v-if="md">
						{{ dateFunction(registration.submittedAt) }}
					</td>
					<td>${{ registration.totalAmt }}.00</td>
					<td>{{ registration.confirmation }}</td>
					<td>
						<BaseButton
							v-if="!registration.confirmation"
							class="text-red-600 text-xl md:ml-4 ml-3 my-3"
							@click="deleteRegistration(registration.id!)"
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
	import soloPhoto from '@/assets/images/opera-singer-on-stage.png'
	import groupPhoto from '@/assets/images/strings.png'
	import schoolPhoto from '@/assets/images/orff-instruments.png'
	import communityPhoto from '@/assets/images/community_choir.png'
	import { Registration, EnumPerformerType } from '@/stores/userRegistration'

	type PerformerType = keyof typeof EnumPerformerType

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

	function dateFunction(date: Date | undefined) {
		if (date) {
			let dateString = date.toString()
			return DateTime.fromISO(dateString).toLocaleString(DateTime.DATETIME_MED)
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
