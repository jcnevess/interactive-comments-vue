<script setup>
import { useCurrentUserStore } from '@/stores/currentuser'
import { computed, ref } from 'vue'

const props = defineProps({
  replyUser: { type: String, default: undefined },
})

const emit = defineEmits(['addComment', 'addReply'])

const currentUserStore = useCurrentUserStore()

const isReply = computed(() => props.replyUser !== undefined)

let baseComment
if (isReply.value) {
  baseComment = {
    id: Date.now(), // Toy example
    content: undefined,
    createdAt: undefined,
    score: 0,
    replyingTo: props.replyUser,
    user: {
      username: currentUserStore.username,
      image: {
        png: currentUserStore.image.png,
        webp: currentUserStore.image.webp,
      },
    },
  }
} else {
  baseComment = {
    id: Date.now(), // Toy example
    content: undefined,
    createdAt: undefined,
    score: 0,
    user: {
      username: currentUserStore.username,
      image: {
        png: currentUserStore.image.png,
        webp: currentUserStore.image.webp,
      },
    },
    replies: [],
  }
}

const newComment = ref(JSON.parse(JSON.stringify(baseComment)))

// You should add the path here as subdirectories are not served using this strategy,
// Only the filename should be dynamic
const avatarURL = computed(
  () => new URL(`/src/assets/images/avatars/${currentUserStore.image.webp}`, import.meta.url).href,
)

function getFormattedDate() {
  const dateNow = new Date()
  const fmtYear = dateNow.getFullYear()
  const fmtMonth = (dateNow.getMonth() + 1 + '').padStart(2, '0')
  const fmtDate = (dateNow.getDate() + '').padStart(2, '0')
  const fmtHours = (dateNow.getHours() + '').padStart(2, '0')
  const fmtMinutes = (dateNow.getMinutes() + '').padStart(2, '0')
  const fmtSeconds = (dateNow.getSeconds() + '').padStart(2, '0')
  return `${fmtYear}-${fmtMonth}-${fmtDate}T${fmtHours}:${fmtMinutes}:${fmtSeconds}`
}

function registerComment() {
  newComment.value.createdAt = getFormattedDate()
  emit('addComment', newComment.value)
  resetComment()
}

function resetComment() {
  newComment.value = JSON.parse(JSON.stringify(baseComment))
}
</script>

<template>
  <form class="comment-submit" @submit.prevent="registerComment">
    <textarea
      id="comment-entry"
      v-model="newComment.content"
      name="comment-entry"
      class="comment-entry"
      :placeholder="isReply ? `Reply to @${replyUser}` : 'Add a comment...'"
      rows="4"
    ></textarea>
    <img :src="avatarURL" :alt="currentUserStore.username" class="entry-author-photo" />
    <button class="entry-submit">{{ isReply ? 'reply' : 'send' }}</button>
  </form>
</template>

<style scoped>
.comment-submit {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background-color: var(--color-white);
  padding: 1rem;
  row-gap: 1rem;
  border-radius: 5px;
}

.comment-entry {
  grid-column: 1/3;
  border-radius: 5px;
  border-color: var(--color-light-gray);
  padding: 0.75rem 1.25rem;
  resize: none;
  font-size: 0.9em;
  font-family: 'Rubik', sans-serif;
  caret-color: var(--color-moderate-blue);
}

.comment-entry::placeholder {
  font-size: 1.2em;
  font-family: 'Rubik', sans-serif;
}

.comment-entry:focus-visible {
  outline-color: var(--color-moderate-blue);
}

.entry-author-photo {
  width: 32px;
  align-self: center;
}

.entry-submit {
  text-transform: uppercase;
  color: var(--color-white);
  background-color: var(--color-moderate-blue);
  border: none;
  border-radius: 5px;
  font-family: 'Rubik';
  font-size: 1rem;
  justify-self: right;
  padding: 1rem 2rem;
  cursor: pointer;
}

.entry-submit:active {
  background-color: var(--color-light-grayish-blue);
}

@media (min-width: 640px) {
  .comment-submit {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 1rem;
    padding: 1.5rem;
    border-radius: 5px;
  }

  .entry-author-photo {
    align-self: unset;
    order: -1;
  }

  .comment-entry {
    width: 100%;
  }
}
</style>
