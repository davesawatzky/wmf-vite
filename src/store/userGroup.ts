import { defineStore } from 'pinia'

export const useGroup = defineStore('groups', {
  state: () => ({
    group: [
      {
        id: 0,
        option: '', //Vocal, Instrumental
        name: '',
        numberOfPerformers: 0,
        age: 0,
        Instruments: '',
        studentsInOtherClasses: '',
        numberOfChaperones: 0,
        numberInWheelchairs: 0,
        earliestTime: '',
        latestTime: '',
        unavailable: [
          {
            id: 0,
            date: '',
            time: '',
          },
        ],
      },
    ],
  }),
  getters: {},
  actions: {},
})
