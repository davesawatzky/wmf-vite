<template>
  <div>
    <h3 class="pt-12 pb-2">Performer</h3>
    <h4>{{ performers.soloFullName }}</h4>
    <p>{{ performers.performer[0].address }}</p>
    <p>
      {{ performers.performer[0].city }},
      {{ performers.performer[0].province }}
    </p>
    <p>{{ performers.performer[0].postalCode }}</p>
    <p>{{ performers.performer[0].phone }}</p>
    <p>{{ performers.performer[0].email }}</p>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
