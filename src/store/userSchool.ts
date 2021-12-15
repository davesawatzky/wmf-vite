import { defineStore } from 'pinia'

export const useSchool = defineStore('school', {
  state: () => ({
    school: {
      schoolID: 0,
      name: '',
      division: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      phone: '',
    },
  }),
  getters: {},
  actions: {},
})
