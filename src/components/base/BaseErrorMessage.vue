<template>
	<p :id="id" aria-live="assertive" class="errorMessage">
		<slot />
	</p>
</template>

<script setup lang="ts">
	defineProps({
		id: {
			type: String,
			required: true,
		},
	})
</script>
