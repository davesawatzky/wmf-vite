<template>
  <div class="pb-8">
    <h2 class="pb-4">Solo Performer Information</h2>
    <PerformerInfo />
  </div>
  <div class="pb-8">
    <h2 class="pb-4">Teacher Information</h2>
    <TeacherInfo />
  </div>
  <BaseRouteButton type="button" to="/" class="btn btn-blue"
    >Previous</BaseRouteButton
  >
  <BaseRouteButton type="button" to="/soloclasses" class="btn btn-blue"
    >Next</BaseRouteButton
  >
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>
