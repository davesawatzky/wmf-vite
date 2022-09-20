<template>
	<div :id="id" aria-live="assertive" class="errorMessage">
		<slot />
	</div>
</template>

<script setup lang="ts">
	defineProps({
		id: {
			type: String,
			required: true,
		},
	})
</script>
