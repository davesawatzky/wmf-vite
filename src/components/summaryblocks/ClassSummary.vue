<template>
	<div class="border rounded-xl border-gray-300 w-full mb-4">
		<table class="table-fixed divide-y divide-gray-300 w-full">
			<thead class="">
				<tr>
					<th class="border-b border-gray-300 text-left" scope="col">
						Class Number
					</th>
					<th class="border-b border-gray-300 text-left" scope="col">
						Class Name
					</th>
					<th class="border-b border-gray-300 text-left" scope="col">
						Grade/Level/Age
					</th>
					<th class="border-b border-gray-300 text-left" scope="col">
						Category
					</th>
					<th class="border-b border-gray-300 text-left" scope="col">Price</th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-300">
				<tr
					v-for="fclass in classes.registeredClasses"
					:key="fclass.classNumber"
					class="border-t border-gray-300"
				>
					<td class="p-8">{{ fclass.classNumber }}</td>
					<td class="p-8">{{ fclass.discipline }}</td>
					<!-- Not really correct -->
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
	import { useClasses } from '@/stores/userClasses'

	const classes = useClasses()
</script>

<style scoped>
	th,
	td {
		padding: 0.25rem;
	}
</style>
