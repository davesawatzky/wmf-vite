import { defineStore } from 'pinia'

export const usePerformers = defineStore('performers', {
  state: () => ({
    registrationID: 0,
    performer: [
      {
        id: 12,
        lastName: 'Sawatzky',
        firstName: 'David',
        address: '37 Waterford Bay',
        city: 'Winnipeg',
        province: 'MB',
        postalCode: 'R3T 1H6',
        phone: '(204) 599-3521',
        email: 'dave.sawatzky@gmail.com',
        age: 23,
        instrument: 'piano',
        level: '8',
        otherClasses: '',
      },
    ],
  }),
  getters: {
    fullName(): String {
      return this.performer[0].firstName + ' ' + this.performer[0].lastName
    },
  },
  actions: {},
})
