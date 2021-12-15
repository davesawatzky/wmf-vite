import { defineStore } from 'pinia'

export const usePerformers = defineStore('performers', {
  state: () => ({
    performer: [
      {
        performerID: 0,
        lastName: '',
        firstName: '',
        address: '',
        city: '',
        province: '',
        postalCode: '',
        phone: '',
        email: '',
        instrument: '',
        level: '',
        age: 0,
        otherClasses: [''],
      },
    ],
  }),
  getters: {
    fullName() {
      return this.performer[0].firstName + ' ' + this.performer[0].lastName
    },
  },
  actions: {},
})
