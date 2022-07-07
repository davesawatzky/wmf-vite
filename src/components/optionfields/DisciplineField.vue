<template>
  <div>
    <BaseSelect
      v-model="classes.festClasses[0].discipline"
      class=""
      label="Discipline Area"
      :options="disciplines"
    />
  </div>
</template>

<script setup lang="ts">
  import { useClasses } from '@/store/userClasses'
  import { useQuery, useResult } from '@vue/apollo-composable'
  import gql from 'graphql-tag'

  const classes = useClasses()
  const { result, loading, error } = useQuery(gql`
    query Discipline {
      disciplines {
        id
        name
      }
    }
  `)
  const disciplines = useResult(result, null, (data) => data.disciplines)
</script>

<style scoped></style>
