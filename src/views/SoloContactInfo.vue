<template>
	<!-- Solo Performer Contact Information	-->
	<div class="pb-8">
		<h2 class="pb-4">Solo Performer Information</h2>
		<div v-if="isLoading">Loading...</div>
		<div v-else-if="isError">Error: {{ isError.message }}</div>
		<form @submit.prevent>
			<div>
				<div v-if="performerStore.performer[0]">
					<ContactInfo v-model="performerStore.performer[0]" />
				</div>
				<div class="pt-4">
					<BaseTextarea :label="textAreaLabel" />
				</div>
			</div>

			<!-- Solo Teacher Contact Information -->
			<div class="pb-8">
				<h2 class="pb-4">Teacher Information</h2>
				<div>
					<ContactInfo v-model="teacherStore.teacherInfo" />
				</div>
			</div>
		</form>
	</div>
</template>

<script lang="ts" setup>
	import { textAreaLabel } from '@/composables/formData'
	import { useMutation, useQuery } from '@vue/apollo-composable'
	import { ref, computed } from 'vue'
	import SOLO_CONTACT_INFO_QUERY from '../graphql/queries/soloContactInfo.query.gql'
	import ADD_CONTACT_INFO_MUTATION from '@/graphql/mutations/addContacts.mutation.gql'

	import { usePerformers } from '@/stores/userPerformer'
	import { useTeacher } from '@/stores/userTeacher'
	import { useAppStore } from '@/stores/appStore'
	const appStore = useAppStore()
	const performerStore = usePerformers()
	const teacherStore = useTeacher()

	let isLoading = ref(false)
	let isError = ref()
	const isResult = ref(false)

	const queryVariables = ref({
		registrationId: appStore.registrationId,
	})
	const queryOptions = ref({
		enabled: true,
	})

	/**
	 *
	 * Query existing contact information for performer
	 * and teacher.
	 *
	 */
	//Query to load existing data
	if (appStore.editExisting) {
		const { loading, error, onResult } = useQuery(
			SOLO_CONTACT_INFO_QUERY,
			queryVariables,
			queryOptions
		)
		isLoading = computed(() => loading.value)
		isError = computed(() => error.value)
		onResult((result) => {
			isResult.value = true

			// Patches the performer and teacher store with existing data from database
			if (queryOptions.value.enabled && appStore.editExisting) {
				performerStore.$patch({ registrationId: appStore.registrationId })
				performerStore.addToStore()
				performerStore.$patch((state: any) => {
					state.performer[0] = { ...result.data.registration.performers[0] }
				})
				appStore.$patch({ performerContactExists: true })

				teacherStore.$patch({ registrationId: appStore.registrationId })
				teacherStore.$patch((state: any) => {
					state.teacherInfo = { ...result.data.registration.teacher }
				})
				appStore.$patch({ teacherContactExists: true })
			}
		})
	}

	/**
	 * Mutation code to add new performer and teacher
	 * to database
	 */
	const mutationVariables = ref({})
	const { mutate: contactsMutate, onDone: onDoneContactsMutation } =
		useMutation(ADD_CONTACT_INFO_MUTATION, () => ({
			variables: { ...mutationVariables.value },
		}))

	/**
	 *
	 * If this is a new registration form
	 *
	 */
	if (!appStore.editExisting) {
		performerStore.$state
		teacherStore.$state
		addContacts()
	}

	/**
	 *
	 * Add a new performer to State and db
	 *
	 */
	function addContacts() {
		// disable querying for performers, since there shouldn't be any there
		queryOptions.value.enabled = false

		//set the the registrationId flag in the performer store
		performerStore.$patch({ registrationId: appStore.registrationId })
		teacherStore.$patch({ registrationId: appStore.registrationId })

		// create empty store states
		performerStore.addToStore(null)
		teacherStore.addToStore(null)

		// Add Winnipeg and MB as defaults to the store
		performerStore.$patch((state: any) => {
			state.performer[0].city = 'Winnipeg'
			state.performer[0].province = 'MB'
		})
		teacherStore.$patch((state: any) => {
			state.teacherInfo.city = 'Winnipeg'
			state.teacherInfo.province = 'MB'
		})

		// Create the first performer entry in the db for this registration
		mutationVariables.value = {
			registrationId: appStore.registrationId,
			performer: {
				city: 'Winnipeg',
				province: 'MB',
			},
			teacherCreateRegistrationId2: appStore.registrationId,
			teacher: {
				city: 'Winnipeg',
				province: 'MB',
			},
		}
		contactsMutate(mutationVariables)
		onDoneContactsMutation((result) => {
			performerStore.$patch((state: any) => {
				state.performer[0] = { ...result.data.performerCreate.performer }
			})
			teacherStore.$patch((state: any) => {
				state.teacherInfo = { ...result.data.teacherCreate.teacher }
			})
			appStore.$patch({
				performerContactExists: true,
				teacherContactExists: true,
			})
		})
	}
</script>

<style lang="scss" scoped></style>
