import { defineStore } from 'pinia'

export const usePerformers = defineStore('performers', {
  state: () => ({
    performer: [
      {
        performerID: 12,
        lastName: 'Sawatzky',
        firstName: 'David',
        address: '37 Waterford Bay',
        city: 'Winnipeg',
        province: 'MB',
        postalCode: 'R3T 1H6',
        phone: '(204) 599-3521',
        email: 'dave.sawatzky@gmail.com',
        instrument: 'piano',
        level: '8',
        age: 23,
        otherClasses: ['2434, 4567, 9876'],
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
