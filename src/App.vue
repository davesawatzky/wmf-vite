<template>
  <div
    class="bg-white py-8 px-6 rounded-lt sm:px-10 my-8 lg:max-w-5xl mx-auto rounded shadow-xl"
  >
    <h1 class="pb-8">Winnipeg Music Festival</h1>
    <form class="" @submit.prevent="">
      <router-view></router-view>
    </form>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
