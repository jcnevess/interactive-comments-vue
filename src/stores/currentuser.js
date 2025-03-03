import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCurrentUserStore = defineStore('currentUser', () => {
  const username = ref('juliusomo')
  const image = ref({
    png: 'image-juliusomo.png',
    webp: 'image-juliusomo.webp',
  })

  return { username, image }
})
