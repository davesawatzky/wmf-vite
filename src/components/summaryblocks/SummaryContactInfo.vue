<template>
  <div>
    <h4>{{ fullName }}</h4>
    <p>{{ address }}</p>
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
  const props = defineProps({
    fullName: {
      type: String,
      default: '',
    },
    address: {
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
