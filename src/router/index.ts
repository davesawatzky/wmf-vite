import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Registrations from '@/views/Registrations.vue'
import SoloContactInfo from '@/views/SoloContactInfo.vue'
import GroupContactInfo from '@/views/GroupContactInfo.vue'
import GroupClasses from '@/views/GroupClasses.vue'
import School from '@/views/School.vue'
import SoloClasses from '@/views/SoloClasses.vue'
import Form from '@/views/Form.vue'

const routes = [
	{ path: '/', name: 'Login', component: Login },
	{
		path: '/form',
		name: 'Form',
		component: Form,
		props: true,
		children: [
			{
				path: '/solocontactinfo',
				name: 'SoloContactInfo',
				component: SoloContactInfo,
				props: true,
			},
			{
				path: '/soloclasses',
				name: 'SoloClasses',
				component: SoloClasses,
				props: true,
			},
			{
				path: '/groupcontactinfo',
				name: 'GroupContactInfo',
				component: GroupContactInfo,
				props: true,
			},
			{
				path: '/groupclasses',
				name: 'GroupClasses',
				component: GroupClasses,
				props: true,
			},
			{
				path: '/school',
				name: 'School',
				component: School,
				props: true,
			},
		],
	},

	{
		path: '/registrations',
		name: 'Registrations',
		component: Registrations,
		props: true,
	},

	// { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

export default router
