<template>
	<header class="bg-sky-800 py-2 text-white">
		<nav
			class="container px-3 mx-auto lg:max-w-5xl flex justify-between items-center">
			<div class="flex">
				<img
					class="inline h-16"
					src="@/assets/images/wmf-logo-banner.jpg"
					alt="Winnipeg Music Festival Logo" />
				<div class="ml-4 font-semibold">Winnipeg<br />Music<br />Festival</div>
			</div>
			<div class="font-bold text-2xl invisible md:visible">
				Festival Registration
			</div>
			<div class="sm:hidden pr-3" @click="toggleNav">
				<button
					type="button"
					class="text-gray-100 hover:text-gray-400 focus:outline-none focus:text-gray-400">
					<svg viewBox="0 0 24 24" class="w8 h-8 fill-current">
						<path
							fill-rule="evenodd"
							d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
					</svg>
				</button>
			</div>

			<ul
				v-auto-animate
				:class="showMenu ? 'flex' : 'hidden'"
				class="flex-col sm:flex sm:flex-row sm:items-center">
				<li class="px-3 py-1 mx-1 hover:bg-sky-500 hover:ring-2 rounded-md">
					<router-link to="Registrations" class=""
						>Registration Forms</router-link
					>
				</li>
				<li class="px-3 py-1 mx-1 hover:bg-sky-500 hover:ring-2 rounded-md">
					<base-logout></base-logout>
				</li>
			</ul>
		</nav>
	</header>
</template>

<script lang="ts" setup>
	import { ref } from 'vue'
	import BaseLogout from './BaseLogout.vue'
	const showMenu = ref(false)
	const toggleNav = () => (showMenu.value = !showMenu.value)
</script>

<style></style>
