<template>
	<label v-if="label" :for="uuid">{{ label }}</label>
	<input
		:id="uuid"
		v-bind="{ ...$attrs }"
		:value="modelValue"
		:aria-describedby="error ? `${uuid}-error` : ''"
		:aria-invalid="error ? true : false"
		:class="{ error }"
		@input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
	/>
	<BaseErrorMessage v-if="error" :id="`${uuid}-error`">{{
		error
	}}</BaseErrorMessage>
</template>

<script setup lang="ts">
	import UniqueID from '@/composables/UniqueID'
	const uuid = UniqueID().getID()

	const props = defineProps({
		label: {
			type: String,
			default: '',
		},
		modelValue: {
			type: [String, Number],
			default: '',
		},
		error: {
			type: String,
			default: '',
		},
	})
	const emits = defineEmits(['update:modelValue'])
</script>

<style scoped></style>
