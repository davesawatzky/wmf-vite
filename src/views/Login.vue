<template>
  <div v-auto-animate>
    <div class="w-full sm:w-2/3 lg:w-1/2 mx-auto">
      <h2 class="text-center">Winnipeg Music Festival Registration</h2>
      <p class="text-left">
        Begin registration by creating an account (account can be for an
        individual; a teacher for all their individual students, or for all
        their choirs; a parent for their family etc.)
      </p>
      <!-- <div
				class="mx-auto text-center border-4 border-red-700 rounded-lg mt-4 p-4">
				<h3>Registration for the 2023 music festival is now closed.</h3>
				<p>Please see the Winnipeg Music Festival homepage for information.</p>
				<BaseButton class="btn btn-blue w-[150px] h-16"
					><a href="https://www.winnipegmusicfestival.org"
						>Winnipeg Music Festival</a
					></BaseButton
				>
			</div> -->
    </div>
    <form
      v-auto-animate
      class="w-full sm:w-3/4 max-w-sm border rounded-lg border-sky-500 p-4 mx-auto mt-8"
    >
      <div v-if="!isLogin">
        <h3 class="loginheading">Sign up</h3>
        <BaseInput
          v-model="first_name"
          name="first_name"
          type="text"
          label="First Name"
        >
        </BaseInput>
        <BaseInput
          v-model="last_name"
          name="last_name"
          type="text"
          label="Last Name"
        >
        </BaseInput>
      </div>
      <h3 v-else class="loginheading">Sign in</h3>
      <BaseInput
        v-model="email"
        autofocus
        name="email"
        type="email"
        label="Email"
        @keyup.enter="isLogin ? signin() : signup()"
        @change="handleChange"
      ></BaseInput>
      <BaseInput
        v-model="password"
        name="password"
        type="password"
        label="Password"
        @keyup.enter="isLogin ? signin() : signup()"
      ></BaseInput>
      <BaseInput
        v-if="!isLogin"
        v-model="password2"
        name="password2"
        type="password"
        label="Re-enter Password"
        @keyup.enter="signup()"
      ></BaseInput>

      <div v-if="error" class="text-red-600 text-center">{{ error }}</div>

      <div class="text-xs text-gray-500">
        Password must:
        <ul class="list-disc pl-4">
          <li>be at least 8 characters</li>
          <li>contain at least 1 uppercase letter</li>
          <li>contain at least 1 number</li>
          <li>contain at least 1 symbol</li>
        </ul>
      </div>

      <div v-if="isLogin">
        <BaseButton
          class="w-full my-4 p-3 rounded-lg btn-blue"
          @click="signin()"
          >Log In
        </BaseButton>
        <br />
        <p class="text-center">
          <a class="hover:text-blue-600" href="#" @click="isLogin = !isLogin"
            >Need to register for an account?</a
          >
        </p>
      </div>
      <div v-else>
        <BaseButton
          class="w-full my-4 p-3 rounded-lg btn-blue"
          @click="signup()"
          >Register New Account
        </BaseButton>
        <p class="text-center">
          <a class="hover:text-blue-600" href="#" @click="isLogin = !isLogin"
            >Already have an account?</a
          >
        </p>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMutation } from '@vue/apollo-composable'
import { useField, useForm } from 'vee-validate'
import { setToken } from '@/composables/setTokens'
import * as yup from 'yup'
import YupPassword from 'yup-password'
import SIGN_IN_MUTATION from '../graphql/mutations/signin.mutation.gql'
import SIGN_UP_MUTATION from '../graphql/mutations/signup.mutation.gql'

YupPassword(yup)

const error = ref('')
const isLogin = ref(true)
const router = useRouter()

const validationSchema = yup.object({
  first_name: yup.string().trim().label('First Name'),
  last_name: yup.string().trim().label('Last Name'),
  email: yup.string().trim().email().required().label('Email'),
  password: yup.string().trim().password().required().label('Password'),
  password2: yup
    .string()
    .trim()
    .password()
    .label('Password 2')
    .oneOf([yup.ref('password')]),
})
const { setFieldValue, handleSubmit } = useForm({
  validationSchema,
})
const { value: first_name } = useField('first_name')
const { value: last_name } = useField('last_name')
const { value: email } = useField('email')
const { value: password } = useField('password')
const { value: password2 } = useField('password2')
const handleChange = (event: any) => {
  setFieldValue('email', event.target.value)
}

/**
 * Sign in and retrieve Token after authenticating
 */
const { mutate: signinMutation, onDone: doneSignin } =
  useMutation(SIGN_IN_MUTATION)
const signin = handleSubmit((values) => {
  signinMutation({
    credentials: { email: values.email, password: values.password },
  })
  doneSignin((result) => {
    if (result.data.signin.access_token) {
      setToken(result.data.signin.access_token)
      router.push('Registrations')
    } else {
      error.value = 'Incorrect email or password.'
      resetFields()
    }
  })
})

/**
 * Register new account and receive Token
 */
const { mutate: signupMutation, onDone: doneSignup } =
  useMutation(SIGN_UP_MUTATION)
const signup = handleSubmit((values) => {
  signupMutation({
    credentials: {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      password: values.password,
    },
  })
  doneSignup((result) => {
    if (result.data.signup.token) {
      setToken(result.data.signup.token)
      router.push('Registrations')
    } else {
      error.value = 'Error occured'
      resetFields()
    }
  })
})

/**
 * Reset Email and Password Fields
 */
function resetFields() {
  setTimeout(() => {
    // first_name.value = ''
    // last_name.value = ''
    error.value = ''
    // email.value = ''
    // password.value = ''
    // password2.value = ''
  }, 2500)
}
</script>

<style scoped>
.loginheading {
  display: flex;
  justify-content: center;
}
</style>
