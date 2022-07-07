<template>
  <!-- Solo Class Information Page -->
  <div class="pb-8">
    <h2 class="pb-4">Solo Class Information</h2>

    <!-- List of Registered Classes by the Performer-->
    <div
      v-for="(selectedClass, index) in selectedClasses"
      :key="selectedClass.id"
    >
      <div class="pb-8">
        <h3 class="pb-4">Class {{ index + 1 }}</h3>

        <!-- Loads the Class component where performers get to select their classes.
				 Pushes the selectedClasses prop -->
        <Class v-model="selectedClasses[index]" />
      </div>
      <div class="pt-4">
        <!-- Add Class Button -->
        <BaseButton
          v-if="index + 1 === selectedClasses.length ? true : false"
          class="btn btn-blue"
          @click="addClass"
          >Add Class
        </BaseButton>

        <!-- Remove Performer Button -->
        <BaseButton
          v-if="selectedClasses.length > 1 ? true : false"
          id="index"
          class="btn btn-red"
          @click="removeClass(index)"
          >Remove Class</BaseButton
        >
        <br /><br />
        {{ classes }}
        <svg viewBox="0 0 800 2">
          <line x1="0" x2="800" stroke="black" />
        </svg>
      </div>
    </div>
  </div>

  <!-- Route Buttons -->
  <BaseRouteButton type="button" to="SoloContactInfo" class="btn btn-blue"
    >Previous</BaseRouteButton
  >
  <BaseRouteButton type="button" to="Summary" class="btn btn-blue"
    >Next</BaseRouteButton
  >
</template>

<script setup lang="ts">
  import { useClasses } from '@/store/userClasses'
  import { storeToRefs } from 'pinia'

  defineProps({
    performerType: {
      type: String,
      default: 'Solo',
    },
    id: {
      type: String,
      default: '',
    },
    edit: {
      type: String,
      default: 'false',
    },
  })

  // Performer class selections
  const classes = useClasses()
  const { selectedClasses } = storeToRefs(classes)
  function addClass() {
    classes.addClass()
  }
  function removeClass(id: number) {
    classes.removeClass(id)
  }
</script>

<style scoped></style>
