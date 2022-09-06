<template>
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
	<div v-else-if="error">Error: {{ error.message }}</div>

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
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script lang="ts" setup>
	import { computed, onBeforeMount } from 'vue'

	import { useQuery, useQueryLoading } from '@vue/apollo-composable'
	import REGISTRATION_QUERY from '@/graphql/queries/registrations.query.gql'
	import SOLO_CONTACT_INFO_QUERY from '@/graphql/queries/soloContactInfo.query.gql'
	import REGISTERED_CLASSES_QUERY from '@/graphql/queries/registeredClassesQuery.query.gql'
	import { useRouter } from 'vue-router'
	import routePerformerType from '@/composables/routePerformerType'
	import { useRegistration } from '@/stores/userRegistration'
	import { useAppStore } from '@/stores/appStore'
	import { usePerformers } from '@/stores/userPerformer'
	import { useTeacher } from '@/stores/userTeacher'
	import { useClasses } from '@/stores/userClasses'
	import { useGroup } from '@/stores/userGroup'

	const registrationStore = useRegistration()
	const appStore = useAppStore()
	const performerStore = usePerformers()
	const teacherStore = useTeacher()
	const groupStore = useGroup()
	const classesStore = useClasses()

	onBeforeMount(() => {
		registrationStore.$reset()
		appStore.$reset()
		performerStore.$reset()
		teacherStore.$reset()
		groupStore.$reset()
		classesStore.$reset()
	})

	const router = useRouter()
	const loading = useQueryLoading()

	const { result, error } = useQuery(REGISTRATION_QUERY)
	const registrations = computed(() => result.value?.registrations ?? [])

	/**
	 * Load and Edit Existing Registration
	 *
	 * @param registrationId The ID of the registration form
	 * @param performerType SOLO, GROUP, or SCHOOL,
	 * @param index Array Index of retrieved registrations
	 */
	async function loadRegistration(
		registrationId: string,
		performerType: 'SOLO' | 'GROUP' | 'SCHOOL',
		index: number
	) {
		registrationStore.addToStore(registrations.value[index])
		switch (performerType) {
			case 'SOLO':
				appStore.performerType = 'SOLO'
				loadSoloContactInfo(registrationId)
				break
			case 'GROUP':
				appStore.performerType = 'GROUP'
				LoadGroupContactInfo(registrationId)
				break
			case 'SCHOOL':
				appStore.performerType = 'SCHOOL'
				LoadSchoolContactInfo(registrationId)
				break
		}
		loadClassInfo(registrationId)

		router.push({ name: 'Form' })
	}

	async function loadSoloContactInfo(registrationId: string) {
		const { error, onResult: onPerformerContactResult } = useQuery(
			SOLO_CONTACT_INFO_QUERY,
			{ registrationId },
			{ fetchPolicy: 'network-only' }
		)
		onPerformerContactResult((result) => {
			performerStore.addToStore(result.data.registration.performers[0])
			appStore.$patch({ performerContactLoaded: true })
			teacherStore.$patch((state: any) => {
				state.teacherInfo = { ...result.data.registration.teacher }
			})
			appStore.$patch({ teacherContactLoaded: true })
		})
	}

	async function LoadGroupContactInfo(registrationId: string) {
		const { error, onResult: onPerformerContactResult } = useQuery(
			SOLO_CONTACT_INFO_QUERY,
			{ registrationId },
			{ fetchPolicy: 'network-only' }
		)
		onPerformerContactResult((result) => {
			performerStore.addToStore(result.data.registration.performers[0])
			appStore.$patch({ performerContactLoaded: true })
			teacherStore.$patch((state: any) => {
				state.teacherInfo = { ...result.data.registration.teacher }
			})
			appStore.$patch({ teacherContactLoaded: true })
		})
	}

	async function loadClassInfo(registrationId: string) {
		const { error, onResult: onClassesResult } = useQuery(
			REGISTERED_CLASSES_QUERY,
			{ registrationId },
			{ fetchPolicy: 'network-only' }
		)
		onClassesResult((result) => {
			classesStore.addClassToStore()
			result.data.registration.registeredClasses.forEach(
				(registeredClasses: any, classIndex: number) => {
					classesStore.$patch((state: any) => {
						state.registeredClasses[classIndex] = { ...registeredClasses }
					})
				}
			)
			appStore.$patch({ classContentLoaded: true })
		})
	}

	/**
	 * Creates a new registration in the registration form.
	 *
	 * @param performerType SOLO, GROUP, or SCHOOL
	 */
	function newRegistration(performerType: 'SOLO' | 'GROUP' | 'SCHOOL') {
		registrationStore
			.createRegistration(performerType)
			.then(() => {
				appStore.$patch({
					editExisting: false,
					performerType,
					registrationExists: true,
				})
				performerStore.addToStore(null)
				teacherStore.addToStore(null)
			})
			.then(() => {
				router.push({ name: 'Form' })
			})
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
