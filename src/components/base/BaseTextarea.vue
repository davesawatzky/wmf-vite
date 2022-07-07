<template>
  <div>
    <label v-if="label" class="" :for="uuid">{{ label }}</label>
    <textarea
      v-bind="$attrs"
      :id="uuid"
      :value="modelValue"
      :aria-describedby="error ? `${uuid}-error` : ''"
      :aria-invalid="error ? true : false"
      @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    ></textarea>
  </div>
  <p
    v-if="error"
    :id="`${uuid}-error`"
    class="errorMessage"
    aria-live="assertive"
  >
    {{ error }}
  </p>
</template>

<script setup lang="ts">
  import UniqueID from '@/composables/UniqueID'

  defineProps({
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
  })
  defineEmits(['update:modelValue'])
  const uuid = UniqueID().getID()
</script>
