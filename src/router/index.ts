import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Registrations from '@/views/Registrations.vue'
import Form from '@/views/Form.vue'
import Summary from '@/views/Summary.vue'

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

	// { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
