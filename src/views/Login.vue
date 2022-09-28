<template>
	<div>
		<h2>Welcome to the Registration Website</h2>
		<form class="max-w-md w-1/2 border-2 rounded-lg p-4 mx-auto mt-8">
			{{ isLogin }}
			<h3 class="loginheading">Sign in</h3>
			<BaseInput
				v-model="email"
				name="email"
				type="email"
				label="Email"
				@keyup.enter="isLogin ? signin() : signup()"
				@change="handleChange"></BaseInput>
			<BaseInput
				v-model="password"
				name="password"
				type="password"
				label="Password"
				@keyup.enter="isLogin ? signin() : signup()"></BaseInput>
			<BaseInput
				v-if="!isLogin"
				v-model="password2"
				name="password2"
				type="password"
				label="Re-enter Password"
				@keyup.enter="signup()"></BaseInput>

			<div v-if="error" class="text-red-600 text-center">{{ error }}</div>

			<div v-if="isLogin">
				<BaseButton
					class="w-full my-4 p-3 rounded-lg btn-blue"
					@click="signin()"
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
	import { useMutation, useMutationLoading } from '@vue/apollo-composable'
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
		email: yup.string().trim().email().required().label('Email'),
		password: yup.string().trim().password().required().label('Password'),
		password2: yup
			.string()
			.trim()
			.password()
			.label('Password Check')
			.oneOf([yup.ref('password')]),
	})
	const { errors, setFieldValue, handleSubmit } = useForm({
		validationSchema,
	})
	const { value: email } = useField('email')
	const { value: password } = useField('password')
	const { value: password2 } = useField('password2')
	const handleChange = (event) => {
		setFieldValue('email', event.target.value)
	}

	/**
	 * Sign in and retrieve Token after authenticating
	 */
	const signin = handleSubmit((values) => {
		const { mutate: signinMutation, onDone: doneSignin } =
			useMutation(SIGN_IN_MUTATION)
		// const signin = handleSubmit((values) => {
		signinMutation({
			credentials: { email: values.email, password: values.password },
		})
		doneSignin((result) => {
			if (result.data.signin.token) {
				setToken(result.data.signin.token)
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
	const signup = handleSubmit((values) => {
		const { mutate: signupMutation, onDone: doneSignup } =
			useMutation(SIGN_UP_MUTATION)
		// const signup = handleSubmit((values) => {
		signupMutation({
			credentials: { email: values.email, password: values.password },
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
			error.value = ''
			email.value = ''
			password.value = ''
			password2.value = ''
		}, 2500)
	}
</script>

<style scoped>
	.loginheading {
		display: flex;
		justify-content: center;
	}
</style>
