<template>
  <div>
    <BaseRouteButton
      type="button"
      to="/solocontactinfo"
      class="btn btn-blue"
      @click="reg.type = 'SOLO'"
      >Solo Performer</BaseRouteButton
    >
    <BaseRouteButton
      type="button"
      to="/groupcontactinfo"
      class="btn btn-blue"
      @click="reg.type = 'GROUP'"
      >Group Performer</BaseRouteButton
    >
    <BaseRouteButton
      type="button"
      to="/school"
      class="btn btn-blue"
      @click="reg.type = 'SCHOOL'"
      >School Groups</BaseRouteButton
    >
  </div>
</template>

<script lang="ts" setup>
  import { useRegistration } from '@/store/userRegistration'
  const reg = useRegistration()
</script>

<style></style>
