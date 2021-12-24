<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <select
      :value="modelValue"
      v-bind="{
        ...$attrs,
        onChange: ($event) => {
          $emit('update:modelValue', $event.target.value)
        },
      }"
    >
      <option
        v-for="option in options"
        :key="option.id"
        :value="option.name"
        :selected="option.name === modelValue"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: [String, Number],
      default: '',
    },
    options: {
      type: Array,
      required: true,
    },
  })

  const emits = defineEmits(['update:modelValue'])
</script>
