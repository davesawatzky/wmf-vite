<template>
	<label v-if="label" class="" :for="uuid">{{ label }}</label>
	<textarea
		v-bind="{ ...$attrs }"
		:id="uuid"
		:value="inputValue"
		:aria-describedby="error ? `${uuid}-error` : ''"
		:aria-invalid="error ? true : false"
		@input="handleChange"
		@blur="handleBlur"></textarea>

	<BaseErrorMessage v-if="errorMessage">
		{{ errorMessage }}
	</BaseErrorMessage>
</template>

<script setup lang="ts">
	import UniqueID from '@/composables/UniqueID'
	import { toRef } from 'vue'
	import { useForm, useField } from 'vee-validate'
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
			type: String,
			default: '',
		},
		error: {
			type: String,
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
	} = useField(name, undefined, { initialValue: props.modelValue })
</script>
