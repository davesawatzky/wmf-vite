<template>
	<div v-auto-animate>
		<h1 class="pt-8">Registration Summary</h1>

		<!-- Community Groups-->
		<div v-if="appStore.performerType === 'COMMUNITY'">
			<h2 class="pt-8 pb-4">Community Group Information</h2>

			<div>
				Community Group Name: {{ communityStore.communityInfo[0].name }}
			</div>
			<div>
				Community Group Size: {{ communityStore.communityInfo[0].groupSize }}
			</div>
			<div>
				Number of Chaperones: {{ communityStore.communityInfo[0].chaperones }}
			</div>
			<div>
				Number of Wheelchairs: {{ communityStore.communityInfo[0].wheelchairs }}
			</div>
			<div>
				Performers participating in other classes
				{{ communityStore.communityInfo[0].conflictPerformers }}
			</div>
		</div>

		<!-- School Groups -->
		<div v-if="appStore.performerType === 'SCHOOL'">
			<h2 class="pt-8 pb-4">School Information</h2>
			<div>School Name: {{ schoolStore.schoolInfo.name }}</div>
			<div>School Division: {{ schoolStore.schoolInfo.division }}</div>
			<div>Address:</div>
			{{ schoolStore.schoolInfo.streetNumber }}
			{{ schoolStore.schoolInfo.streetName }}
			<div>
				{{ schoolStore.schoolInfo.city }}, {{ schoolStore.schoolInfo.province }}
			</div>
			<div>{{ schoolStore.schoolInfo.postalCode }}</div>
			<div>Phone: {{ schoolStore.schoolInfo.phone }}</div>
		</div>

		<!-- Registered Classes -->
		<h2 class="pt-8 pb-4">Registered Classes</h2>
		<div
			v-for="registeredClass in classesStore.registeredClasses"
			:key="registeredClass.id">
			<h4 class="py-2">Class Number: {{ registeredClass.classNumber }}</h4>
			<div>Class Name: {{ registeredClass.className }}</div>
			<div>Number of Selections: {{ registeredClass.numberOfSelections }}</div>
			<div
				v-for="(selection, index) in registeredClass.selections"
				:key="selection.id"
				class="ml-8">
				<h5 class="py-2">Selection {{ index + 1 }}</h5>
				<div>Title: {{ selection.title }}</div>
				<div>Composer: {{ selection.composer }}</div>
				<div v-if="selection.largerWork">
					from Work: {{ selection.largerWork }}
				</div>
				<div v-if="selection.movement">Movement: {{ selection.movement }}</div>
				<div>Duration: {{ selection.duration }}</div>
			</div>
		</div>

		<!-- Solo and Group Performers -->
		<div v-if="appStore.performerType === 'GROUP'">
			<h2 class="pt-8 pb-4">Group Information</h2>
			<div>Name: {{ groupStore.groupInfo.name }}</div>
			<div>Type of Group: {{ groupStore.groupInfo.groupType }}</div>
			<div>
				Number of Performers: {{ groupStore.groupInfo.numberOfPerformers }}
			</div>
			<div>Age of the Group: {{ groupStore.groupInfo.age }}</div>
		</div>
		<div
			v-if="
				appStore.performerType === 'GROUP' || appStore.performerType === 'SOLO'
			">
			<h2 class="pt-8 pb-4">Performer(s)</h2>
			<div
				v-for="(performer, index) in performerStore.performer"
				:key="performer.id">
				<SummaryContactInfo
					:contact="performer"
					:full-name="performerStore.fullName[index]" />
			</div>
		</div>

		<!-- Teacher -->
		<div>
			<h2 class="pt-8 pb-4">Teacher</h2>
			<SummaryContactInfo
				:contact="teacherStore.teacherInfo"
				:full-name="teacherStore.fullName" />
		</div>
		<h3 class="pt-8 pb-4">Class Summary</h3>
		<SummaryTable />
	</div>
	<BaseButton class="btn btn-blue" @click="submitRegistration"
		>Prepare and Submit</BaseButton
	>
</template>

<script setup lang="ts">
	import { usePerformers } from '@/stores/userPerformer'
	import { useTeacher } from '@/stores/userTeacher'
	import { useGroup } from '@/stores/userGroup'
	import { useSchool } from '@/stores/userSchool'
	import { useCommunity } from '@/stores/userCommunity'
	import { useClasses } from '@/stores/userClasses'
	import { useRegistration } from '@/stores/userRegistration'
	import { useAppStore } from '@/stores/appStore'
	import router from '@/router'

	const performerStore = usePerformers()
	const teacherStore = useTeacher()
	const groupStore = useGroup()
	const schoolStore = useSchool()
	const communityStore = useCommunity()
	const classesStore = useClasses()
	const appStore = useAppStore()

	function submitRegistration() {
		router.push('Submission')
	}
</script>

<style scoped></style>
