<template>
	<base-spinner v-if="queryLoading || mutationLoading"></base-spinner>
	<header class="bg-sky-800 h-24 text-white flex items-center">
		<div
			class="container sm:px-10 lg:max-w-5xl mx-auto flex justify-between items-center">
			<div class="flex">
				<img
					class="inline h-16"
					src="@/assets/images/wmf-logo-banner.jpg"
					alt="Winnipeg Music Festival Logo" />
				<div class="ml-4 font-semibold">Winnipeg<br />Music<br />Festival</div>
			</div>
			<div class="font-bold text-2xl">Festival Registration</div>
			<ul class="flex">
				<li class="px-3 py-1 mx-1 hover:bg-sky-500 hover:ring-2 rounded-md">
					<router-link to="Registrations" class=""
						>Registration Forms</router-link
					>
				</li>
				<li class="px-3 py-1 mx-1 hover:bg-sky-500 hover:ring-2 rounded-md">
					<base-logout></base-logout>
				</li>
			</ul>
		</div>
	</header>
	<div class="bg-sky-600 pt-5 pb-8">
		<div
			class="container bg-sky-100 py-8 px-6 rounded-lt sm:px-10 lg:max-w-5xl mx-auto rounded-lg shadow-xl">
			<router-view></router-view>
		</div>
	</div>
	<footer class="bg-sky-800 min-h-min text-white">
		<div class="container pt-4 sm:px-10 lg:max-w-5xl mx-auto flex items-center">
			<div>
				<div class="text-lg font-semibold">Winnipeg Music Festival</div>
				<address class="text-sm">
					2-88 St. Anne's Rd.<br />Winnipeg, MB R2M 2Y7<br />Phone: (204)
					947-0184<br />Email: <a href="mailto:wmf@mts.net">wmf@mts.net</a>
				</address>
			</div>
		</div>
		<div
			class="container text-sky-400 text-sm pb-6 sm:px-10 lg:max-w-5xl mx-auto flex flex-col items-center justify-center">
			<div class="">Created by</div>
			<a class="" href="https://www.diatonic.io" target="_blank"
				>Diatonic Web Design and Development</a
			>
		</div>
	</footer>
</template>

<script setup lang="ts">
	import BaseLogout from './components/base/BaseLogout.vue'
	import {
		useGlobalMutationLoading,
		useGlobalQueryLoading,
	} from '@vue/apollo-composable'

	const mutationLoading = useGlobalMutationLoading()
	const queryLoading = useGlobalQueryLoading()
</script>

<style>
	input.error,
	select.error {
		margin-bottom: 0;
	}
	input + p.errorMessage {
		margin-bottom: 24px;
	}
	.error {
		border: 1px solid red;
	}
	.errorMessage {
		color: red;
	}
</style>
