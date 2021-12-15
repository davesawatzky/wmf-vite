import { defineStore } from 'pinia'

export const useClasses = defineStore('classes', {
  state: () => ({
    classID: 0,
    classes: [
      {
        classNumber: '',
        className: '',
        numberOfSelections: '',
        selections: [
          {
            titleID: 0,
            title: '',
            titleOfLargerWork: '',
            movement: '',
            composer: '',
            instrument: '',
            level: '',
            duration: '',
          },
        ],
      },
    ],
  }),
  getters: {},
  actions: {},
})
