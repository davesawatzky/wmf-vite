<template>
  <div class="grid grid-rows-3 row-auto grid-cols-12 gap-x-3 gap-y-3 items-end">
    <div class="col-span-6">
      <BaseInput
        v-model="teacher.firstName"
        type="text"
        label="First Name"
        error="Please enter your first name"
      />
    </div>
    <div class="col-span-6">
      <BaseInput
        v-model="teacher.lastName"
        type="text"
        label="Last Name"
        error="Please enter a last name"
      />
    </div>

    <div class="col-span-5">
      <BaseInput
        v-model="teacher.address"
        type="text"
        label="Address"
        error="Please enter a valid address"
      />
    </div>

    <div class="col-span-3">
      <BaseInput
        v-model="teacher.city"
        type="text"
        label="City/Town"
        error="Please enter a city or town"
      />
    </div>

    <div class="col-span-2">
      <BaseSelect
        v-model="teacher.province"
        label="Province"
        :options="provinces"
      />
    </div>

    <div class="col-span-2">
      <BaseInput
        v-model="teacher.postalCode"
        type="text"
        label="Postal Code"
        error="Please enter a last name"
      />
    </div>

    <div class="col-span-5">
      <BaseInput
        v-model="teacher.phone"
        type="tel"
        label="Phone Number"
        error="Please enter a valid phone number"
      />
    </div>

    <div class="col-span-7">
      <BaseInput
        v-model="teacher.email"
        type="email"
        label="Email"
        error="Please enter an email address"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useTeacher } from '@/store/userTeacher'
  import { provinces } from '@/composables/formData'
  const teacher = useTeacher()
</script>
