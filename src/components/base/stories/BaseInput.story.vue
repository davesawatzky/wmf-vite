<script setup lang="ts">
import BaseInput from '../BaseInput.vue'
</script>

<template>
  <Story title="Component/BaseInput" :layout="{ type: 'grid', width: '300px' }">
    <Variant title="Text">
      <BaseInput type="text"></BaseInput>
    </Variant>
    <Variant title="Number">
      <BaseInput type="number"></BaseInput>
    </Variant>
    <Variant title="Postal Code">
      <BaseInput v-maska type="text" data-maska="A#A #A#"></BaseInput>
    </Variant>
    <Variant title="Phone">
      <BaseInput v-maska type="tel" data-maska="(###) ###-####"></BaseInput>
    </Variant>
    <Variant title="Email">
      <BaseInput type="email"></BaseInput>
    </Variant>
  </Story>
</template>
