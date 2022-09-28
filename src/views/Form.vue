<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<BaseInput
		v-model="registrationStore.registrations[0].label"
		name="registrationLabel"
		type="text" />
	<div v-if="appStore.performerType === 'SOLO'" class="section">
		<button
			v-for="(_, tab) in soloTabs"
			:key="tab"
			:class="['tab-button', { active: currentTab === tab }]"
			@click="currentTab = tab">
			{{ tab }}
		</button>
		<KeepAlive>
			<component
				:is="soloTabs[(currentTab as 'Contact Info' | 'Solo Classes')]"
				class="tab"></component>
		</KeepAlive>
	</div>
	<div v-else-if="appStore.performerType === 'GROUP'" class="section">
		<button
			v-for="(_, tab) in groupTabs"
			:key="tab"
			:class="['tab-button', { active: currentTab === tab }]"
			@click="currentTab = tab">
			{{ tab }}
		</button>
		<KeepAlive>
			<component
				:is="groupTabs[(currentTab as 'Contact Info' | 'Group Classes')]"
				class="tab"></component>
		</KeepAlive>
	</div>
	<div v-else-if="appStore.performerType === 'SCHOOL'" class="section">
		<button
			v-for="(_, tab) in schoolTabs"
			:key="tab"
			:class="['tab-button', { active: currentTab === tab }]"
			@click="currentTab = tab">
			{{ tab }}
		</button>
		<KeepAlive>
			<component
				:is="schoolTabs[(currentTab as 'School Info')]"
				class="tab"></component>
		</KeepAlive>
	</div>
	<div v-else-if="appStore.performerType === 'COMMUNITY'" class="section">
		<button
			v-for="(_, tab) in communityTabs"
			:key="tab"
			:class="['tab-button', { active: currentTab === tab }]"
			@click="currentTab = tab">
			{{ tab }}
		</button>
		<KeepAlive>
			<component
				:is="communityTabs[(currentTab as 'Community Group Info')]"
				class="tab"></component>
		</KeepAlive>
	</div>
	<BaseRouteButton type="button" to="Registrations" class="btn btn-blue"
		>Registrations</BaseRouteButton
	>
	<BaseRouteButton type="button" to="Summary" class="btn btn-blue"
		>Summary</BaseRouteButton
	>
	<button class="btn btn-blue" @click="saveRegistration()">Save</button>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import SoloContactInfo from './SoloContactInfo.vue'
	import SoloClasses from './SoloClasses.vue'
	import GroupContactInfo from './GroupContactInfo.vue'
	import GroupClasses from './GroupClasses.vue'
	import SchoolInfo from './SchoolInfo.vue'
	import SchoolClasses from './SchoolClasses.vue'
	import CommunityContactInfo from './CommunityInfo.vue'
	import CommunityClasses from './CommunityClasses.vue'
	import BaseInput from '@/components/base/BaseInput.vue'
	import { useAppStore } from '@/stores/appStore'
	import { useClasses } from '@/stores/userClasses'
	import { useCommunity } from '@/stores/userCommunity'
	import { useGroup } from '@/stores/userGroup'
	import { usePerformers } from '@/stores/userPerformer'
	import { useRegistration } from '@/stores/userRegistration'
	import { useSchool } from '@/stores/userSchool'
	import { useTeacher } from '@/stores/userTeacher'

	const registrationStore = useRegistration()
	const performerStore = usePerformers()
	const groupStore = useGroup()
	const communityStore = useCommunity()
	const classesStore = useClasses()
	const appStore = useAppStore()
	const schoolStore = useSchool()
	const teacherStore = useTeacher()

	const currentTab = ref()

	switch (appStore.performerType) {
		case 'SOLO':
			currentTab.value = 'Contact Info'
			break
		case 'GROUP':
			currentTab.value = 'Contact Info'
			break
		case 'SCHOOL':
			currentTab.value = 'School Info'
			break
		case 'COMMUNITY':
			currentTab.value = 'Community Group Info'
			break
	}
	const soloTabs = {
		'Contact Info': SoloContactInfo,
		'Solo Classes': SoloClasses,
	}
	const groupTabs = {
		'Contact Info': GroupContactInfo,
		'Group Classes': GroupClasses,
	}
	const schoolTabs = {
		'School Info': SchoolInfo,
		'School Classes': SchoolClasses,
	}
	const communityTabs = {
		'Community Group Info': CommunityContactInfo,
		'Community Group Classes': CommunityClasses,
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
				await teacherStore.updateTeacher()
				await classesStore.updateAllClasses()
				break
			case 'COMMUNITY':
				appStore.performerType = 'COMMUNITY'
				await registrationStore.updateRegistration()
				await communityStore.updateCommunity()
				await teacherStore.updateTeacher()
				await classesStore.updateAllClasses()
				break
		}
	}
</script>

<style scoped>
	.section {
		font-family: sans-serif;
		border: 1px solid #eee;
		border-radius: 2px;
		padding: 20px 30px;
		margin-top: 1em;
		margin-bottom: 40px;
		user-select: none;
		overflow-x: auto;
	}

	.tab-button {
		padding: 6px 10px;
		border-top-left-radius: 3px;
		border-top-right-radius: 3px;
		border: 1px solid #ccc;
		cursor: pointer;
		background: #f0f0f0;
		margin-bottom: -1px;
		margin-right: -1px;
	}
	.tab-button:hover {
		background: #e0e0e0;
	}
	.tab-button.active {
		background: #e0e0e0;
	}
	.tab {
		border: 1px solid #ccc;
		padding: 10px;
	}
</style>
