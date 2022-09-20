<template>
	<div>
		<h2>Registration Summary</h2>
		<div>
			<h3 class="pt-10 pb-2">Performer</h3>
			<SummaryContactInfo
				:full-name="performers.fullName"
				:apartment="performers.performer[0].apartment"
				:street-number="performers.performer[0].streetNumber"
				:street-name="performers.performer[0].streetName"
				:city="performers.performer[0].city"
				:province="performers.performer[0].province"
				:postal-code="performers.performer[0].postalCode"
				:phone="performers.performer[0].phone"
				:email="performers.performer[0].email" />
		</div>
		<div>
			<h3 class="pt-10 pb-2">Teacher</h3>
			<SummaryContactInfo
				:full-name="teacher.fullName"
				:apartment="teacher.teacherInfo.apartment"
				:street-number="teacher.teacherInfo.streetNumber"
				:street-name="teacher.teacherInfo.streetName"
				:city="teacher.teacherInfo.city"
				:province="teacher.teacherInfo.province"
				:postal-code="teacher.teacherInfo.postalCode"
				:phone="teacher.teacherInfo.phone"
				:email="teacher.teacherInfo.email" />
		</div>
		<h3 class="pt-10 pb-2">Class Summary</h3>
		<ClassSummary />
	</div>
	<BaseRouteButton type="button" to="Form" class="btn btn-blue"
		>Forms</BaseRouteButton
	>
	<BaseButton class="btn btn-blue">Submit</BaseButton>
</template>

<script setup lang="ts">
	import { useClasses } from '@/stores/userClasses'
	import { usePerformers } from '@/stores/userPerformer'
	import { useTeacher } from '@/stores/userTeacher'
	import { useRegistration } from '@/stores/userRegistration'

	const classes = useClasses()
	const performers = usePerformers()

	const teacher = useTeacher()
	const registration = useRegistration()
</script>

<style scoped></style>
