<template>
  <div>
    <BaseSelect
      v-model="classes.classes[0].subdiscipline"
      class=""
      label="Instrument"
      :options="instruments"
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
      subdisciplines {
        id
        name
      }
    }
  `)
  const instruments = useResult(result, null, (data) => data.subdisciplines)
</script>

<style scoped></style>
