<template>
	<!-- Solo Performer Contact Information	-->
	<div class="pb-8">
		<h2 class="pb-4">Solo Performer Information</h2>
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
		<div v-else-if="isError">Error: {{ isError.message }}</div>
		<form v-else @submit.prevent>
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
	import {
		useMutation,
		useQuery,
		useQueryLoading,
	} from '@vue/apollo-composable'
	import { ref, computed } from 'vue'
	import SOLO_CONTACT_INFO_QUERY from '../graphql/queries/soloContactInfo.query.gql'
	import ADD_CONTACT_INFO_MUTATION from '@/graphql/mutations/addContacts.mutation.gql'

	import { usePerformers } from '@/stores/userPerformer'
	import { useTeacher } from '@/stores/userTeacher'
	import { useAppStore } from '@/stores/appStore'
	const appStore = useAppStore()
	const performerStore = usePerformers()
	const teacherStore = useTeacher()
	const loading = useQueryLoading()

	let isError = ref()
	const isResult = ref(false)

	const queryVariables = ref({
		registrationId: appStore.registrationId,
	})

	/**
	 * Query existing contact information for performer
	 * and teacher on first load.
	 */
	if (
		appStore.editExisting &&
		(!appStore.performerContactLoaded || !appStore.teacherContactLoaded)
	) {
		const { error, onResult } = useQuery(
			SOLO_CONTACT_INFO_QUERY,
			queryVariables
		)
		isError = computed(() => error.value)
		onResult((result) => {
			isResult.value = true
			// Patches the performer and teacher store with existing data from database
			if (appStore.editExisting) {
				performerStore.$patch({ registrationId: appStore.registrationId })
				performerStore.addToStore(null)
				performerStore.$patch((state: any) => {
					state.performer[0] = { ...result.data.registration.performers[0] }
				})
				//Set the existing performer flag to true when found in the database
				appStore.$patch({ performerContactLoaded: true })

				teacherStore.$patch({ registrationId: appStore.registrationId })
				teacherStore.$patch((state: any) => {
					state.teacherInfo = { ...result.data.registration.teacher }
				})
				// sets the existing teacher flag to true when found in the database
				appStore.$patch({ teacherContactLoaded: true })
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
	 * If this is a new solo registration form
	 */
	if (
		!appStore.editExisting &&
		!appStore.performerContactLoaded &&
		!appStore.teacherContactLoaded
	) {
		performerStore.$reset
		teacherStore.$reset
		createEmptyContacts()
	}

	/**
	 * Add an empty performer and teacher to State and db
	 */
	function createEmptyContacts() {
		//set the registrationId in the performer and teacher store
		performerStore.$patch({ registrationId: appStore.registrationId })
		teacherStore.$patch({ registrationId: appStore.registrationId })
		// create empty store states
		performerStore.addToStore(null)
		teacherStore.addToStore(null)
		// Create the first performer entry in the db for this registration
		mutationVariables.value = {
			registrationId: performerStore.registrationId,
			performer: {
				city: performerStore.performer[0].city,
				province: performerStore.performer[0].province,
			},
			teacherCreateRegistrationId2: teacherStore.registrationId,
			teacher: {
				city: teacherStore.teacherInfo.city,
				province: teacherStore.teacherInfo.province,
			},
		}
		contactsMutate(mutationVariables)
		onDoneContactsMutation(() => {
			// performerStore.$patch((state: any) => {
			// 	state.performer[0] = { ...result.data.performerCreate.performer }
			// })
			// teacherStore.$patch((state: any) => {
			// 	state.teacherInfo = { ...result.data.teacherCreate.teacher }
			// })
			appStore.$patch({
				performerContactLoaded: true,
				teacherContactLoaded: true,
			})
		})
	}
</script>

<style lang="scss" scoped></style>
