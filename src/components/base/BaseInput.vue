<template>
	<div class="ml-2">
		<label v-if="label" :for="uuid">{{ label }}</label>
	</div>
	<input
		:id="uuid"
		v-bind="{ ...$attrs }"
		v-maska="mask"
		:value="inputValue"
		:aria-describedby="errorMessage ? `${uuid}-error` : ''"
		:aria-invalid="errorMessage ? true : false"
		v-on="validationListeners" />
	<BaseErrorMessage> {{ errorMessage }}</BaseErrorMessage>
</template>

<script setup lang="ts">
	// 	@input ="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
	import { toRef, computed } from 'vue'
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
			required: true,
			default: '',
		},
		mask: {
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

	const nameRef = toRef(props, 'name')

	const validationListeners = computed(() => {
		// If the field is valid or have not been validated yet
		// lazy
		if (!errorMessage.value) {
			return {
				blur: handleChange,
				change: handleChange,
				// disable `shouldValidate` to avoid validating on input
				input: (e: string | number) => handleChange(e, false),
			}
		}

		// Aggressive
		return {
			blur: handleChange,
			change: handleChange,
			input: handleChange, // only switched this
		}
	})

	const {
		value: inputValue,
		errorMessage,
		handleChange,
	} = useField(nameRef, undefined, {
		validateOnValueUpdate: false,
		initialValue: props.modelValue,
	})
</script>
