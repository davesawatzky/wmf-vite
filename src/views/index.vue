<template>
  <div>
    <BaseRouteButton type="button" to="/contactinfo" class="btn btn-blue"
      >Solo Performer</BaseRouteButton
    >
    <BaseRouteButton type="button" to="/contactinfo" class="btn btn-blue"
      >Group Performer</BaseRouteButton
    >
    <BaseRouteButton type="button" to="/school" class="btn btn-blue"
      >School Groups</BaseRouteButton
    >
  </div>
</template>

<script lang="ts" setup>
  import { useStore } from '@/store/registration'

  const store = useStore()
</script>

<style></style>
