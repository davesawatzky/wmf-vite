<template>
  <router-link v-slot="{ navigate }" to="" custom>
    <button v-bind="$attrs" type="button" @click="navigate">
      <slot />
    </button>
  </router-link>
</template>

<script setup lang="ts"></script>
<style scoped></style>
