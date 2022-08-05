<template>
	<!--
	***
	*** Group Information
	*** Uses the Contact Info Component and other
	*** Base components
	***
	-->
	<div>
		<div class="pb-8">
			<h2 class="pb-4">Group Information</h2>

			<!--
				*** Group Name
				*** Regular groups only have one
				*** registration.  ie. group[0]
			 -->
			<div>
				<BaseInput
					v-model="group[0].name"
					label="Group Name"
					type="text"
					error="Please enter a group name"
				/>
			</div>
			<div>
				<BaseInput
					v-model="group[0].numPerformers"
					label="Number of Performers"
					type="text"
					error="Please enter the number of performers in the group"
				/>
			</div>
			<div>
				<BaseInput
					v-model="group[0].numOfChaperones"
					label="Number of Chaperones"
					type="text"
					error="Please enter the number of chaperones"
				/>
			</div>
			<div>
				<BaseInput
					v-model="group[0].numWheelchairs"
					label="Number of Wheelchairs"
					type="text"
					error="Please enter a group name"
				/>
			</div>
			<fieldset>
				<legend>Group Type</legend>
				<div>
					<BaseRadioGroup
						v-model="group[0].type"
						name="groupType"
						:options="typeOptions"
					/>
				</div>
			</fieldset>
			<!--
	***
	*** Solo Teacher Contact Information
	***
	-->
			<div class="pb-8">
				<h3 class="pb-4">Teacher Information</h3>
				<ContactInfo v-model="teacher" teacher />
			</div>

			<!--
	***
	***  Contact information for each individual
	***  performer in the group
	***
	-->
			<h3>Performer Information</h3>
			<div v-for="(person, index) in performer" :key="person.id">
				{{ index }} - {{ performer.length }}
				<div class="pb-8">
					<h4 class="pb-4">Performer #{{ index + 1 }}</h4>

					<!-- Contact Info Component -->
					<ContactInfo v-model="performer[index]" />
				</div>

				<!-- Listing of other registered classes -->
				<div>
					<BaseTextarea
						v-model="performer[index].otherClasses"
						:label="textAreaLabel"
					/>
				</div>

				<!-- Instrument -->
				<BaseInput
					v-model="performer[index].instrument"
					type="text"
					label="Instrument"
					error="Please enter an instrument"
				/>

				<!-- Instrument Level -->
				<BaseInput
					v-model="performer[index].level"
					type="text"
					label="Level"
					error="Please indicate instrument level"
				/>
				<div class="pt-4">
					<!-- Add Performer Button -->
					<BaseButton
						v-if="index + 1 === performer.length ? true : false"
						class="btn btn-blue"
						@click="addPerformer"
						>Add Performer
					</BaseButton>

					<!-- Remove Performer Button -->
					<BaseButton
						v-if="performer.length > 1 ? true : false"
						id="index"
						class="btn btn-red"
						@click="removePerformer(index)"
						>Remove Performer</BaseButton
					>
					<br /><br />
					{{ performer }}
					<svg viewBox="0 0 800 2">
						<line x1="0" x2="800" stroke="black" />
					</svg>
				</div>
			</div>
		</div>

		<!--
	***
	*** Previous and Next Buttons on the page
	*** Uses custom routes
	***
	-->
		<BaseRouteButton type="button" to="/" class="btn btn-blue"
			>Previous</BaseRouteButton
		>
		<BaseRouteButton type="button" to="/groupclasses" class="btn btn-blue"
			>Next</BaseRouteButton
		>
	</div>
</template>

<script setup lang="ts">
	import { storeToRefs } from 'pinia'
	import { ref, reactive, computed, watch } from 'vue'
	import { useTeacher } from '@/stores/userTeacher'
	import { useGroup } from '@/stores/userGroup'
	import { usePerformers } from '@/stores/userPerformer'
	import { useRegistration } from '@/stores/userRegistration'
	import { textAreaLabel } from '@/composables/formData'

	const registration = useRegistration()

	const groups = useGroup()
	const { group } = storeToRefs(groups)

	const performers = usePerformers()
	const { performer } = storeToRefs(performers)
	function addPerformer() {
		performers.addPerformer()
	}
	function removePerformer(id: number) {
		performers.removePerformer(id)
	}

	const teacher = useTeacher()

	const typeOptions = [
		{
			label: 'Vocal Group',
			description: 'Duets, Trios, Quartets, Ensembles, and Choirs',
			value: 'vocal',
		},
		{
			label: 'Instrumental Group',
			description: 'Duets, Trios, Ensembles, Chamber Groups and Orchestras',
			value: 'instrumental',
		},
		{
			label: 'Mixed Group',
			description:
				'Mixed instrument chamber groups which include both instruments and voice.  Includes class 1945, "Family and/or Friends"',
			value: 'mixed',
		},
	]
</script>

<style scoped></style>
