import { defineStore } from 'pinia'

export const useClasses = defineStore('classes', {
  state: () => ({
    registrationID: 0,
    festClasses: [
      {
        id: 1,
        number: '',
        discipline: '',
        subdiscipline: '',
        level: '',
        category: '',
        numSelections: 1,
      },
    ],
  }),
  getters: {},
  actions: {
    addClass() {
      const newId = this.festClasses[this.festClasses.length - 1].id + 1
      this.festClasses.push({
        id: newId,
        number: '',
        discipline: '',
        subdiscipline: '',
        level: '',
        category: '',
        numSelections: 1,
      })
    },
    removeClass(id: number) {
      this.festClasses.splice(id, 1)
    },
  },
})
