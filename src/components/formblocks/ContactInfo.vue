<template>
  <!--
	**
	**  Contact Information Component
	**  Used for Solo and Group registrations
	**
-->
  <div class="grid grid-rows-3 grid-cols-12 gap-x-3 gap-y-3 items-end">
    <div class="col-span-5">
      <BaseInput
        v-model="contact.firstName"
        type="text"
        label="First Name"
        error="Please enter a first name"
      />
    </div>
    <div class="col-span-4">
      <BaseInput
        v-model="contact.lastName"
        type="text"
        label="Last Name"
        error="Please enter a last name"
      />
    </div>
    <div v-if="!teacher" class="col-span-3">
      <BaseInput
        v-model="contact.age"
        type="number"
        :label="'Age on December 31, ' + currentYear"
        error="Please enter an age"
      />
    </div>

    <div class="col-span-5">
      <BaseInput
        v-model="contact.address"
        type="text"
        label="Address"
        error="Please enter a valid address"
      />
    </div>
    <div class="col-span-3">
      <BaseInput
        v-model="contact.city"
        type="text"
        label="City/Town"
        error="Please enter a city or town"
      />
    </div>
    <div class="col-span-2">
      <BaseSelect
        v-model="contact.province"
        label="Province"
        :options="provinces"
      />
    </div>
    <div class="col-span-2">
      <BaseInput
        v-model="contact.postalCode"
        type="text"
        label="Postal Code"
        error="Please enter a last name"
      />
    </div>
    <div class="col-span-5">
      <BaseInput
        v-model="contact.phone"
        type="tel"
        label="Phone Number"
        error="Please enter a valid phone number"
      />
    </div>
    <div class="col-span-7">
      <BaseInput
        v-model="contact.email"
        type="email"
        label="Email"
        error="Please enter an email address"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { useRegistration } from '@/store/userRegistration'
  import { provinces } from '@/composables/formData'

  const registration = useRegistration()
  const currentYear = new Date().getFullYear()

  const props = defineProps({
    modelValue: {
      type: Object,
      default: () => ({}),
    },
    teacher: {
      type: Boolean,
      required: false,
    },
  })
  /**
   * Sets the model value from all the props.
   * Allows the 'BaseInput' components to set
   * the model value in props.
   */
  const contact = computed({
    get: () => props.modelValue,
    set: (value) => emits('update:modelValue', value),
  })
  const emits = defineEmits(['update:modelValue'])
</script>

<style scoped></style>
