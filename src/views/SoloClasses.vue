<template>
  <!--
***
*** Solo Class Information Page
***
*** -->
  <div class="pb-8">
    <h2 class="pb-4">Solo Class Information</h2>
    <!--
			***
			*** List of Registered Classes
			***
		 -->
    <div v-for="(festClass, index) in festClasses" :key="festClass.id">
      {{ index }} - {{ festClasses.length }}
      <div class="pb-8">
        <h3 class="pb-4">Class {{ index + 1 }}</h3>
        <!-- 
					*** Loads the Class component where
					*** performers get to select their
					*** classes.
					***
					*** pushes the festClasses prop
				 -->
        <Class v-model="festClasses[index]" />
      </div>
      <div class="pt-4">
        <!-- Add Class Button -->
        <BaseButton
          v-if="index + 1 === festClasses.length ? true : false"
          class="btn btn-blue"
          @click="addClass"
          >Add Class
        </BaseButton>

        <!-- Remove Performer Button -->
        <BaseButton
          v-if="festClasses.length > 1 ? true : false"
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

  <!-- 
		***
		*** Route Buttons
		***
	 -->
  <BaseRouteButton type="button" to="/solocontactinfo" class="btn btn-blue"
    >Previous</BaseRouteButton
  >
  <BaseRouteButton type="button" to="/summary" class="btn btn-blue"
    >Next</BaseRouteButton
  >
</template>

<script setup lang="ts">
  import { useClasses } from '@/store/userClasses'
  import { storeToRefs } from 'pinia'

  const classes = useClasses()
  const { festClasses } = storeToRefs(classes)
  function addClass() {
    classes.addClass()
  }
  function removeClass(id: number) {
    classes.removeClass(id)
  }
</script>

<style scoped></style>
