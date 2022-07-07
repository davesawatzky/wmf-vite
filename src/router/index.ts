import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/index.vue'
import Registrations from '@/views/Registrations.vue'
import SoloContactInfo from '@/views/SoloContactInfo.vue'
import GroupContactInfo from '@/views/GroupContactInfo.vue'
import SignUp from '@/views/SignUp.vue'
import School from '@/views/School.vue'
import SoloClasses from '@/views/SoloClasses.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/signup', name: 'SignUp', component: SignUp, props: true },
  { path: '/school', name: 'School', component: School, props: true },
  {
    path: '/registrations',
    name: 'Registrations',
    component: Registrations,
    props: true,
  },
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

  // { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
