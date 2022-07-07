<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <select
      :id="uuid"
      :value="modelValue"
      v-bind="{
        ...$attrs,
        onChange: ($event) => {
          $emit('update:modelValue', ($event.target as HTMLInputElement).value )
        },
      }"
    >
      <option
        v-for="option in options"
        :key="option.id"
        :value="option.id"
        :selected="option === modelValue"
      >
        {{ option.name }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
  import UniqueID from '@/composables/UniqueID'

  defineProps({
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

  defineEmits(['update:modelValue'])
  const uuid = UniqueID().getID()
</script>
