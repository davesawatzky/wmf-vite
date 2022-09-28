<template>
	<!-- Solo Performer Contact Information	-->
	<form>
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
					<contact-info v-model="teacherStore.teacherInfo" teacher />
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

	import { usePerformers } from '@/stores/userPerformer'
	import { useTeacher } from '@/stores/userTeacher'
	import { useAppStore } from '@/stores/appStore'
	import { useRegistration } from '@/stores/userRegistration'

	const appStore = useAppStore()
	const registrationStore = useRegistration()
	const performerStore = usePerformers()
	const teacherStore = useTeacher()

	let isError = ref()
</script>

<style lang="scss" scoped></style>
