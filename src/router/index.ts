import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Registrations from '@/views/Registrations.vue'
import Form from '@/views/Form.vue'
import { isauthenticated } from '@/composables/setTokens'
import Submission from '@/views/Submission.vue'

const routes = [
	{ path: '/', name: 'Login', component: Login },
	{
		path: '/registrations',
		name: 'Registrations',
		component: Registrations,
		props: true,
	},
	{
		path: '/form',
		name: 'Form',
		component: Form,
		props: true,
	},
	{
		path: '/submission',
		name: 'Submission',
		component: Submission,
	},

	{
		path: '/:pathMatch(.*)*',
		name: 'NotFound',
		redirect: { name: 'Registrations' },
	},
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

router.beforeEach((to) => {
	if (!isauthenticated() && to.name !== 'Login') {
		return { name: 'Login' }
	}
})

export default router
