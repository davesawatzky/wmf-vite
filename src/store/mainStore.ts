import { defineStore } from 'pinia'

export const useStore = defineStore('main', {
  state: () => ({
    registrationType: 'solo', //Solo, Group, or School
  }),
  getters: {},
  actions: {},
})
