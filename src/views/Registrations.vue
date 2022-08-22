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
								editRegistration(
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
</template>

<script lang="ts" setup>
	import { computed } from 'vue'
	import { useRegistration } from '@/stores/userRegistration'
	import {
		useQuery,
		useMutation,
		useQueryLoading,
	} from '@vue/apollo-composable'
	import REGISTRATION_QUERY from '@/graphql/queries/registrations.query.gql'
	import ADD_REGISTRATION_MUTATION from '@/graphql/mutations/addRegistration.mutation.gql'
	import { useRouter } from 'vue-router'
	import routePerformerType from '@/composables/routePerformerType'
	import { useAppStore } from '@/stores/appStore'

	const registrationStore = useRegistration()
	const appStore = useAppStore()
	const router = useRouter()
	const loading = useQueryLoading()

	/**
	 * Query for existing registrations from user
	 * All registrations assigned to registrations array
	 */
	const { result, error } = useQuery(REGISTRATION_QUERY)
	const registrations = computed(() => result.value?.registrations ?? [])

	/**
	 * Edit Existing Registration
	 *
	 * @param registrationId The ID of the registration form
	 * @param performerType SOLO, GROUP, or SCHOOL,
	 * @param index Array Index of retrieved registrations
	 */
	function editRegistration(
		registrationId: string,
		performerType: 'SOLO' | 'GROUP' | 'SCHOOL',
		index: number
	) {
		// Add chosen registration to store
		// Only one registration allowed to be worked on at a time
		registrationStore.addToStore(registrations.value[index])
		// Application flags to store
		appStore.$patch({
			editExisting: true,
			performerType,
			registrationId,
			registrationExists: true,
		})

		// Push Router to form page
		router.push({
			name: routePerformerType(performerType),
		})
	}

	/**
	 * Mutation code for new registrations
	 * under 'newReg()'
	 */
	const { mutate: newReg, onDone: doneNewReg } = useMutation(
		ADD_REGISTRATION_MUTATION
	)

	/**
	 * Create new Registration
	 *
	 * @param performerType SOLO, GROUP, or SCHOOL
	 */
	function newRegistration(performerType: 'SOLO' | 'GROUP' | 'SCHOOL') {
		// Create new registration in db in order to get ID
		newReg({ performerType })
		// Once mutation is complete
		// Assign the returned data result to the store
		doneNewReg((result) => {
			registrationStore.addToStore(result.data.registrationCreate.registration)
			const registrationId = result.data.registrationCreate.registration.id
			// Push to the Form page
			// edit flag is set to false for a clean page
			appStore.$patch({
				editExisting: false,
				performerType,
				registrationId,
				registrationExists: true,
			})
			router.push({
				name: routePerformerType(performerType),
			})
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
