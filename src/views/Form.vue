<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div v-if="appStore.performerType === 'SOLO'">
		<router-link class="btn btn-blue" :to="'SoloContactInfo'"
			>Contact Information</router-link
		>
		<router-link class="btn btn-blue" :to="'SoloClasses'">Classes</router-link>
	</div>
	<div v-else-if="appStore.performerType === 'GROUP'">
		<router-link class="btn btn-blue" :to="'GroupContactInfo'"
			>Contact Information</router-link
		>
		<router-link class="btn btn-blue" :to="'GroupClasses'">Classes</router-link>
	</div>
	<div v-else-if="appStore.performerType === 'SCHOOL'">
		<!-- <router-link :to="'SchoolContactInfo'">Contact Information</router-link> -->
		<router-link :to="'School'">Classes</router-link>
	</div>

	<router-view></router-view>
</template>

<script setup lang="ts">
	import { useAppStore } from '@/stores/appStore'
	const appStore = useAppStore()
</script>

<style scoped></style>