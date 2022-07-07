<template>
  <component
    :is="vertical ? 'div' : 'span'"
    v-for="option in options"
    :key="option.value"
    :class="{
      horizontal: !vertical,
    }"
  >
    <BaseRadio
      :label="option.label"
      :description="option.description"
      :value="option.value"
      :model-value="modelValue"
      :name="name"
      @update:model-value="$emit('update:modelValue', $event.target.value)"
    />
  </component>
</template>

<script setup lang="ts">
  interface OptionsType {
    value: string | number
    label: string
    description: string
  }

  defineProps({
    options: {
      type: Array as PropType<Array<OptionsType>>,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    modelValue: {
      type: [String, Number],
      required: true,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
  })

  defineEmits(['update:modelValue'])
</script>

<style scoped>
  .horizontal {
    margin-right: 20px;
  }
</style>
