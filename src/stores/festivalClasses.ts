import { defineStore } from 'pinia'
import { ref } from 'vue'
interface Descriptions {
  subdisciplineDescription: string
  categoryDescription: string
  levelDescription: string
  trophyDescriptions: TrophyDescriptions[]
  required_selection: string
}
interface TrophyDescriptions {
  name: string
  description: string
}

export const festivalClasses = defineStore(
  'festivalClasses',
  () => {
    const descriptions = ref([
      {
        subdisciplineDescription: '',
        categoryDescription: '',
        levelDescription: '',
        trophyDescriptions: [{ name: '', description: '' }],
        required_selection: '',
      },
    ] as Descriptions[])

    function $reset() {
      descriptions.value = [
        {
          subdisciplineDescription: '',
          categoryDescription: '',
          levelDescription: '',
          trophyDescriptions: [{ name: '', description: '' }],
          required_selection: '',
        },
      ]
    }

    function addDescriptions() {
      descriptions.value.push({} as Descriptions)
    }

    function removeDescriptions(index: number) {
      descriptions.value.splice(index, 1)
    }

    return { descriptions, $reset, addDescriptions, removeDescriptions }
  },
  {
    persist: true,
  }
)
