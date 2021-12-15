<template>
  <div>
    <table
      class="table-fixed border-collapse border rounded-xl border-gray-400 w-full"
    >
      <thead class="bg-gray-300">
        <tr>
          <th scope="col">Class Number</th>
          <th scope="col">Class Name</th>
          <th scope="col">Grade/Level/Age</th>
          <th scope="col">Category</th>
          <th scope="col">Price</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="fclass in classes" :key="fclass.classNumber">
          <td>{{ fclass.classNumber }}</td>
          <td>{{ fclass.className }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { useClasses } from '@/store/userClasses'

  const classes = useClasses()
</script>

<style scoped>
  th,
  td {
    padding: 0.15rem;
  }
</style>
