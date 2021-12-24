import { defineStore } from 'pinia'

export const useClasses = defineStore('classes', {
  state: () => ({
    registrationID: 0,
    classes: [
      {
        id: 0,
        number: '',
        discipline: '',
        subdiscipline: '',
        level: '',
        category: '',
        numSelections: 0,
      },
    ],
  }),
  getters: {},
  actions: {},
})
