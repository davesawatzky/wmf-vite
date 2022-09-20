import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Registrations from '@/views/Registrations.vue'
import Form from '@/views/Form.vue'
import Summary from '@/views/Summary.vue'
import { isauthenticated } from '@/composables/setTokens'
import Validations from '@/views/validations.vue'

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
		path: '/summary',
		name: 'Summary',
		component: Summary,
		props: true,
	},
	{ path: '/validations', name: 'Validations', component: Validations },

	// { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
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
