<template>
	<div>
		<h4>{{ fullName }}</h4>
		<p>{{ apartment }} - {{ streetNumber }} {{ streetName }}</p>
		<p>
			{{ city }},
			{{ province }}
		</p>
		<p>{{ postalCode }}</p>
		<p>Phone: {{ phone }}</p>
		<p>Email: {{ email }}</p>
	</div>
</template>

<script setup lang="ts">
	defineProps({
		fullName: {
			type: String,
			default: '',
		},
		apartment: {
			type: String,
			default: '',
		},
		streetNumber: {
			type: String,
			default: '',
		},
		streetName: {
			type: String,
			default: '',
		},
		city: {
			type: String,
			default: '',
		},
		province: {
			type: String,
			default: '',
		},
		postalCode: {
			type: String,
			default: '',
		},
		phone: {
			type: String,
			default: '',
		},
		email: {
			type: String,
			default: '',
		},
	})
</script>

<style scoped></style>
