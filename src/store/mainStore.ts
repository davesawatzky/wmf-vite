import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    registrationType: 'solo', //Solo, Group, or School
    registrationID: 24,
  }),
  getters: {},
  actions: {},
})
