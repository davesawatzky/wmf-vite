<script setup lang="ts">
  import { reactive } from 'vue'
  import BaseHeader from '../BaseHeader.vue';

  const state = reactive({
    showMenu: false
  })
	function toggleNav() {
		state.showMenu = !state.showMenu
	}
</script>

<template>
  <Story title="Component/Header">
    <Variant title="playground">
      <template #default>
        <BaseHeader :class="state.showMenu ? 'flex' : 'hidden'" />
      </template>
    </Variant>
  </Story>
</template>
