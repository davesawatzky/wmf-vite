import { defineStore } from 'pinia'

export const useRegistration = defineStore('registration', {
  state: () => ({
    registrationType: 'solo', //Solo, Group, or School
    ID: 24,
  }),
  getters: {},
  actions: {},
})
