import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCurrentUserStore = defineStore('currentUser', () => {
  const username = ref('juliusomo')
  const image = ref({
    png: 'src/assets/images/avatars/image-juliusomo.png',
    webp: 'src/assets/images/avatars/image-juliusomo.webp',
  })

  return { username, image }
})
