<template>
  <div>
    <h2>Welcome to the Registration Website</h2>
    <form class="max-w-md w-1/2 border-2 rounded-lg p-4 mx-auto mt-16">
      <h3 class="loginheading">Sign in</h3>
      <BaseInput v-model="email" type="email" label="Email:"></BaseInput>
      <BaseInput
        v-model="password"
        type="password"
        label="Password:"
      ></BaseInput>
      <BaseButton
        class="mt-4 btn btn-blue"
        @click="signin({ credentials: { email, password } })"
        >Sign in
      </BaseButton>
    </form>
    <BaseRouteButton to="SignUp" class="btn btn-blue">Register</BaseRouteButton>
    <div v-if="loading">Loading...</div>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'
  import { useMutation } from '@vue/apollo-composable'
  import SIGN_IN_MUTATION from '../graphql/signin.mutation.gql'
  import { ref } from 'vue'

  const email = ref('')
  const password = ref('')
  const router = useRouter()

  const { mutate: signin, loading, onDone } = useMutation(SIGN_IN_MUTATION)

  onDone((result) => {
    if (result.data.signin.token) {
      localStorage.setItem('diatonicToken', result.data.signin.token)
      router.push('Registrations')
    }
  })
</script>

<style scoped>
  .loginheading {
    display: flex;
    justify-content: center;
  }
</style>
