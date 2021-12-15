import { defineStore } from 'pinia'

export const useTeacher = defineStore('teacher', {
  state: () => ({
    teacherID: 0,
    lastName: '',
    firstName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    email: '',
  }),
  getters: {
    teacherFullName() {
      return this.firstName + ' ' + this.lastName
    },
  },
  actions: {},
})
