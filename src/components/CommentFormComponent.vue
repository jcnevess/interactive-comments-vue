<script setup>
import { useCurrentUserStore } from '@/stores/currentuser'

const currentUserStore = useCurrentUserStore()
</script>

<template>
  <form class="comment-submit" action="#">
    <textarea
      name="comment-entry"
      id="comment-entry"
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
