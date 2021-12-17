<template>
  <div class="grid grid-rows-3 grid-cols-12 gap-x-3 gap-y-3 items-end">
    <div class="col-span-5">
      <BaseInput
        v-model="performers.performer[0].firstName"
        type="text"
        label="First Name"
        error="Please enter a first name"
      />
    </div>
    <div class="col-span-4">
      <BaseInput
        v-model="performers.performer[0].lastName"
        type="text"
        label="Last Name"
        error="Please enter a last name"
      />
    </div>
    <div class="col-span-3">
      <BaseInput
        v-model="performers.performer[0].age"
        type="number"
        :label="'Age on December 31, ' + currentYear"
        error="Please enter an age"
      />
    </div>
    <div class="col-span-5">
      <BaseInput
        v-model="performers.performer[0].address"
        type="text"
        label="Address"
        error="Please enter a valid address"
      />
    </div>
    <div class="col-span-3">
      <BaseInput
        v-model="performers.performer[0].city"
        type="text"
        label="City/Town"
        error="Please enter a city or town"
      />
    </div>
    <div class="col-span-2">
      <BaseSelect
        v-model="performers.performer[0].province"
        label="Province"
        :options="provinces"
      />
    </div>
    <div class="col-span-2">
      <BaseInput
        v-model="performers.performer[0].postalCode"
        type="text"
        label="Postal Code"
        error="Please enter a last name"
      />
    </div>
    <div class="col-span-5">
      <BaseInput
        v-model="performers.performer[0].phone"
        type="tel"
        label="Phone Number"
        error="Please enter a valid phone number"
      />
    </div>
    <div class="col-span-7">
      <BaseInput
        v-model="performers.performer[0].email"
        type="email"
        label="Email"
        error="Please enter an email address"
      />
    </div>
    <BaseInput
      v-if="registrationType !== 'solo'"
      v-model="performers.performer[0].instrument"
      type="text"
      label="Instrument"
      error="Please enter an instrument"
    />
    <BaseInput
      v-if="registrationType !== 'solo'"
      v-model="performers.performer[0].level"
      type="text"
      label="Level"
      error="Please indicate instrument level"
    />
  </div>
  <div class="pt-4">
    <BaseTextarea :label="textAreaLabel" />
  </div>
</template>

<script lang="ts" setup>
  import { usePerformers } from '@/store/userPerformer'
  import { storeToRefs } from 'pinia'
  import { useStore } from '@/store/registration'
  import { provinces, textAreaLabel } from '@/composables/formData'
  import BaseTextarea from '../base/BaseTextarea.vue'

  const performers = usePerformers()
  const { registrationType } = storeToRefs(useStore())
  const currentYear = new Date().getFullYear()
</script>

<style scoped></style>
