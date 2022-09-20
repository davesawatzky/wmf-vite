<template>
	<label v-if="label" :for="uuid">{{ label }}</label>
	<input
		:id="uuid"
		v-bind="{ ...$attrs }"
		:value="inputValue"
		:aria-describedby="errorMessage ? `${uuid}-error` : ''"
		:aria-invalid="errorMessage ? true : false"
		@change="handleChange"
		@blur="handleBlur" />
	<BaseErrorMessage> {{ errorMessage }}</BaseErrorMessage>
</template>

<script setup lang="ts">
	// 	@input ="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
	import { toRef } from 'vue'
	import { useField } from 'vee-validate'
	import UniqueID from '@/composables/UniqueID'
	const uuid = UniqueID().getID()

	const props = defineProps({
		label: {
			type: String,
			default: '',
		},
		name: {
			type: String,
			required: false,
			default: '',
		},
		modelValue: {
			type: [String, Number],
			default: '',
		},
	})
	defineEmits(['update:modelValue'])

	const name = toRef(props, 'name')

	const {
		value: inputValue,
		errorMessage,
		handleBlur,
		handleChange,
		meta,
	} = useField(name, undefined, {
		initialValue: props.modelValue,
	})
</script>

<style scoped></style>
