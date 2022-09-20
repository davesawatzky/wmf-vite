<template>
	<!-- Solo Class Information Page -->
	<div class="pb-8">
		<h2 class="pb-4">Solo Class Information</h2>
		<div
			v-for="(selectedClass, index) in classesStore.registeredClasses"
			:key="index">
			<div class="pb-8">
				<h3 class="pb-4">Class {{ index + 1 }}</h3>
				<Class
					v-model="classesStore.registeredClasses[index]"
					:registration-index-number="index" />
			</div>
			<div class="pt-4">
				<BaseButton
					v-if="
						index + 1 === classesStore.registeredClasses.length ? true : false
					"
					class="btn btn-blue"
					@click="addClass()"
					>Add Class
				</BaseButton>
				<BaseButton
					v-if="classesStore.registeredClasses.length > 1 ? true : false"
					id="index"
					class="btn btn-red"
					@click="removeClass(index)"
					>Remove Class</BaseButton
				>
				<br /><br />
				<svg viewBox="0 0 800 2">
					<line x1="0" x2="800" stroke="black" />
				</svg>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
	import { useClasses } from '@/stores/userClasses'

	const classesStore = useClasses()

	function addClass() {
		classesStore.addClassToStore()
	}
	function removeClass(id: number) {
		classesStore.removeClassFromStore(id)
	}
</script>

<style scoped></style>
