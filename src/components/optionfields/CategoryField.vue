<template>
  <div>
    <BaseSelect
      v-model="classes.classes[0].category"
      class=""
      label="Category"
      :options="categories"
    />
  </div>
</template>

<script setup lang="ts">
  import { useClasses } from '@/store/userClasses'
  import { useQuery, useResult } from '@vue/apollo-composable'
  import gql from 'graphql-tag'

  const classes = useClasses()
  const { result, loading, error } = useQuery(gql`
    query {
      categories {
        id
        name
      }
    }
  `)
  const categories = useResult(result, null, (data) => data.categories)
</script>

<style scoped></style>
