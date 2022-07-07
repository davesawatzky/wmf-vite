<template>
  <label v-if="label" :for="uuid">{{ label }}</label>
  <input
    :id="uuid"
    v-bind="$attrs"
    :value="modelValue"
    :aria-describedby="error ? `${uuid}-error` : ''"
    :aria-invalid="error ? true : false"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
  import UniqueID from '@/composables/UniqueID'
  const uuid = UniqueID().getID()

  defineProps({
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
  })
  defineEmits(['update:modelValue'])
</script>
