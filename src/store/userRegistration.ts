import { defineStore } from 'pinia'

export const useRegistration = defineStore('registration', {
  state: () => ({
    id: 0,
    type: '', //SOLO, GROUP, or SCHOOL
    dateTimeSubmitted: Date,
    totalAmt: 0,
    payedAmt: 0,
    transactionInfo: '',
    confirmation: '',
  }),
  getters: {},
  actions: {},
})
