<template>
	<div>
		<h2>Welcome to the Registration Website</h2>
		<BaseSpinner v-show="loading"></BaseSpinner>
		<form
			class="max-w-md w-1/2 border-2 rounded-lg p-4 mx-auto mt-8"
			@submit.prevent>
			<h3 class="loginheading">Sign in</h3>
			<BaseInput
				v-model="email"
				type="email"
				label="Email:"
				:error="emailError"></BaseInput>

			<BaseInput
				v-model="password"
				type="password"
				label="Password:"
				@keyup.enter="signin({ credentials: { email, password } })"></BaseInput>
			<BaseInput
				v-if="!isLogin"
				v-model="password2"
				type="password"
				label="Re-enter Password:"
				@keyup.enter="signin({ credentials: { email, password } })"></BaseInput>
			<div v-if="error" class="text-red-600 text-center">{{ error }}</div>

			<div v-if="isLogin">
				<BaseButton
					class="w-full my-4 p-3 rounded-lg btn-blue"
					@click="signin({ credentials: { email, password } })"
					>Log In Account
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
					@click="confirmSignup(password, password2)"
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
	import { useMutation, useMutationLoading } from '@vue/apollo-composable'
	import { useField } from 'vee-validate'
	import { setToken } from '@/composables/setTokens'
	import SIGN_IN_MUTATION from '../graphql/mutations/signin.mutation.gql'
	import SIGN_UP_MUTATION from '../graphql/mutations/signup.mutation.gql'
	import BaseSpinner from '../components/base/BaseSpinner.vue'

	const password = ref('')
	const password2 = ref('')
	const error = ref('')
	const isLogin = ref(true)
	const router = useRouter()
	const loading = useMutationLoading()
	const { value: email, errorMessage: emailError } = useField(
		'email',

		function (value) {
			if (!value) return 'This field is required'
			const regex =
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			if (!regex.test(String(value).toLowerCase())) {
				return 'Please enter a valid email address'
			}
			return true
		}
	)

	/**
	 * Sign in and retrieve Token after authenticating
	 */
	const { mutate: signin, onDone: doneSignin } = useMutation(SIGN_IN_MUTATION)
	doneSignin((result) => {
		if (result.data.signin.token) {
			setToken(result.data.signin.token)
			router.push('Registrations')
		} else {
			error.value = 'Incorrect email or password.'
			resetFields()
		}
	})

	/**
	 * Register new account and receive Token
	 */
	const { mutate: signup, onDone: doneSignup } = useMutation(SIGN_UP_MUTATION)
	doneSignup((result) => {
		if (result.data.signup.token) {
			setToken(result.data.signup.token)
			router.push('Registrations')
		}
	})

	/**
	 * Compares two passwords to make sure they are the same
	 *
	 * @param pass1 First password
	 * @param pass2 Second password
	 */
	function confirmSignup(pass1: string, pass2: string) {
		if (pass1 === pass2) {
			signup({ credentials: { email: email.value, password: password.value } })
		} else {
			error.value = 'Passwords Do Not Match'
			resetFields()
		}
	}

	/**
	 * Reset Email and Password Fields
	 */
	function resetFields() {
		setTimeout(() => {
			error.value = ''
			email.value = ''
			password.value = ''
			password2.value = ''
		}, 2000)
	}
</script>

<style scoped>
	.loginheading {
		display: flex;
		justify-content: center;
	}
</style>
