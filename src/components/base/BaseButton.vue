<!-- 
BaseButton
@param type The Type of button.

-->

<template>
  <button v-bind="$attrs" type="button">
    <slot />
  </button>
</template>

<script setup lang="ts"></script>
<style scoped></style>
