<template>
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error.message }}</div>
  <div v-else>
    <table>
      <thead>
        <tr>
          <th>Edit</th>
          <th>Type</th>
          <th>ID</th>
          <th>Created</th>
          <th>Label</th>
          <th>Type</th>
          <th>Submitted</th>
          <th>Payed Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="registration in registrations" :key="registration.id">
          <td>
            <BaseButton
              class="btn btn-blue"
              @click="
                editRegistration(registration.id, registration.performerType)
              "
              >Edit</BaseButton
            >
          </td>
          <td v-for="col in registration" :key="registration.id + col">
            {{ col }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="border border-gray-300 rounded-lg text-center mt-20">
    <h3>Create new Registration Form</h3>
    <BaseRouteButton
      type="button"
      to="SoloContactInfo"
      edit="false"
      class="btn btn-blue"
      @click="'SOLO'"
      >Solo Performer</BaseRouteButton
    >
    <BaseRouteButton
      type="button"
      to="GroupContactInfo"
      edit="false"
      class="btn btn-blue"
      @click="'GROUP'"
      >Group Performer</BaseRouteButton
    >
    <BaseRouteButton
      type="button"
      to="School"
      edit="false"
      class="btn btn-blue"
      @click="'SCHOOL'"
      >School Groups</BaseRouteButton
    >
  </div>
</template>

<script lang="ts" setup>
  // import { useRegistration } from '@/store/userRegistration'
  import { computed } from 'vue'
  import { useQuery } from '@vue/apollo-composable'
  import REGISTRATION_QUERY from '../graphql/queries/registrations.query.gql'
  import BaseButton from '@/components/base/BaseButton.vue'

  import { useRouter } from 'vue-router'

  const { result, loading, error } = useQuery(REGISTRATION_QUERY)
  const registrations = computed(() => result.value?.registrations ?? [])

  const router = useRouter()
  let name = ''

  function editRegistration(id: string, performerType: string) {
    switch (performerType) {
      case 'SOLO':
        name = 'SoloContactInfo'
        break
      case 'GROUP':
        name = 'GroupContactInfo'
        break
      case 'SCHOOL':
        name = 'School'
        break
    }

    router.push({
      name,
      params: {
        edit: 'true',
        performerType,
        registrationId: id,
      },
    })
  }
</script>

<style scoped>
  table {
    border-radius: 20px;
    overflow: hidden;
    border-collapse: collapse;
  }

  thead {
    background-color: blue;
    color: #fff;
  }
  tr {
    border-bottom: 1px solid #c1c1c1;
  }

  td,
  th {
    padding: 7px 10px;
  }
</style>
