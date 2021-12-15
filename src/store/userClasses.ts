import { defineStore } from 'pinia'

export const useClasses = defineStore('classes', {
  state: () => ({
    registrationID: 24,
    classes: [
      {
        classID: 2569,
        classNumber: '5612-8',
        className: 'Bassoon solo',
        numberOfSelections: '1',
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
      {
        classID: 41,
        classNumber: '1405',
        className: 'Vocal Solo',
        numberOfSelections: '1',
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
      {
        classID: 276,
        classNumber: '2555',
        className: 'Piano Solo',
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
