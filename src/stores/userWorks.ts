import { defineStore } from 'pinia'

export const useWorks = defineStore('works', {
  state: () => ({
    registrationID: 0,
    selectedWorks: [
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
  actions: {
    addWork() {
      this.selectedWorks.push({
        id: 0,
        title: '',
        largerWork: '',
        movement: '',
        composer: '',
        duration: '',
      })
    },
    removeWork() {
      this.selectedWorks.pop()
    },
  },
})
