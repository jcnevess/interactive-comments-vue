<script setup>
import { useCurrentUserStore } from '@/stores/currentuser'
import { computed, ref } from 'vue'

const props = defineProps({
  replyUser: { type: String, default: undefined },
})

const emit = defineEmits(['submitComment', 'submitReply'])

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

function registerComment() {
  const dateNow = new Date()
  newComment.value.createdAt = `${dateNow.getFullYear()}-${(dateNow.getMonth() + 1 + '').padStart(2, '0')}-${(dateNow.getDate() + '').padStart(2, '0')}`
  emit('submitComment', newComment.value)
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
      placeholder="Add a comment..."
      rows="4"
    ></textarea>
    <img
      :src="currentUserStore.image.webp"
      :alt="currentUserStore.username"
      class="entry-author-photo"
    />
    <button class="entry-submit">send</button>
  </form>
</template>

<style scoped>
.comment-submit {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  background-color: var(--color-white);
  padding: 1rem;
  row-gap: 1rem;
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
</style>
