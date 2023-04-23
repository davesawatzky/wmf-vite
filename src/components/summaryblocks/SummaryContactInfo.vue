<template>
  <div>
    <h4>{{ fullName }}</h4>
    <div v-if="contact.age">Age: {{ contact.age }}</div>
    <div>Address:</div>
    <div v-if="contact.apartment">
      {{ contact.apartment }} - {{ contact?.street_number }}
      {{ contact.street_name }}
    </div>
    <div v-else>
      {{ contact.street_number }}
      {{ contact.street_name }}
    </div>
    <div>
      {{ contact.city }},
      {{ contact.province }}
    </div>
    <div>{{ contact.postal_code }}</div>
    <div>Phone: {{ contact.phone }}</div>
    <div>Email: {{ contact.email }}</div>
    <div v-if="contact.instrument">Instrument: {{ contact?.instrument }}</div>
    <div v-if="contact.level">Grade Level: {{ contact.level }}</div>
    <div v-if="contact.other_classes">
      Participating in other classes: {{ contact.other_classes }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  contact: {
    type: Object,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
})
</script>

<style scoped></style>
