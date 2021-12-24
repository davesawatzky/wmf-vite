<template>
  <div>
    <!--
	***
	*** Group Information
	***
	-->
    <div class="pb-8">
      <h2 class="pb-4">Group Information</h2>
      <div>
        <BaseInput
          v-model="groups.group[0].name"
          label="Group Name"
          type="text"
          error="Please enter a group name"
        />
      </div>
      <div>
        <BaseInput
          v-model="groups.group[0].numPerformers"
          label="Number of Performers"
          type="text"
          error="Please enter the number of performers in the group"
        />
      </div>
      <div>
        <BaseInput
          v-model="groups.group[0].numOfChaperones"
          label="Number of Chaperones"
          type="text"
          error="Please enter the number of chaperones"
        />
      </div>
      <div>
        <BaseInput
          v-model="groups.group[0].numWheelchairs"
          label="Number of Wheelchairs"
          type="text"
          error="Please enter a group name"
        />
      </div>
      <fieldset>
        <legend>Group Type</legend>
        <div>
          <BaseRadioGroup
            v-model="groups.group[0].type"
            name="groupType"
            :options="typeOptions"
          />
        </div>
      </fieldset>

      <!--
	***
	***  Contact information for each individual
	***  performer in the group
	***
	-->

      <h3>Performer Information</h3>
      <div v-for="(person, index) in performers.performer" :key="person.id">
        {{ index }} - {{ groups.group[0].numPerformers }}
        <div class="pb-8">
          <h4 class="pb-4">Performer #{{ index + 1 }}</h4>
          <ContactInfo v-model="performers.performer[index]" />
        </div>
        <div>
          <BaseTextarea :label="textAreaLabel" />
        </div>
        <BaseInput
          v-model="performers.performer[index].instrument"
          type="text"
          label="Instrument"
          error="Please enter an instrument"
        />
        <BaseInput
          v-model="performers.performer[index].level"
          type="text"
          label="Level"
          error="Please indicate instrument level"
        />
        <div class="pt-4">
          <BaseButton class="btn btn-blue" @click="addPerformer"
            >Add Performer
          </BaseButton>
          <BaseButton v-if="moreThanOne" class="btn btn-red"
            >Remove Performer</BaseButton
          ><br /><br />
          <svg viewBox="0 0 800 2">
            <line x1="0" x2="800" stroke="black" />
          </svg>
        </div>
      </div>
    </div>

    <!--
	***
	*** Solo Teacher Contact Information
	***
	-->
    <div class="pb-8">
      <h2 class="pb-4">Teacher Information</h2>
      <ContactInfo v-model="teacher" teacher />
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
  import { useTeacher } from '@/store/userTeacher'
  import { useGroup } from '@/store/userGroup'
  import { usePerformers } from '@/store/userPerformer'
  import { useRegistration } from '@/store/userRegistration'
  import { textAreaLabel } from '@/composables/formData'
  import ContactInfo from '@/components/formblocks/ContactInfo.vue'
  import BaseInput from '@/components/base/BaseInput.vue'
  import BaseRadioGroup from '@/components/base/BaseRadioGroup.vue'

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
  const groups = useGroup()
  const teacher = useTeacher()
  const performers = usePerformers()
  const registration = useRegistration()

  function addPerformer() {
    //*****Done Here   */
    performers.performer.push
  }
</script>

<style scoped></style>
