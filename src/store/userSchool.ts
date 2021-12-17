import { defineStore } from 'pinia'

export const useSchool = defineStore('school', {
  state: () => ({
    id: 46,
    name: 'Vincent Massey Collegiate',
    division: 'Pembina Trails School Division',
    address: 'Dowker St.',
    city: 'Winnipeg',
    province: 'MB',
    postalCode: 'R3T 1H6',
    phone: '(204) 555-5555',
  }),
  getters: {},
  actions: {},
})
