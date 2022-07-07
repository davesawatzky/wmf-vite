<template>
  <div>
    <h2>Welcome to the Registration Website</h2>
    <form class="max-w-md w-1/2 border-2 rounded-lg p-4 mx-auto mt-16">
      <h3 class="loginheading">Sign Up</h3>
      <BaseInput v-model="email" type="email" label="Email:"></BaseInput>
      <BaseInput
        v-model="password"
        type="password"
        label="Password:"
      ></BaseInput>
      <BaseInput
        v-model="password2"
        type="password"
        label="Re-enter Password:"
      ></BaseInput>
      <div v-if="passworderror">{{ passworderror }}</div>
      <BaseButton
        class="mt-4 btn btn-blue"
        @click="confirmSignup(password, password2)"
        >Create Account
      </BaseButton>
    </form>
    <BaseRouteButton to="/" class="btn btn-blue">Login </BaseRouteButton>
    <div v-if="loading">Loading...</div>
    <div>{{ email }}</div>
    <div>{{ password }}</div>
    <div>{{ password2 }}</div>
  </div>
</template>

<script setup lang="ts">
  import { useMutation } from '@vue/apollo-composable'
  import SIGN_UP_MUTATION from '../graphql/signup.mutation.gql'
  import { ref } from 'vue'

  const email = ref('')
  const password = ref('')
  const password2 = ref('')
  const passworderror = ref('')

  function confirmSignup(pass1: string, pass2: string) {
    if (pass1 !== pass2) {
      passworderror.value = 'Passwords Do Not Match'
      console.log(passworderror)
    } else {
      signup({ credentials: { email: email.value, password: password.value } })
    }
  }

  const { mutate: signup, loading, onDone } = useMutation(SIGN_UP_MUTATION)

  onDone((result) => {
    if (result.data.signup.token) {
      localStorage.setItem('token', result.data.signup.token)
    }
  })
</script>

<style scoped>
  .loginheading {
    display: flex;
    justify-content: center;
  }
</style>
