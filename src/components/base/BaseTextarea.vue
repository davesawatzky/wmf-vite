<template>
  <div>
    <label v-if="label" class="" :for="uuid">{{ label }}</label>
    <textarea
      v-bind="$attrs"
      :id="uuid"
      :value="modelValue"
      :aria-describedby="error ? `${uuid}-error` : null"
      :aria-invalid="error ? true : null"
      @input="$emit('update:modelValue', $event.target.value)"
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

<script lang="ts">
  import { defineComponent } from 'vue'
  import UniqueID from '@/composables/UniqueID'

  export default defineComponent({
    props: {
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
    },
    emits: ['update:modelValue'],
    setup() {
      const uuid = UniqueID().getID()
      return {
        uuid,
      }
    },
  })
</script>
