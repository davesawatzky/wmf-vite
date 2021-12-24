<template>
  <div>
    <BaseSelect
      v-model="classes.classes[0].level"
      class=""
      label="Grade/Level"
      :options="gradelevel"
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
      levels {
        id
        name
      }
    }
  `)
  const gradelevel = useResult(result, null, (data) => data.levels)
</script>

<style scoped></style>
