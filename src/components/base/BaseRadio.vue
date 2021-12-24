<template>
  <input
    type="radio"
    :checked="modelValue === value"
    :value="value"
    v-bind="$attrs"
    @change="$emit('update:modelValue', value)"
  />
  <label v-if="label">{{ label }}</label>
  <p v-if="description">{{ description }}</p>
</template>

<script lang="ts">
  import { defineComponent } from 'vue'
  export default defineComponent({
    props: {
      label: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
      modelValue: {
        type: [String, Number],
        default: '',
      },
      value: {
        type: [String, Number],
        required: true,
      },
    },
    emits: ['update:modelValue'],
  })
</script>
