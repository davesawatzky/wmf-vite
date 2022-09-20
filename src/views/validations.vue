<template>
	<div>
		<h1>Create an Event</h1>
		<form @submit="submit">
			<BaseSelect
				v-model="category"
				label="Select a category"
				:options="categories"
				:error="errors.category" />

			<h3>Name & describe your event</h3>
			<BaseInput
				v-model="title"
				label="Title"
				type="text"
				:error="errors.title" />

			<BaseInput
				v-model="description"
				label="Description"
				type="text"
				:error="errors.description" />

			<h3>Where is your event?</h3>
			<BaseInput
				v-model="location"
				label="Location"
				type="text"
				:error="errors.location" />

			<h3>Are pets allowed?</h3>
			<BaseRadioGroup
				v-model="pets"
				name="pets"
				:options="[
					{ value: 1, label: 'Yes' },
					{ value: 0, label: 'No' },
				]"
				:error="errors.pets" />

			<h3>Extras</h3>
			<div>
				<BaseCheckbox
					v-model="catering"
					label="Catering"
					:error="errors.catering" />
			</div>

			<div>
				<BaseCheckbox
					v-model="music"
					label="Live music"
					:error="errors.music" />
			</div>

			<div>
				<BaseButton type="submit" class="btn btn-blue" something="else">
					Submit
				</BaseButton>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
	import { ref } from 'vue'
	import { useField, useForm } from 'vee-validate'
	import * as yup from 'yup'

	const categories = ref([
		{ name: 'sustainability', id: '1' },
		{ name: 'nature', id: '2' },
		{ name: 'animal welfare', id: '3' },
		{ name: 'housing', id: '4' },
		{ name: 'food', id: '5' },
		{ name: 'education', id: '6' },
		{ name: 'community', id: '7' },
	])

	// const required = (value: any) => {
	// 	const requiredMessage = 'This field is required'
	// 	if (value === undefined || value === null) return requiredMessage
	// 	if (!String(value).length) return requiredMessage

	// 	return true
	// }
	// const minLength = (number: number, value: string) => {
	// 	if (String(value).length < number)
	// 		return 'Please type at least ' + number + ' characters'
	// 	return true
	// }

	// const anything = () => {
	// 	return true
	// }

	// const validationSchema = {
	// 	category: required,
	// 	title: (value: string) => {
	// 		const req = required(value)
	// 		if (req !== true) return req
	// 		const min = minLength(3, value)
	// 		if (min !== true) return min
	// 		return true
	// 	},
	// 	description: required,
	// 	location: undefined,
	// 	pets: anything,
	// 	catering: anything,
	// 	music: anything,
	// }

	const validationSchema = yup.object({
		category: yup.string().required(),
		title: yup.string().required('A cool title is required').min(3),
		description: yup.string().required(),
		location: yup.string(),
		pets: yup.number(),
		catering: yup.boolean(),
		music: yup.boolean(),
	})

	const { handleSubmit, errors } = useForm({
		validationSchema,
		initialValues: {
			pets: 1,
			catering: false,
			music: false,
		},
	})

	const { value: category } = useField('category')
	const { value: title } = useField('title')
	const { value: description } = useField('description')
	const { value: location } = useField('location')
	const { value: pets } = useField('pets')
	const { value: catering } = useField('catering')
	const { value: music } = useField('music')

	const submit = handleSubmit((values) => {
		console.log('submit', values)
	})
</script>

<style scoped></style>
