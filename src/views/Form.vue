<!-- eslint-disable vue/multi-word-component-names -->
<template>
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
	<button class="btn btn-blue" @click="saveRegistration">Save</button>
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
	import { useAppStore } from '@/stores/appStore'
	const appStore = useAppStore()

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

	function saveRegistration() {}
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
