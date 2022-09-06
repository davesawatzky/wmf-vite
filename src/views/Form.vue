<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div v-if="appStore.performerType === 'SOLO'" class="demo">
		<button
			v-for="(_, tab) in soloTabs"
			:key="tab"
			:class="['tab-button', { active: currentTab === tab }]"
			@click="currentTab = tab">
			{{ tab }}
		</button>
		<KeepAlive>
			<component :is="soloTabs[currentTab]" class="tab"></component>
		</KeepAlive>
	</div>
	<div v-else-if="appStore.performerType === 'GROUP'" class="demo">
		<button
			v-for="(_, tab) in groupTabs"
			:key="tab"
			:class="['tab-button', { active: currentTab === tab }]"
			@click="currentTab = tab">
			{{ tab }}
		</button>
		<KeepAlive>
			<component :is="groupTabs[currentTab]" class="tab"></component>
		</KeepAlive>
	</div>
	<div v-else-if="appStore.performerType === 'SCHOOL'" class="demo">
		<button
			v-for="(_, tab) in schoolTabs"
			:key="tab"
			:class="['tab-button', { active: currentTab === tab }]"
			@click="currentTab = tab">
			{{ tab }}
		</button>
		<KeepAlive>
			<component :is="schoolTabs[currentTab]" class="tab"></component>
		</KeepAlive>
	</div>
	<BaseRouteButton type="button" to="Registrations" class="btn btn-blue"
		>Registrations</BaseRouteButton
	>
	<BaseRouteButton type="button" to="Summary" class="btn btn-blue"
		>Summary</BaseRouteButton
	>
	<button class="btn btn-blue">Save</button>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import SoloContactInfo from './SoloContactInfo.vue'
	import SoloClasses from './SoloClasses.vue'
	import GroupContactInfo from './GroupContactInfo.vue'
	import GroupClasses from './GroupClasses.vue'
	import School from './School.vue'
	import { useAppStore } from '@/stores/appStore'
	const appStore = useAppStore()

	const currentTab = ref('')
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
	}
	const soloTabs = {
		'Contact Info': SoloContactInfo,
		'Solo Classes': SoloClasses,
	}
	const groupTabs = {
		'Contact Info': GroupContactInfo,
		'Group Classes': GroupClasses,
	}
	const schoolTabs = { 'School Info': School }
</script>

<style scoped>
	.demo {
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
