<template>
	<div>
		<input
			type="radio"
			:checked="modelValue === value"
			:value="value"
			v-bind="{ ...$attrs }"
			@change="$emit('update:modelValue', value)" />
		<label v-if="label">{{ label }}</label>
		<p v-if="description">{{ description }}</p>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		label: {
			type: String,
			default: '',
		},
		description: {
			type: String,
			default: '',
		},
		modelValue: {
			type: [String, Number],
			default: '',
		},
		value: {
			type: [String, Number],
			required: true,
		},
	})
	defineEmits(['update:modelValue'])
</script>
