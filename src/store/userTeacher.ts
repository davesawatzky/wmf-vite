import { defineStore } from 'pinia'

export const useTeacher = defineStore('teacher', {
  state: () => ({
    registrationID: 24,
    teacherID: 35,
    lastName: 'Regier Sawatzky',
    firstName: 'Tracey',
    address: '804 Wicklow Rd.',
    city: 'Winnipeg',
    province: 'MB',
    postalCode: 'R3T 2N2',
    phone: '(204) 599-3529',
    email: 'davntrac@gmail.com',
  }),
  getters: {
    fullName() {
      return this.firstName + ' ' + this.lastName
    },
  },
  actions: {},
})
