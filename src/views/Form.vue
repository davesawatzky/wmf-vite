<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div>
		<BaseInput
			v-model="registrationStore.registrations[0].label"
			class="text-3xl mb-6 h-12 p-6"
			label="Registration Label"
			name="registrationLabel"
			:disabled="registrationStore.registrations[0].confirmation"
			type="text" />

		<div v-if="!registrationStore.registrations[0].confirmation">
			<div class="text-left">
				<button
					v-for="(_, tab, index) in tabs"
					:key="tab"
					class="btn-blue py-1 px-3 mr-1 rounded-t-lg"
					:class="[
						{ active: currentTab === tab },
						currentTab === tab ? 'bg-sky-600' : '',
					]"
					@click="currentTab = String(tab)">
					{{ tab }}
				</button>
			</div>
			<div
				class="border border-spacing-1 shadow-md rounded-b-lg rounded-tr-lg border-sky-500 p-2 mb-6">
				<KeepAlive>
					<component :is="tabs[currentTab]"></component>
				</KeepAlive>
			</div>
		</div>
		<div
			v-else
			class="border border-spacing-1 shadow-md rounded-lg border-sky-500 p-6 mb-6">
			<Summary />
		</div>
		<button
			v-if="!registrationStore.registrations[0].confirmation"
			class="btn btn-blue"
			@click="saveRegistration()">
			Save
		</button>
	</div>
</template>

<script setup lang="ts">
	import type { Component } from 'vue'
	import { ref } from 'vue'
	import SoloContactInfo from './SoloContactInfo.vue'
	import SoloClasses from './SoloClasses.vue'
	import GroupContactInfo from './GroupContactInfo.vue'
	import GroupClasses from './GroupClasses.vue'
	import SchoolInfo from './SchoolInfo.vue'
	import SchoolClasses from './SchoolClasses.vue'
	import CommunityInfo from './CommunityInfo.vue'
	import CommunityClasses from './CommunityClasses.vue'
	import Summary from './Summary.vue'
	import { useAppStore } from '@/stores/appStore'
	import { useClasses } from '@/stores/userClasses'
	import { useCommunity } from '@/stores/userCommunity'
	import { useGroup } from '@/stores/userGroup'
	import { usePerformers } from '@/stores/userPerformer'
	import { useRegistration } from '@/stores/userRegistration'
	import { useSchool } from '@/stores/userSchool'
	import { useTeacher } from '@/stores/userTeacher'

	interface DynamicComponent {
		[key: string]: Component
	}

	const registrationStore = useRegistration()
	const performerStore = usePerformers()
	const groupStore = useGroup()
	const communityStore = useCommunity()
	const classesStore = useClasses()
	const appStore = useAppStore()
	const schoolStore = useSchool()
	const teacherStore = useTeacher()

	const currentTab = ref('')
	let tabs = {} as DynamicComponent

	switch (appStore.performerType) {
		case 'SOLO':
			currentTab.value = 'Contact Info'
			tabs = {
				'Contact Info': SoloContactInfo,
				'Solo Classes': SoloClasses,
				Summary: Summary,
			}
			break
		case 'GROUP':
			currentTab.value = 'Contact Info'
			tabs = {
				'Contact Info': GroupContactInfo,
				'Group Classes': GroupClasses,
				Summary: Summary,
			}
			break
		case 'SCHOOL':
			currentTab.value = 'School Info'
			tabs = {
				'School Info': SchoolInfo,
				'School Classes': SchoolClasses,
				Summary: Summary,
			}
			break
		case 'COMMUNITY':
			currentTab.value = 'Community Info'
			tabs = {
				'Community Info': CommunityInfo,
				'Community Classes': CommunityClasses,
				Summary: Summary,
			}
			break
	}

	async function saveRegistration() {
		switch (appStore.performerType) {
			case 'SOLO':
				appStore.performerType = 'SOLO'
				await registrationStore.updateRegistration()
				await performerStore.updatePerformer(0, performerStore.performer[0].id!)
				await teacherStore.updateTeacher()
				await classesStore.updateAllClasses()
				break
			case 'GROUP':
				appStore.performerType = 'GROUP'
				await registrationStore.updateRegistration()
				await groupStore.updateGroup()
				await teacherStore.updateTeacher()
				await performerStore.updateAllPerformers()
				await classesStore.updateAllClasses()
				break
			case 'SCHOOL':
				appStore.performerType = 'SCHOOL'
				await registrationStore.updateRegistration()
				await schoolStore.updateSchool()
				await communityStore.updateAllCommunities()
				await teacherStore.updateTeacher()
				await classesStore.updateAllClasses()
				break
			case 'COMMUNITY':
				appStore.performerType = 'COMMUNITY'
				await registrationStore.updateRegistration()
				await communityStore.updateCommunity(
					0,
					communityStore.communityInfo[0].id!
				)
				await teacherStore.updateTeacher()
				await classesStore.updateAllClasses()
				break
		}
	}
</script>

<style scoped></style>
