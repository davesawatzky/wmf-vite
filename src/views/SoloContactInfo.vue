<template>
	<!-- Solo Performer Contact Information	-->
	<BaseSpinner v-show="loading"></BaseSpinner>
	<div v-if="isError">Error: {{ isError.message }}</div>
	<form v-else @submit.prevent="saveContactInfo">
		<div class="pb-8">
			<div>
				<h2 class="pb-4">Solo Performer Information</h2>
				<div v-if="performerStore.performer[0]">
					<ContactInfo v-model="performerStore.performer[0]" />
				</div>
				<div class="pt-4">
					<BaseTextarea :label="textAreaLabel" />
				</div>
			</div>
			<div>
				<!-- Solo Teacher Contact Information -->
				<h2 class="pb-4">Teacher Information</h2>
				<div>
					<contact-info v-model="teacherStore.teacherInfo" :teacher="true" />
				</div>
			</div>
		</div>
	</form>
</template>

<script lang="ts" setup>
	import { textAreaLabel } from '@/composables/formData'
	import {
		useMutation,
		useQuery,
		useQueryLoading,
	} from '@vue/apollo-composable'
	import { ref, computed } from 'vue'
	import ADD_CONTACT_INFO_MUTATION from '@/graphql/mutations/addContacts.mutation.gql'

	import { usePerformers } from '@/stores/userPerformer'
	import { useTeacher } from '@/stores/userTeacher'
	import { useAppStore } from '@/stores/appStore'
	import { useRegistration } from '@/stores/userRegistration'

	const appStore = useAppStore()
	const registrationStore = useRegistration()
	const performerStore = usePerformers()
	const teacherStore = useTeacher()
	const loading = useQueryLoading()

	let isError = ref()
	// const isResult = ref(false)

	/**
	 * Mutation code to add new performer and teacher
	 * to database
	 */
	const mutationVariables = ref({})
	const { mutate: contactsMutate, onDone: onDoneContactsMutation } =
		useMutation(ADD_CONTACT_INFO_MUTATION, () => ({
			variables: { ...mutationVariables.value },
		}))

	function saveContactInfo() {}
</script>

<style lang="scss" scoped></style>
