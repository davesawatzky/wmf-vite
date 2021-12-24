import { defineStore } from 'pinia'

export const useSelections = defineStore('selections', {
  state: () => ({
    registrationID: 0,
    selection: [
      {
        id: 0,
        title: '',
        largerWork: '',
        movement: '',
        composer: '',
        duration: '',
      },
    ],
  }),
  getters: {},
  actions: {},
})
