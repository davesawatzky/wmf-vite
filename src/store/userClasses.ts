import { defineStore } from 'pinia'

export const useClasses = defineStore('selectedClasses', {
  state: () => ({
    registrationID: 0,
    selectedClasses: [
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
      const newId = this.selectedClasses[this.selectedClasses.length - 1].id + 1
      this.selectedClasses.push({
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
      this.selectedClasses.splice(id, 1)
    },
    loadClasses() {},
    saveClasses() {},
  },
})
