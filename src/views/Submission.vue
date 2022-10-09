<template>
	<div>
		<h1 class="my-8">Registration Submission</h1>
		<SummaryTable></SummaryTable>

		<p>
			Submitted Applications are final when submitted and received. Changes may
			only be made by contacting the office. You may log in at any point to
			review your summary details.
		</p>
		<p>
			If you have not done so already, please print the summary page for your
			own records. In case of any discrepencies between the information in this
			registration form and the official syllabus, the official syllabus will
			always be considered correct.
		</p>
		<p>
			Once submitted, a confirmation number will be displayed on the screen.
			Please take note of this for your records. This number may be requested
			with any communication regarding your application.
		</p>
		<p>
			Payment may be made by cheque or e-transfer to the Winnipeg Music Festival
			(<a href="mailto:wmf@mts.net"><strong>wmf@mts.net</strong></a
			>). Please include the confirmation number as a memo when submitting
			payment.
		</p>
		<h3 class="pt-6 text-center">
			We look forward to having you participate in the this year's
		</h3>
		<h3 class="pb-6 text-center">Winnipeg Music Festival</h3>
		<div class="text-center">
			<BaseButton
				v-if="!submissionComplete"
				class="btn btn-blue"
				@click="submitRegistration"
				>Submit Application</BaseButton
			>
			<BaseRouteButton
				v-if="!submissionComplete"
				class="btn btn-blue"
				to="Registrations"
				>Cancel</BaseRouteButton
			>
			<div v-if="submissionComplete" class="pb-8">
				<strong>
					<h3 class="mx-auto">Confirmation Number</h3>
					<h3 class="mx-auto">{{ confirmationNumber }}</h3>
					<h4 class="mx-auto">{{ formattedDate }}</h4>
				</strong>
			</div>
			<BaseRouteButton
				v-if="submissionComplete"
				class="btn btn-blue h-14"
				to="Registrations"
				>Return to Registrations</BaseRouteButton
			>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { DateTime } from 'luxon'
	import { ref } from 'vue'
	import { random } from 'lodash'
	import { useRegistration } from '@/stores/userRegistration'
	import SummaryTable from '@/components/summaryblocks/SummaryTable.vue'

	const registrationStore = useRegistration()
	const confirmationNumber = ref('')
	const submissionComplete = ref(false)

	let date = new Date()
	let formattedDate = DateTime.now().toLocaleString(DateTime.DATETIME_MED)

	async function submitRegistration() {
		confirmationNumber.value =
			'WMF-' + registrationStore.registrationId + '-' + random(1000, 9999)
		registrationStore.registrations[0].submittedAt = date
		registrationStore.registrations[0].confirmation = confirmationNumber.value
		await registrationStore.updateRegistration()
		submissionComplete.value = true
	}
</script>

<style scoped></style>
