import { defineStore } from 'pinia'

export const useGroup = defineStore('group', {
  state: () => ({
    group: [
      {
        groupID: 0,
        option: '', //Vocal, Instrumental
        name: '',
        numberOfPerformers: 0,
        age: 0,
        Instruments: [''],
        studentsInOtherClasses: [''],
        numberOfChaperones: 0,
        numberInWheelchairs: 0,
        earliestTime: '',
        latestTime: '',
        unavailable: {
          date: '',
          time: '',
        },
      },
    ],
  }),
  getters: {},
  actions: {},
})
